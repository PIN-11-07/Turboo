import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F4F8',
  },
  scrollContent: {
    padding: 16,
  },
  loader: {
    marginTop: 24,
    alignItems: 'center',
  },
  errorBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FDECEA',
  },
  errorText: {
    color: '#C62828',
    fontSize: 16,
    textAlign: 'center',
  },
  galleryWrapper: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  galleryImage: {
    height: 220,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  galleryPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryPlaceholderText: {
    color: '#6B7280',
    fontSize: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    color: '#111827',
    fontWeight: '700',
  },
  price: {
    fontSize: 20,
    color: '#0B5FFF',
    fontWeight: '600',
    marginTop: 8,
  },
  caption: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attributeRowSpacing: {
    marginTop: 12,
  },
  attributeLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  attributeValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },
})
