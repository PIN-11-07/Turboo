import React from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { listingDetailScreenStyles as styles } from './ListingDetailStyles'
import FavoriteButton from '../../components/FavoriteButton'
import { useAuth } from '../../context/AuthContext'
import { useListingDetail } from './useListingDetail'
import { palette } from '../../theme/palette'

const formatPrice = (value) => {
  const numericValue = Number(value)
  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('en-US')}`
  }
  return value ?? 'Ask for price'
}

const ATTRIBUTE_LABELS = [
  { key: 'make', label: 'Make' },
  { key: 'model', label: 'Model' },
  { key: 'year', label: 'Year' },
  { key: 'mileage', label: 'Mileage', suffix: ' km' },
  { key: 'fuel_type', label: 'Fuel' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'doors', label: 'Doors' },
  { key: 'color', label: 'Color' },
]

const ACCENT_COLOR = palette.mustard
const ACCENT_COLOR_DARK = palette.darkMustard
const STAR_COLOR = palette.mustard

export default function ListingDetailScreen() {
  const { listing, listingId, loading, error, images, sellerName, sellerRating, sellerProfileImageUrl } =
    useListingDetail()
  const navigation = useNavigation()
  const { user } = useAuth()

  const isOwner = listing?.user_id && user?.id === listing.user_id

  const handleBuyPress = () => {
    if (!listingId || !listing || isOwner) {
      return
    }
    navigation.navigate('Purchase', { listingId, listing })
  }

  const handleContactPress = () => {
    navigation.navigate('Chat', {
      listing,
      sellerName,
      sellerRating,
    })
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
      </View>
    )
  }

  if (error || (!loading && !listing)) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || 'This vehicle is not available.'}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: ACCENT_COLOR }}>Go back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const normalizedSellerRating = Number.isFinite(Number(sellerRating))
    ? Number(sellerRating)
    : null
  const sellerBadgeValue = listing?.sales_count ?? '1'

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={palette.darkGrey} />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> TECHNICAL SHEET</Text>
        <View style={styles.iconButton}>
          <FavoriteButton
            listingId={listingId}
            variant="detail"
            style={{ backgroundColor: 'transparent', borderWidth: 0 }}
            iconStyle={{ fontSize: 24 }}
            iconActiveStyle={{ color: palette.champagne }}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Block */}
        <View style={styles.titleBlock}>
          <Text style={styles.carTitle}>{listing.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(listing.price)}</Text>
          </View>
        </View>
        {/* Hero Image */}
        <View style={styles.imageSection}>
          {images.length > 0 ? (
            <Image source={{ uri: images[0] }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, { backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="car-sport-outline" size={64} color="#333" />
            </View>
          )}
        </View>

        {/* Gallery Thumbnails */}
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.galleryList}
          >
            {images.slice(1).map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.galleryThumbnail}
              />
            ))}
          </ScrollView>
        )}

        {/* About Section */}
        <View style={styles.aboutSection}>
          <LinearGradient
            colors={[ACCENT_COLOR_DARK, palette.darkGrey]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.aboutGradient}
          >
            <Text style={styles.sectionTitleWhite}>About</Text>
            <Text style={styles.descriptionText}>
              {listing.description || 'No description available.'}
            </Text>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        {!isOwner && (
          <View style={styles.actionsSection}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
              onPress={handleContactPress}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.secondaryButtonText,
                    pressed && styles.secondaryButtonTextPressed,
                  ]}
                >
                  Contact seller
                </Text>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={handleBuyPress}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.primaryButtonText,
                    pressed && styles.primaryButtonTextPressed,
                  ]}
                >
                  Buy car
                </Text>
              )}
            </Pressable>
          </View>
        )}

        {/* Specs Section */}
        <View style={styles.specsSection}>
          <View style={styles.specsGrid}>
            {ATTRIBUTE_LABELS.map(({ key, label, suffix }) => (
              <View key={key} style={styles.specItem}>
                <Text style={styles.specLabel}>{label}</Text>
                <Text style={styles.specValue} numberOfLines={1}>
                  {listing[key] ? `${String(listing[key]).charAt(0).toUpperCase()}${String(listing[key]).slice(1)}${suffix || ''}` : '-'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Seller Section */}
        <View style={styles.sellerSection}>
          <Text style={styles.sellerLabel}>Sold by</Text>
          <View style={styles.sellerCardPill}>
            <LinearGradient
              colors={[palette.mustard, palette.darkGrey]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sellerBadge}
            >
              <Text style={styles.sellerBadgeText}>{sellerBadgeValue}</Text>
            </LinearGradient>
            <View style={styles.sellerAvatarPill}>
              {sellerProfileImageUrl ? (
                <Image source={{ uri: sellerProfileImageUrl }} style={styles.sellerAvatarImage} />
              ) : (
                <Text style={styles.sellerAvatarText}>
                  {sellerName ? sellerName.charAt(0).toUpperCase() : 'S'}
                </Text>
              )}
            </View>
            <View style={styles.sellerPillInfo}>
              <Text style={styles.sellerName}>{sellerName || 'Seller'}</Text>
            </View>
            <View style={styles.sellerPillRating}>
              {normalizedSellerRating !== null ? (
                <View style={styles.sellerRatingCompact}>
                  <Text style={styles.sellerRatingValue}>{normalizedSellerRating.toFixed(1)}</Text>
                  <Ionicons name="star" size={18} color={palette.mustard} style={{ marginLeft: 4 }} />
                </View>
              ) : (
                <Text style={styles.sellerRatingValue}>—</Text>
              )}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerCta}>
            <LinearGradient
              colors={[palette.darkMustard, palette.darkGrey]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.footerGradient}
            >
              <Text style={styles.footerText}>Interested?</Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
