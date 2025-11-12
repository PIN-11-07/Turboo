import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../../util/supabase'
import { profileListingDetailScreenStyles } from '../profileStyles'

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
    return `€ ${numericValue.toLocaleString('it-IT')}`
  }

  return value ?? 'Prezzo non disponibile'
}

const formatDate = (value) => {
  if (!value) {
    return 'Data non disponibile'
  }

  try {
    return new Date(value).toLocaleDateString('it-IT')
  } catch {
    return 'Data non disponibile'
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
  { key: 'model', label: 'Modello' },
  { key: 'year', label: 'Anno' },
  { key: 'mileage', label: 'Chilometraggio', suffix: ' km' },
  { key: 'fuel_type', label: 'Carburante' },
  { key: 'transmission', label: 'Cambio' },
  { key: 'doors', label: 'Porte' },
  { key: 'color', label: 'Colore' },
]

export default function ListingDetailScreen() {
  const route = useRoute()
  const params = route.params ?? {}
  const listingId = params.listingId ?? params?.listing?.id ?? null
  const initialListing = params.listing ?? null

  const [listing, setListing] = useState(initialListing)
  const [loading, setLoading] = useState(!hasRequiredFields(initialListing))
  const [error, setError] = useState(null)

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
        setError('Non è possibile caricare il veicolo in questo momento.')
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
    return `Pubblicato il ${formatDate(listing.created_at)}`
  }, [listing?.created_at])

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
            <ActivityIndicator size="large" color="#0B5FFF" />
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
                  <Text style={styles.galleryPlaceholderText}>Nessuna immagine</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.title}>{listing.title}</Text>
              <Text style={styles.price}>{formatPrice(listing.price)}</Text>
              {caption && <Text style={styles.caption}>{caption}</Text>}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrizione</Text>
              <Text style={styles.description}>
                {listing.description?.trim() || 'Nessuna descrizione disponibile.'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specifiche tecniche</Text>
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
                      {listing?.[key] ?? 'Dato non disponibile'}
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
              L'annuncio richiesto non è stato trovato.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = profileListingDetailScreenStyles
