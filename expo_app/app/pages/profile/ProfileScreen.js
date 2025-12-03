import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import FavoriteButton from '../../components/FavoriteButton'
import TransactionItem from '../../components/TransactionItem'
import { profileScreenStyles } from './profileStyles'
import { palette } from '../../theme/palette'
import { useProfileScreen } from './useProfileScreen'
import { uploadToCloudinary } from '../../config/cloudinary'
import { updateProfile } from '../../services/users'

const DEFAULT_AVATAR_URI =
  'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'

const editableAvatarStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: palette.darkGrey,
  borderRadius: 75,
  justifyContent: 'center',
  alignItems: 'center',
}

const STAR_COLOR = '#C58A1A'
const STAR_SIZE = 25

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
    profile: fetchedProfile,
    activeListings,
    inactiveListings,
    favoriteListings,
    transactionHistory,
    avatarInitial,
    handleListingPress,
    handleFavoriteRemoval,
    reactivateListing,
    reactivatingId,
    refreshProfile,
  } = useProfileScreen()

  const [profile, setProfile] = useState(fetchedProfile)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(fetchedProfile?.name || 'Usuario')
  const [email, setEmail] = useState(fetchedProfile?.mail || '')
  const [newAvatarUri, setNewAvatarUri] = useState(
    fetchedProfile?.profileImageUrl ?? null
  )
  const [saving, setSaving] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [activeTab, setActiveTab] = useState('personal')

  // Mock recently viewed data - replace with actual data from context/storage
  const recentlyViewed = useMemo(() => {
    return activeListings.slice(0, 6)
  }, [activeListings])

  useEffect(() => {
    if (fetchedProfile) {
      setProfile(fetchedProfile)
      if (!editing) {
        setName(fetchedProfile.name || user?.email || 'Usuario')
        setEmail(fetchedProfile.mail || user?.email || '')
        setNewAvatarUri(fetchedProfile.profileImageUrl ?? null)
      }
    } else if (!editing) {
      setName(user?.email || 'Usuario')
      setEmail(user?.email || '')
    }
  }, [fetchedProfile, user?.email, editing])

  const joinDate = useMemo(() => {
    if (user?.created_at) {
      try {
        return new Date(user.created_at).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      } catch (dateError) {
        console.warn('join date parse failed', dateError)
      }
    }
    return null
  }, [user?.created_at])

  const publishedCount = useMemo(
    () => activeListings.length + inactiveListings.length,
    [activeListings.length, inactiveListings.length]
  )

  const handleTransactionPress = useCallback((transaction) => {
    // Naviguer vers le détail du listing si disponible
    if (transaction.listing_id) {
      handleListingPress(transaction.listing_id)
    }
  }, [handleListingPress])

  const hasAvatar = Boolean(newAvatarUri || profile?.profileImageUrl)
  const displayAvatarUri =
    newAvatarUri || profile?.profileImageUrl || DEFAULT_AVATAR_URI

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos acceso a la galería. Por favor, verifica los permisos en la configuración del dispositivo.'
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      if (result.assets?.length > 0) {
        setNewAvatarUri(result.assets[0].uri)
      }
    } catch (imageError) {
      console.error('Error ImagePicker:', imageError)
      Alert.alert('Error', 'Imposible abrir la galería.')
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (result.assets?.length > 0) {
      setNewAvatarUri(result.assets[0].uri)
    }
  }

  const promptImageSelection = () => {
    Alert.alert('Cambiar Foto de Perfil', '¿Cómo te gustaría seleccionar una foto?', [
      { text: 'Tomar Foto', onPress: takePhoto },
      { text: 'Desde Galería', onPress: pickImageFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ])
  }

  const handleSaveProfile = useCallback(async () => {
    if (!user?.id) {
      setLocalError('Usuario no autenticado.')
      return
    }

    setSaving(true)
    setLocalError(null)
    let avatarUriToSave =
      newAvatarUri || profile?.profileImageUrl || fetchedProfile?.profileImageUrl || null

    try {
      if (newAvatarUri && !newAvatarUri.startsWith('http')) {
        const uploadResult = await uploadToCloudinary(newAvatarUri)
        avatarUriToSave = uploadResult.secure_url
      }

      const updated = await updateProfile(user.id, {
        name: name?.trim() || null,
        avatar_url: avatarUriToSave,
      })

      if (!updated) {
        throw new Error('No se pudo actualizar el perfil.')
      }

      const nextProfile = {
        ...(profile || {}),
        name: updated?.name ?? name,
        mail: email,
        profileImageUrl: updated?.avatar_url ?? avatarUriToSave,
        balance:
          profile?.balance ??
          fetchedProfile?.balance ??
          (typeof updated?.balance === 'number' ? updated.balance : 0),
      }

      setProfile(nextProfile)
      setNewAvatarUri(nextProfile.profileImageUrl ?? null)
      setEditing(false)
      refreshProfile()
      Alert.alert('Éxito', 'Perfil actualizado con éxito')
    } catch (updateError) {
      console.error('Error al actualizar perfil/subir imagen:', updateError)
      setLocalError(updateError?.message || 'Error durante la actualización.')
    } finally {
      setSaving(false)
    }
  }, [
    user?.id,
    newAvatarUri,
    name,
    email,
    profile,
    fetchedProfile,
    refreshProfile,
  ])

  const handleCancelEdit = useCallback(() => {
    setEditing(false)
    setLocalError(null)
    setName(profile?.name || fetchedProfile?.name || user?.email || 'Usuario')
    setEmail(profile?.mail || fetchedProfile?.mail || user?.email || '')
    setNewAvatarUri(
      profile?.profileImageUrl ?? fetchedProfile?.profileImageUrl ?? null
    )
  }, [profile, fetchedProfile, user?.email])

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
      const isOwnListing = listing.user_id === user?.id
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
            {isInactive && isOwnListing ? (
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
            ) : isInactive && !isOwnListing ? (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveBadgeText}>No disponible</Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      )
    },
    [handleFavoriteRemoval, handleListingPress, handleReactivate, reactivatingId, user?.id]
  )

  // Loading and error states
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={palette.accent} />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centerContent}>
          <Text style={styles.infoText}>Inicia sesión para ver el perfil.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const renderPersonalDataTab = () => (
    <ScrollView style={styles.contentWrapper} contentContainerStyle={styles.scrollContent}>
      {/* User Verification Card */}
      {(profile?.rating !== undefined && profile?.rating !== null) && (
        <View style={styles.verificationCard}>
          <Text style={styles.verificationTitle}>User verification</Text>
          <View style={styles.verificationContent}>
            <View style={styles.verificationAvatar}>
              {hasAvatar ? (
                <Image source={{ uri: displayAvatarUri }} style={styles.verificationAvatarImage} />
              ) : (
                <View style={[styles.avatarPlaceholder, styles.verificationAvatarImage]}>
                  <Text style={styles.avatarInitial}>{avatarInitial}</Text>
                </View>
              )}
              {editing && (
                <TouchableOpacity
                  style={editableAvatarStyle}
                  onPress={promptImageSelection}
                >
                  <Ionicons name="camera-outline" size={30} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>
                    Cambiar
                  </Text>
                </TouchableOpacity>
              )}
              {profile?.verificationLevel && (
                <View style={styles.verificationBadge}>
                  <Text style={styles.verificationBadgeText}>{profile.verificationLevel}</Text>
                </View>
              )}
            </View>
            <View style={styles.verificationInfo}>
              <View style={styles.verificationRatingRow}>
                <Text style={styles.verificationRatingValue}>{Number(profile.rating).toFixed(1)}</Text>
                <Image
                  source={require('../../../assets/icon-estrella.png')}
                  style={styles.starIcon}
                  resizeMode="contain"
                />
              </View>
              {profile?.reviewCount > 0 && (
                <TouchableOpacity style={styles.reviewButton}>
                  <Text style={styles.reviewButtonText}>
                    See customer reviews ({profile.reviewCount})
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.verificationDetails}>
                <Text style={styles.verificationDetailsText}>
                  User Verification levels:{'\n'}
                  1. Basic: Email + phone number confirmed{'\n'}
                  2. Full: ID + selfie verified{'\n'}
                  3. Advanced: Payment + purchase history
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Personal Data Section Header */}
      <View style={styles.personalDataHeader}>
        <Text style={styles.personalDataTitle}>Personal data</Text>
        <TouchableOpacity
          style={styles.editIconButton}
          onPress={() => editing ? handleCancelEdit() : setEditing(true)}
        >
          <Image
            source={editing ? require('../../../assets/icon-close.png') : require('../../../assets/icon-lapiz-editar.png')}
            style={editing ? styles.closeIcon : styles.editIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Personal Data Section */}
      <View style={styles.personalDataSection}>
        {editing ? (
          <>
            <Text style={styles.personalDataLabel}>Full name</Text>
            <TextInput
              style={styles.personalDataInput}
              value={name}
              onChangeText={setName}
              placeholder="Nombre"
              placeholderTextColor={palette.textMuted}
            />

            <Text style={styles.personalDataLabel}>Contact</Text>
            <TextInput
              style={[styles.personalDataInput, { backgroundColor: palette.disabled, color: palette.textMuted }]}
              value={email}
              editable={false}
              placeholder="Email (no editable)"
              placeholderTextColor={palette.textMuted}
            />

            {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.7 }]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={palette.background} />
              ) : (
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.personalDataLabel}>Full name</Text>
            <Text style={styles.personalDataValue}>{profile?.name || user?.email || 'Usuario'}</Text>

            <Text style={styles.personalDataLabel}>Member since</Text>
            <Text style={styles.personalDataValue}>{joinDate || 'N/A'}</Text>

            <Text style={styles.personalDataLabel}>Contact</Text>
            <Text style={styles.personalDataValue}>{email || 'No disponible'}</Text>

            {profile?.balance !== undefined && (
              <>
                <Text style={styles.personalDataLabel}>Available balance</Text>
                <Text style={styles.personalDataValue}>{formatPrice(profile.balance)}</Text>
              </>
            )}
          </>
        )}
      </View>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <View style={styles.recentlyViewedSection}>
          <Text style={styles.recentlyViewedTitle}>Recently viewed</Text>
          <View style={styles.recentlyViewedGrid}>
            {recentlyViewed.map((listing) => (
              <TouchableOpacity
                key={`recent-${listing.id}`}
                style={styles.recentlyViewedCard}
                onPress={() => handleListingPress(listing)}
              >
                <Image
                  source={{ uri: listing.images?.[0] || DEFAULT_AVATAR_URI }}
                  style={styles.recentlyViewedImage}
                  resizeMode="cover"
                />
                <View style={styles.recentlyViewedInfo}>
                  <Text style={styles.recentlyViewedName} numberOfLines={1}>
                    {listing.title}
                  </Text>
                  <Text style={styles.recentlyViewedPrice}>{formatPrice(listing.price)}</Text>
                </View>
                <View style={styles.recentlyViewedHeart}>
                  <FavoriteButton
                    listingId={listing.id}
                    variant="list"
                    initialIsFavorite={false}
                    fetchOnMount={true}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  )

  const renderPublishedCarsTab = () => (
    <ScrollView style={styles.contentWrapper} contentContainerStyle={styles.scrollContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tus anuncios activos</Text>
        {activeListings.length === 0 ? (
          <Text style={styles.emptyState}>No tienes anuncios activos.</Text>
        ) : (
          activeListings.map((listing) =>
            renderListingCard(listing, 'own-active')
          )
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tus anuncios inactivos</Text>
        {inactiveListings.length === 0 ? (
          <Text style={styles.emptyState}>No tienes anuncios inactivos.</Text>
        ) : (
          inactiveListings.map((listing) =>
            renderListingCard(listing, 'own-inactive')
          )
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  )

  const renderFavoriteCarsTab = () => (
    <ScrollView style={styles.contentWrapper} contentContainerStyle={styles.scrollContent}>
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Gradient Header with Welcome and Tabs */}
        <LinearGradient
          colors={[palette.darkGrey, palette.darkMustard, palette.darkMustard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientHeader}
        >
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.welcomeName}>{profile?.name || user?.email?.split('@')[0] || 'User'}</Text>
          </View>

          {/* Top Tab Navigation */}
          <View style={styles.topTabBar}>
            <TouchableOpacity
              style={[
                styles.topTab,
                activeTab === 'personal' && styles.topTabActiveNoBottomBorder,
                activeTab === 'published' && styles.topTabLeftAdjacentToActive,
              ]}
              onPress={() => setActiveTab('personal')}
            >
              {activeTab === 'personal' && (
                <LinearGradient
                  colors={[palette.darkMustard, palette.darkGrey]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.topTabGradientBg}
                />
              )}
              <View style={styles.topTabContent}>
                <Text style={[styles.topTabLabel, activeTab === 'personal' && styles.topTabLabelActive]}>
                  Personal{'\n'}data
                </Text>
                <View style={[styles.topTabIcon, activeTab === 'personal' && styles.topTabIconActive]}>
                  <Image
                    source={require('../../../assets/icon-info.png')}
                    style={styles.topTabIconImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.topTab,
                styles.topTabMiddle,
                activeTab === 'published' && styles.topTabActiveNoBottomBorder,
                activeTab === 'personal' && styles.topTabRightAdjacentToActive,
                activeTab === 'favorites' && styles.topTabLeftAdjacentToActive,
              ]}
              onPress={() => setActiveTab('published')}
            >
              {activeTab === 'published' && (
                <LinearGradient
                  colors={[palette.darkMustard, palette.darkGrey]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.topTabGradientBg}
                />
              )}
              <View style={styles.topTabContent}>
                <Text style={[styles.topTabLabel, activeTab === 'published' && styles.topTabLabelActive]}>
                  Published{'\n'}cars
                </Text>
                <View style={[styles.topTabIcon, activeTab === 'published' && styles.topTabIconActive]}>
                  <Image
                    source={require('../../../assets/icon-coche.png')}
                    style={styles.topTabIconImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.topTab,
                activeTab === 'favorites' && styles.topTabActiveNoBottomBorder,
                activeTab === 'published' && styles.topTabRightAdjacentToActive,
              ]}
              onPress={() => setActiveTab('favorites')}
            >
              {activeTab === 'favorites' && (
                <LinearGradient
                  colors={[palette.darkMustard, palette.darkGrey]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.topTabGradientBg}
                />
              )}
              <View style={styles.topTabContent}>
                <Text style={[styles.topTabLabel, activeTab === 'favorites' && styles.topTabLabelActive]}>
                  Favorite{'\n'}cars
                </Text>
                <View style={[styles.topTabIcon, activeTab === 'favorites' && styles.topTabIconActive]}>
                  <Image
                    source={require('../../../assets/icon-heart-filled.png')}
                    style={styles.topTabIconImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Tab Content */}
        {activeTab === 'personal' && renderPersonalDataTab()}
        {activeTab === 'published' && renderPublishedCarsTab()}
        {activeTab === 'favorites' && renderFavoriteCarsTab()}
      </View>
    </SafeAreaView>
  )
}

const styles = profileScreenStyles
