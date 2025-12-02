import { useCallback, useMemo, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { supabase } from '../../utils/supabase'

const normalizeTitle = (title) =>
  typeof title === 'string' && title.trim().length ? title.trim() : 'Vehicle acquired'

export const useRatingScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { sellerId, sellerName, listingTitle } = route.params ?? {}

  const [selectedRating, setSelectedRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const formattedTitle = useMemo(() => normalizeTitle(listingTitle), [listingTitle])

  const close = useCallback(() => {
    if (!submitting) navigation.goBack()
  }, [navigation, submitting])

  const goHome = useCallback(() => {
    navigation.popToTop()
    navigation.getParent()?.navigate('Home')
  }, [navigation])

  const submit = useCallback(async () => {
    if (!sellerId) {
      setError('Seller information is missing.')
      return false
    }
    if (!selectedRating) {
      setError('Select a rating to continue.')
      return false
    }

    setSubmitting(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('rating_avg, rating_count')
      .eq('id', sellerId)
      .maybeSingle()

    if (fetchError) {
      setError('Unable to fetch current rating.')
      setSubmitting(false)
      return false
    }

    const currentAvg = Number(data?.rating_avg) || 0
    const currentCount = Number(data?.rating_count) || 0
    const nextCount = currentCount + 1
    const nextAvg = Number(
      ((currentAvg * currentCount + selectedRating) / nextCount).toFixed(2)
    )

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ rating_avg: nextAvg, rating_count: nextCount })
      .eq('id', sellerId)

    setSubmitting(false)

    if (updateError) {
      setError('We could not save your rating.')
      return false
    }

    return true
  }, [sellerId, selectedRating])

  return {
    sellerId,
    sellerName,
    formattedTitle,
    selectedRating,
    setSelectedRating,
    submitting,
    error,
    submitRating: submit,
    closeScreen: close,
    navigateHome: goHome,
    resetRating: () => setSelectedRating(0),
    isSellerMissing: !sellerId,
  }
}
