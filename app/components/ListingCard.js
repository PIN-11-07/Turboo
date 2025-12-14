import React, { memo, useMemo } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { palette } from '../theme/palette'
import FavoriteButton from './FavoriteButton'
import { formatPrice } from '../utils/format'

const FONT_FAMILY = 'OTJubileeGolden'

const getMainImage = (images) => (Array.isArray(images) && images.length > 0 ? images[0] : null)

function ListingCard({ item, onPress, style }) {
  const mainImage = getMainImage(item.images)

  const { title, subtitle } = useMemo(() => {
    const computedTitle = (item.title || `${item.make ?? ''} ${item.model ?? ''}`.trim()).trim() || 'Vehicle'
    const subtitleParts = []
    if (item.year) {
      subtitleParts.push(item.year)
    }
    if (item.mileage) {
      subtitleParts.push(`${item.mileage} km`)
    }

    return {
      title: computedTitle,
      subtitle: subtitleParts.join(' • '),
    }
  }, [item.title, item.make, item.model, item.year, item.mileage])

  return (
    <TouchableOpacity style={[styles.card, style]} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.cardImageWrapper}>
        {mainImage ? (
          <Image source={{ uri: mainImage }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Text style={styles.cardImagePlaceholderText}>No photo</Text>
          </View>
        )}
        <FavoriteButton listingId={item.id} variant="overlay" />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default memo(ListingCard)

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImageWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
    backgroundColor: palette.overlay,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.overlay,
  },
  cardImagePlaceholderText: {
    color: palette.textSecondary,
    fontWeight: '600',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textPrimary,
    fontFamily: FONT_FAMILY,
  },
  cardSubtitle: {
    fontSize: 13,
    color: palette.textMuted,
    marginTop: 2,
    fontFamily: FONT_FAMILY,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.accent,
    marginTop: 6,
    fontFamily: FONT_FAMILY,
  },
})
