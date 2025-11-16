import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../../util/supabase'
import { homeListingDetailScreenStyles } from '../HomeStyles'
import { palette } from '../../../theme/palette'
import { useAuth } from '../../../context/AuthContext'
import { APP_EVENTS, emitEvent, subscribeToEvent } from '../../../util/eventBus'

const REQUIRED_FIELDS = [
  'description',
  'make',
  'model',
  'year',
  'mileage',
  'fuel_type',
  'transmission',
  'doors',
  'color',
  'images',
  'created_at',
]

const formatPrice = (value) => {
  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('es-ES')}`
  }

  return value ?? 'Precio no disponible'
}

const formatDate = (value) => {
  if (!value) {
    return 'Fecha no disponible'
  }

  try {
    return new Date(value).toLocaleDateString('es-ES')
  } catch {
    return 'Fecha no disponible'
  }
}

const normalizeImages = (value) => {
  if (Array.isArray(value)) {
    return value.filter((uri) => typeof uri === 'string' && uri.trim().length > 0)
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed)
        ? parsed.filter((uri) => typeof uri === 'string' && uri.trim().length > 0)
        : []
    } catch {
      return []
    }
  }

  return []
}

const windowWidth = Dimensions.get('window').width

const hasRequiredFields = (listing) =>
  listing &&
  REQUIRED_FIELDS.every((field) => Object.prototype.hasOwnProperty.call(listing, field))

const ATTRIBUTE_LABELS = [
  { key: 'make', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'year', label: 'Año' },
  { key: 'mileage', label: 'Kilometraje', suffix: ' km' },
  { key: 'fuel_type', label: 'Combustible' },
  { key: 'transmission', label: 'Transmisión' },
  { key: 'doors', label: 'Puertas' },
  { key: 'color', label: 'Color' },
]

const FAVORITE_NOT_FOUND_CODES = new Set(['PGRST116', 'PGRST114'])

export default function ListingDetailScreen() {
  const route = useRoute()
  const params = route.params ?? {}
  const listingId = params.listingId ?? params?.listing?.id ?? null
  const initialListing = params.listing ?? null
  const { user } = useAuth()

  const [listing, setListing] = useState(initialListing)
  const [loading, setLoading] = useState(!hasRequiredFields(initialListing))
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    const shouldFetch = !hasRequiredFields(initialListing) && listingId

    if (!shouldFetch) {
      return
    }

    let isMounted = true

    const fetchListing = async () => {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('listings')
        .select(
          'id, title, description, price, make, model, year, mileage, fuel_type, transmission, doors, color, images, created_at'
        )
        .eq('id', listingId)
        .maybeSingle()

      if (!isMounted) {
        return
      }

      if (queryError) {
        console.error(queryError)
        setError('No es posible cargar el vehículo en este momento.')
      } else {
        setListing(data)
      }

      setLoading(false)
    }

    fetchListing()

    return () => {
      isMounted = false
    }
  }, [initialListing, listingId])

  const images = useMemo(() => normalizeImages(listing?.images), [listing?.images])

  const caption = useMemo(() => {
    if (!listing?.created_at) {
      return null
    }
    return `Publicado el ${formatDate(listing.created_at)}`
  }, [listing?.created_at])

  useEffect(() => {
    let isMounted = true

    const fetchFavoriteStatus = async () => {
      if (!user || !listingId) {
        if (isMounted) {
          setIsFavorite(false)
          setFavoriteLoading(false)
        }
        return
      }

      if (isMounted) {
        setFavoriteLoading(true)
      }

      try {
        const { data, error: favoritesError } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('listing_id', listingId)
          .maybeSingle()

        if (favoritesError && !FAVORITE_NOT_FOUND_CODES.has(favoritesError.code)) {
          throw favoritesError
        }

        if (isMounted) {
          setIsFavorite(Boolean(data))
        }
      } catch (favoriteStatusError) {
        console.error('Error fetching favorite status (home detail)', favoriteStatusError)
      } finally {
        if (isMounted) {
          setFavoriteLoading(false)
        }
      }
    }

    fetchFavoriteStatus()

    return () => {
      isMounted = false
    }
  }, [listingId, user])

  useEffect(() => {
    const unsubscribe = subscribeToEvent(APP_EVENTS.FAVORITES_UPDATED, (payload) => {
      if (!payload || payload.listingId !== listingId) {
        return
      }

      setIsFavorite(payload.action !== 'removed')
    })

    return unsubscribe
  }, [listingId])

  const handleToggleFavorite = useCallback(async () => {
    if (!user || !listingId || favoriteLoading) {
      return
    }

    setFavoriteLoading(true)

    try {
      const isCurrentlyFavorite = isFavorite
      const mutation = isCurrentlyFavorite
        ? supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('listing_id', listingId)
        : supabase.from('favorites').insert({
            user_id: user.id,
            listing_id: listingId,
          })

      const { error: mutationError } = await mutation

      if (mutationError) {
        throw mutationError
      }

      const nextFavoriteState = !isCurrentlyFavorite
      setIsFavorite(nextFavoriteState)
      emitEvent(APP_EVENTS.FAVORITES_UPDATED, {
        listingId,
        action: nextFavoriteState ? 'added' : 'removed',
      })
    } catch (toggleError) {
      console.error('Error updating favorites from home detail', toggleError)
    } finally {
      setFavoriteLoading(false)
    }
  }, [favoriteLoading, isFavorite, listingId, user])

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={palette.accent} />
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {listing && (
          <>
            <View style={styles.galleryWrapper}>
              {images.length > 0 ? (
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                >
                  {images.map((uri, index) => (
                    <Image
                      key={`${uri}-${index}`}
                      source={{ uri }}
                      style={[styles.galleryImage, { width: windowWidth - 32 }]}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={[
                    styles.galleryImage,
                    styles.galleryPlaceholder,
                    { width: windowWidth - 32 },
                  ]}
                >
                  <Text style={styles.galleryPlaceholderText}>Sin imagen</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderText}>
                  <Text style={styles.title}>{listing.title}</Text>
                  <Text style={styles.price}>{formatPrice(listing.price)}</Text>
                </View>
                <TouchableOpacity
                  accessibilityLabel={
                    isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
                  }
                  accessibilityRole="button"
                  style={[
                    styles.favoriteButton,
                    isFavorite && styles.favoriteButtonActive,
                    (favoriteLoading || !user) && styles.favoriteButtonDisabled,
                  ]}
                  activeOpacity={0.8}
                  onPress={handleToggleFavorite}
                  disabled={favoriteLoading || !user}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {favoriteLoading ? (
                    <ActivityIndicator size="small" color={palette.textPrimary} />
                  ) : (
                    <Text
                      style={[
                        styles.favoriteIcon,
                        isFavorite && styles.favoriteIconActive,
                      ]}
                    >
                      {isFavorite ? '♥' : '♡'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              {caption && <Text style={styles.caption}>{caption}</Text>}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>
                {listing.description?.trim() || 'No hay una descripción disponible.'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Especificaciones técnicas</Text>
              <View>
                {ATTRIBUTE_LABELS.map(({ key, label, suffix }, index) => (
                  <View
                    key={key}
                    style={[
                      styles.attributeRow,
                      index !== 0 && styles.attributeRowSpacing,
                    ]}
                  >
                    <Text style={styles.attributeLabel}>{label}</Text>
                    <Text style={styles.attributeValue}>
                      {listing?.[key] ?? 'Dato no disponible'}
                      {listing?.[key] != null && suffix ? suffix : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {!loading && !listing && !error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              El anuncio solicitado no se encontró.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = homeListingDetailScreenStyles
