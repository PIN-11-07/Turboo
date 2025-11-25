import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../util/supabase'

const notFoundErrorCodes = new Set(['PGRST116', 'PGRST114'])

const LISTING_FIELDS =
  'id, user_id, title, description, price, make, model, year, mileage, fuel_type, transmission, doors, color, images, created_at'

const extractName = (supabaseUser) => {
  if (!supabaseUser) {
    return null
  }

  const metadata =
    supabaseUser.user_metadata ??
    supabaseUser.raw_user_meta_data ??
    supabaseUser.app_metadata ??
    {}

  return (
    (typeof metadata.full_name === 'string' && metadata.full_name.trim()) ||
    (typeof metadata.name === 'string' && metadata.name.trim()) ||
    (typeof metadata.display_name === 'string' && metadata.display_name.trim()) ||
    null
  )
}

const mapFavoritesToListings = (favoritesData) =>
  (favoritesData ?? [])
    .map((favorite) => favorite?.listing)
    .filter((listing) => listing && listing.id)

export const useProfileScreen = () => {
  const { user, signOut } = useAuth()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)
  const [listings, setListings] = useState([])
  const [favoriteListings, setFavoriteListings] = useState([])
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fetchProfile = async () => {
      if (!user) {
        if (isMounted) {
          setProfile(null)
          setListings([])
          setFavoriteListings([])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [
          { data: authData, error: authError },
          { data: profileData, error: profileError },
          { data: listingsData, error: listingsError },
          { data: favoritesData, error: favoritesError },
        ] = await Promise.all([
          supabase.auth.getUser(),
          supabase
            .from('profiles')
            .select('profile_image_url, saldo')
            .eq('id', user.id)
            .maybeSingle(),
          supabase
            .from('listings')
            .select(LISTING_FIELDS)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('favorites')
            .select(`listing:listing_id (${LISTING_FIELDS})`)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        ])

        if (authError) {
          throw authError
        }

        if (profileError && !notFoundErrorCodes.has(profileError.code)) {
          throw profileError
        }

        if (listingsError) {
          throw listingsError
        }
        if (favoritesError) {
          throw favoritesError
        }

        if (!isMounted) {
          return
        }

        const authUser = authData?.user ?? null

        const name = extractName(authUser) || extractName(user) || null

        const mail =
          (typeof authUser?.email === 'string' && authUser.email.trim()) ||
          (typeof user?.email === 'string' && user.email.trim()) ||
          null

        setProfile({
          name,
          mail,
          profileImageUrl: profileData?.profile_image_url || null,
          balance:
            profileData && profileData.saldo != null
              ? Number(profileData.saldo)
              : 0,
        })
        setListings(Array.isArray(listingsData) ? listingsData : [])
        setFavoriteListings(mapFavoritesToListings(favoritesData))
      } catch (fetchError) {
        console.error(fetchError)
        if (isMounted) {
          setError('No es posible cargar el perfil. Inténtalo de nuevo más tarde.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      isMounted = false
    }
  }, [refreshTick, user])

  useFocusEffect(
    useCallback(() => {
      setRefreshTick((prev) => prev + 1)
    }, [])
  )

  const avatarInitial = useMemo(() => {
    const fallbackName = profile?.name || user?.email || ''
    return fallbackName.trim().charAt(0).toUpperCase() || '?'
  }, [profile?.name, user?.email])

  const handleListingPress = useCallback(
    (listing) => {
      if (!listing?.id) {
        return
      }
      navigation.navigate('ListingDetail', {
        listingId: listing.id,
        listing,
      })
    },
    [navigation]
  )

  const handleFavoriteRemoval = useCallback((listingId) => {
    setFavoriteListings((prev) =>
      prev.filter((favorite) => favorite.id !== listingId)
    )
  }, [])

  return {
    user,
    signOut,
    loading,
    error,
    profile,
    listings,
    favoriteListings,
    avatarInitial,
    handleListingPress,
    handleFavoriteRemoval,
  }
}
