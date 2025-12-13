import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { palette } from '../theme/palette';
import FavoriteButton from './FavoriteButton';

const formatPrice = (value) => {
  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('es-ES')}`;
  }
  return value ?? '-';
};

const getMainImage = (images) =>
  Array.isArray(images) && images.length > 0 ? images[0] : null;

export default function CarItem({
  item,
  onPress,
  onFavoriteChange,
}) {
  const mainImage = getMainImage(item.images);
  
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.cardImageWrapper}>
        {mainImage ? (
          <Image source={{ uri: mainImage }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Text style={styles.cardImagePlaceholderText}>Sin foto</Text>
          </View>
        )}
        <FavoriteButton 
          listingId={item.id} 
          variant="overlay" 
          onStatusChange={onFavoriteChange}
        />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
        </View>
        <Text style={styles.cardSubtitle}>
          {item.make} {item.model} • {item.year}
        </Text>
        <View style={styles.cardBadgeRow}>
          <Text style={styles.cardBadge}>
            {item.mileage ? `${item.mileage} km` : 'km s/d'}
          </Text>
          {item.fuel_type ? (
            <Text style={styles.cardBadge}>{item.fuel_type}</Text>
          ) : null}
          {item.transmission ? (
            <Text style={styles.cardBadge}>{item.transmission}</Text>
          ) : null}
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardLocation}>{item.location}</Text>
          <Text style={styles.cardMeta}>
            {item.doors ? `${item.doors} puertas` : item.color || 'Detalles s/d'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardImageWrapper: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 130,
  },
  cardImagePlaceholder: {
    backgroundColor: palette.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImagePlaceholderText: {
    color: palette.textSecondary,
    fontWeight: '600',
  },
  cardContent: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  cardSubtitle: {
    fontSize: 15,
    color: palette.textSecondary,
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.accent,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  cardBadge: {
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    color: palette.accent,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  cardLocation: {
    fontSize: 13,
    color: palette.textMuted,
    fontWeight: '500',
  },
  cardMeta: {
    fontSize: 12,
    color: palette.textMuted,
  },
});