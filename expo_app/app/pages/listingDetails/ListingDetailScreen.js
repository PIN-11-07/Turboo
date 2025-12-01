import React from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { listingDetailScreenStyles as styles } from './ListingDetailStyles'
import FavoriteButton from '../../components/FavoriteButton'
import { useAuth } from '../../context/AuthContext'
import { useListingDetailScreen } from './useListingDetailScreen'

const formatPrice = (value) => {
  const numericValue = Number(value)
  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('es-ES')}`
  }
  return value ?? 'Consultar'
}

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
  const { listing, listingId, loading, error, images, sellerName, sellerRating, sellerProfileImageUrl } =
    useListingDetailScreen()
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
    // Placeholder for contact action
    console.log('Contact seller')
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#887E1D" />
      </View>
    )
  }

  if (error || (!loading && !listing)) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || 'El vehículo no está disponible.'}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#887E1D' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FICHA TÉCNICA</Text>
        <View style={styles.iconButton}>
          <FavoriteButton
            listingId={listingId}
            variant="detail"
            style={{ backgroundColor: 'transparent', borderWidth: 0 }}
            iconStyle={{ color: '#FFFFFF', fontSize: 24 }}
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
            <View style={styles.interactionRow}>
              <View style={styles.interactionItem}>
                <Ionicons name="eye-outline" size={16} color="#887E1D" />
                <Text style={styles.interactionText}>1.2k</Text>
              </View>
              <View style={styles.interactionItem}>
                <Ionicons name="heart-outline" size={16} color="#887E1D" />
                <Text style={styles.interactionText}>24</Text>
              </View>
            </View>
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
            colors={['#85570F', '#090809']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.aboutGradient}
          >
            <Text style={styles.sectionTitleWhite}>Sobre este vehículo</Text>
            <Text style={styles.descriptionText}>
              {listing.description || 'Sin descripción disponible.'}
            </Text>
          </LinearGradient>
        </View>

        {/* Specs Section */}
        <View style={styles.specsSection}>
          <Text style={styles.sectionTitleGold}>Especificaciones</Text>
          <View style={styles.specsGrid}>
            {ATTRIBUTE_LABELS.map(({ key, label, suffix }) => (
              <View key={key} style={styles.specItem}>
                <Text style={styles.specLabel}>{label}</Text>
                <Text style={styles.specValue} numberOfLines={1}>
                  {listing[key] ? `${listing[key]}${suffix || ''}` : '-'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Seller Section */}
        <View style={styles.sellerSection}>
          <View style={styles.sellerHeader}>
            <View style={styles.sellerAvatar}>
              {sellerProfileImageUrl ? (
                <Image source={{ uri: sellerProfileImageUrl }} style={styles.sellerAvatarImage} />
              ) : (
                <Text style={styles.sellerAvatarText}>
                  {sellerName ? sellerName.charAt(0).toUpperCase() : 'V'}
                </Text>
              )}
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>
                {sellerName || 'Vendedor'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star" size={14} color="#887E1D" />
                <Text style={styles.sellerRating}>
                  {Number.isFinite(Number(sellerRating))
                    ? ` ${Number(sellerRating).toFixed(1)} (Verified)`
                    : ' Sin valoraciones'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {!isOwner && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleBuyPress}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#887E1D', '#85570F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGradient}
              >
                <Text style={styles.primaryButtonText}>Comprar Vehículo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleContactPress}
            >
              <Text style={styles.secondaryButtonText}>Contactar Vendedor</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerCta}>
            <LinearGradient
              colors={['#887E1D', '#85570F']}
              style={styles.footerGradient}
            >
              <Text style={styles.footerText}>¿Interesado?</Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
