import React, { useCallback } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { profileScreenStyles } from '../profileStyles'
import FavoriteButton from '../../../components/FavoriteButton'
import { useProfileScreen } from '../hooks/useProfileScreen'

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

export default function ProfileScreen() {
  const {
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
  } = useProfileScreen()

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
          handleFavoriteRemoval(listing.id)
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
                resizeMode="cover"
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
                  variant="list"
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
    [handleFavoriteRemoval, handleListingPress]
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
