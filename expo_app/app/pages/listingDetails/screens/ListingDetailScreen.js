import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { listingDetailScreenStyles } from '../ListingDetailStyles'
import { palette } from '../../../theme/palette'
import FavoriteButton from '../../../components/FavoriteButton'
import { useListingDetailScreen } from '../hooks/useListingDetailScreen'

const formatPrice = (value) => {
  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('es-ES')}`
  }

  return value ?? 'Precio no disponible'
}

const windowWidth = Dimensions.get('window').width

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

export default function ListingDetailScreen() {
  const { listing, listingId, loading, error, images, caption } =
    useListingDetailScreen()

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
                <FavoriteButton listingId={listingId} variant="detail" />
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

const styles = listingDetailScreenStyles
