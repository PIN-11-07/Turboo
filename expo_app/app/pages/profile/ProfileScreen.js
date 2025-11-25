import React, { useCallback } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { profileScreenStyles } from './profileStyles'
import FavoriteButton from '../../components/FavoriteButton'
import { useProfileScreen } from './useProfileScreen'

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
    activeListings,
    inactiveListings,
    favoriteListings,
    avatarInitial,
    handleListingPress,
    handleFavoriteRemoval,
    reactivateListing,
    reactivatingId,
  } = useProfileScreen()

  const handleReactivate = useCallback(
    async (listingId) => {
      const success = await reactivateListing(listingId)
      if (!success) {
        Alert.alert('No se pudo activar', 'Inténtalo de nuevo más tarde.')
      }
    },
    [reactivateListing]
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
      const isInactive = listing.is_active === false
      const isReactivating = reactivatingId === listing.id
      const dateLabel = isInactive
        ? `Guardado el ${publishDate}`
        : `Publicado el ${publishDate}`

      const handleFavoriteChange = (nextValue) => {
        if (!nextValue) {
          handleFavoriteRemoval(listing.id)
        }
      }

      const handleReactivatePress = async () => {
        await handleReactivate(listing.id)
      }

      return (
        <TouchableOpacity
          key={`${keyPrefix}-${listing.id}`}
          style={[styles.listingCard, isInactive && styles.listingCardInactive]}
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
              <Text
                style={[
                  styles.listingTitle,
                  isInactive && styles.listingTitleInactive,
                ]}
                numberOfLines={2}
              >
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
            <Text
              style={[
                styles.listingPrice,
                isInactive && styles.listingPriceInactive,
              ]}
            >
              {formatPrice(listing.price)}
            </Text>
            <Text
              style={[styles.listingDate, isInactive && styles.listingDateInactive]}
            >
              {dateLabel}
            </Text>
            {isInactive ? (
              <View style={styles.inactiveRow}>
                <View style={styles.inactiveBadge}>
                  <Text style={styles.inactiveBadgeText}>Inactivo</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.activateButton,
                    isReactivating && styles.activateButtonDisabled,
                  ]}
                  onPress={handleReactivatePress}
                  disabled={isReactivating}
                >
                  {isReactivating ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.activateButtonText}>Activar</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      )
    },
    [handleFavoriteRemoval, handleListingPress, handleReactivate, reactivatingId]
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

          <Text style={styles.cardLabel}>Saldo disponible</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceValue}>
              {formatPrice(profile?.balance ?? 0)}
            </Text>
            <Text style={styles.balanceHint}>
              Usa este saldo para pagar vehículos en Turboo.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus anuncios activos</Text>
          {activeListings.length === 0 ? (
            <Text style={styles.emptyState}>No tienes anuncios activos.</Text>
          ) : (
            activeListings.map((listing) => renderListingCard(listing, 'own-active'))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus anuncios inactivos</Text>
          {inactiveListings.length === 0 ? (
            <Text style={styles.emptyState}>No tienes anuncios inactivos.</Text>
          ) : (
            inactiveListings.map((listing) => renderListingCard(listing, 'own-inactive'))
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
