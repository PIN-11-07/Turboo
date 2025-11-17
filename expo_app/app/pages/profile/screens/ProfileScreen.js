import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../util/supabase'
import { profileScreenStyles } from '../profileStyles'
import FavoriteButton from '../../../components/FavoriteButton'

const notFoundErrorCodes = new Set(['PGRST116', 'PGRST114'])

const LISTING_FIELDS =
  'id, title, description, price, make, model, year, mileage, fuel_type, transmission, doors, color, images, created_at'

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

const formatPrice = (value) => {
  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('es-ES')}`
  }

  if (typeof value === 'string' && value.trim()) {
    return value
  }

  return 'Precio a petición'
}

const mapFavoritesToListings = (favoritesData) =>
  (favoritesData ?? [])
    .map((favorite) => favorite?.listing)
    .filter((listing) => listing && listing.id)

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)
  const [listings, setListings] = useState([])
  const [favoriteListings, setFavoriteListings] = useState([])

  const refreshFavoriteListings = useCallback(async () => {
    if (!user) {
      setFavoriteListings([])
      return
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`listing:listing_id (${LISTING_FIELDS})`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setFavoriteListings(mapFavoritesToListings(data))
    } catch (refreshError) {
      console.error('Error refreshing favorite listings', refreshError)
    }
  }, [user])

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
        ] =
          await Promise.all([
            supabase.auth.getUser(),
            supabase
              .from('profiles')
              .select('profile_image_url')
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

        const name =
          extractName(authUser) ||
          extractName(user) ||
          null

        const mail =
          (typeof authUser?.email === 'string' && authUser.email.trim()) ||
          (typeof user?.email === 'string' && user.email.trim()) ||
          null

        setProfile({
          name,
          mail,
          profileImageUrl: profileData?.profile_image_url || null,
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
  }, [user])

  useFocusEffect(
    useCallback(() => {
      refreshFavoriteListings()
    }, [refreshFavoriteListings])
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
      navigation.navigate('ProfileListingDetail', {
        listingId: listing.id,
        listing,
      })
    },
    [navigation]
  )

  const renderListingCard = useCallback(
    (listing, keyPrefix = 'listing', allowFavoriteToggle = false) => {
      if (!listing?.id) {
        return null
      }

      const hasImage = Array.isArray(listing.images) && listing.images.length > 0
      const firstImage = hasImage ? listing.images[0] : null
      const publishDate = listing.created_at
        ? new Date(listing.created_at).toLocaleDateString('es-ES')
        : 'fecha s/d'

      const handleFavoriteChange = (nextValue) => {
        if (!nextValue) {
          setFavoriteListings((prev) =>
            prev.filter((favorite) => favorite.id !== listing.id)
          )
        }
      }

      return (
        <TouchableOpacity
          key={`${keyPrefix}-${listing.id}`}
          style={styles.listingCard}
          onPress={() => handleListingPress(listing)}
          activeOpacity={0.8}
        >
          <View style={styles.listingImageWrapper}>
            {firstImage ? (
              <Image
                source={{ uri: firstImage }}
                style={styles.listingImage}
                resizeMode="cover\"
              />
            ) : (
              <View style={styles.listingImagePlaceholder}>
                <Text style={styles.listingImagePlaceholderText}>Sin foto</Text>
              </View>
            )}
          </View>
          <View style={styles.listingInfo}>
            <View style={styles.listingInfoHeader}>
              <Text style={styles.listingTitle} numberOfLines={2}>
                {listing.title}
              </Text>
              {allowFavoriteToggle ? (
                <FavoriteButton
                  listingId={listing.id}
                  variant="list\"
                  initialIsFavorite
                  fetchOnMount={false}
                  onStatusChange={handleFavoriteChange}
                />
              ) : null}
            </View>
            <Text style={styles.listingPrice}>{formatPrice(listing.price)}</Text>
            <Text style={styles.listingDate}>Publicado el {publishDate}</Text>
          </View>
        </TouchableOpacity>
      )
    },
    [handleListingPress]
  )

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0B5FFF" />
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )
    }

    if (!user) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.infoText}>Inicia sesión para ver el perfil.</Text>
        </View>
      )
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarWrapper}>
          {profile?.profileImageUrl ? (
            <Image
              source={{ uri: profile.profileImageUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{avatarInitial}</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Nombre</Text>
          <Text style={styles.cardValue}>{profile?.name || 'No disponible'}</Text>

          <Text style={styles.cardLabel}>Correo electrónico</Text>
          <Text style={styles.cardValue}>{profile?.mail || 'No disponible'}</Text>

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus anuncios</Text>
          {listings.length === 0 ? (
            <Text style={styles.emptyState}>Todavía no has publicado anuncios.</Text>
          ) : (
            listings.map((listing) => renderListingCard(listing, 'own'))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus favoritos</Text>
          {favoriteListings.length === 0 ? (
            <Text style={styles.emptyState}>Todavía no has marcado favoritos.</Text>
          ) : (
            favoriteListings.map((listing) =>
              renderListingCard(listing, 'favorite', true)
            )
          )}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {renderContent()}
    </SafeAreaView>
  )
}

const styles = profileScreenStyles
