import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import recommender from '../../utils/recommender'

export const useRecommendationsScreen = () => {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [visibleCount, setVisibleCount] = useState(1) // start by showing only the featured card

  const loadRecommendations = useCallback(async () => {
    try {
      const recs = await recommender.getRecommendationsForUser(user?.id, { limit: 24 })
      // recommender returns scored list (best first)
      setRecommendations(recs || [])
    } catch (error) {
      console.warn('[useRecommendationsScreen] load error', error)
    }
  }, [user?.id])

  useEffect(() => {
    loadRecommendations()
  }, [loadRecommendations])

  const featured = useMemo(
    () => (recommendations && recommendations.length > 0 ? recommendations[0] : null),
    [recommendations]
  )

  const visibleItems = useMemo(() => {
    const remaining = recommendations && recommendations.length > 1 ? recommendations.slice(1) : []
    const count = Math.max(0, visibleCount - (featured ? 1 : 0))
    return remaining.slice(0, count)
  }, [featured, recommendations, visibleCount])

  const onEndReached = useCallback(() => {
    // reveal 3 more items each time until the list is exhausted
    setVisibleCount((current) => Math.min(recommendations.length, current + 3))
  }, [recommendations.length])

  return {
    recommendations,
    featured,
    visibleItems,
    onEndReached,
  }
}
