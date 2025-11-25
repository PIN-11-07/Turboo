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
import * as ImagePicker from 'expo-image-picker'
import { Feather, Ionicons } from '@expo/vector-icons'
import FavoriteButton from '../../components/FavoriteButton'
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
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  borderRadius: 75,
  justifyContent: 'center',
  alignItems: 'center',
}

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
  const [activeTab, setActiveTab] = useState('published')

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
        return new Date(user.created_at).toLocaleDateString('es-ES', {
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

  const renderPublishedSections = () => (
    <>
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
    </>
  )

  const renderFavoritesSection = () => (
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
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              {hasAvatar ? (
                <Image source={{ uri: displayAvatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
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
            </View>

            {editing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nombre"
                  placeholderTextColor={palette.textMuted}
                />
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: palette.disabled, color: palette.textMuted },
                  ]}
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
                    <ActivityIndicator color="#1a1a1a" />
                  ) : (
                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.name}>{profile?.name || 'Usuario'}</Text>

                <View
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = Number(profile?.rating ?? 0)
                    const fill = Math.min(Math.max(rating - (star - 1), 0), 1)

                    return (
                      <View key={star} style={{ marginRight: 2 }}>
                        <Ionicons name="star-outline" size={25} color="#ccc" />
                        <View
                          style={{
                            position: 'absolute',
                            width: 30 * fill,
                            overflow: 'hidden',
                          }}
                        >
                          <Ionicons name="star" size={25} color={palette.accent} />
                        </View>
                      </View>
                    )
                  })}
                  <Text
                    style={{
                      marginLeft: 6,
                      fontSize: 25,
                      fontWeight: 'bold',
                      color: palette.accent,
                    }}
                  >
                    {Number(profile?.rating ?? 0).toFixed(1)}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Feather name="mail" size={15} color={palette.accent} />
                  <Text style={styles.email}>{email || 'No disponible'}</Text>
                </View>
                <View style={styles.row}>
                  <Feather name="user" size={15} color={palette.accent} />
                  <Text style={styles.joiningDate}>
                    {joinDate ? `Miembro desde ${joinDate}` : 'Miembro'}
                  </Text>
                </View>

                {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setEditing(true)}
                >
                  <Feather name="edit" size={20} color="white" />
                  <Text style={styles.buttonText}> Editar perfil</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.separator} />

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Nombre</Text>
              <Text style={styles.cardValue}>{profile?.name || 'No disponible'}</Text>

              <Text style={styles.cardLabel}>Correo electrónico</Text>
              <Text style={styles.cardValue}>{email || 'No disponible'}</Text>

              <Text style={styles.cardLabel}>Saldo disponible</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceValue}>
                  {formatPrice(profile?.balance ?? fetchedProfile?.balance ?? 0)}
                </Text>
                <Text style={styles.balanceHint}>
                  Usa este saldo para pagar vehículos en Turboo.
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statColumn}>
                <View style={styles.iconRow}>
                  <Feather name="truck" size={20} color={palette.accent} />
                  <Text style={styles.statNumber}>{publishedCount}</Text>
                </View>
                <Text style={styles.statLabel}>Publicaciones</Text>
              </View>

              <View style={styles.statColumn}>
                <View style={styles.iconRow}>
                  <Feather name="heart" size={20} color={palette.accent} />
                  <Text style={styles.statNumber}>{favoriteListings.length}</Text>
                </View>
                <Text style={styles.statLabel}>Favoritos</Text>
              </View>
            </View>

            <View style={styles.sectionDivider} />
          </View>

          <View style={styles.activitySection}>
            <Text style={styles.activityTitle}>Mi Actividad</Text>
            <Text style={styles.activitySubtitle}>
              Revisa tus publicaciones y coches favoritos
            </Text>
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity
              onPress={() => setActiveTab('published')}
              style={[styles.tab, activeTab === 'published' && styles.activeTab]}
            >
              <View style={styles.tabContent}>
                <Feather
                  name="truck"
                  size={18}
                  color={activeTab === 'published' ? 'black' : palette.accent}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'published' && styles.tabTabTextActive,
                  ]}
                >
                  {' '}
                  Mis Coches
                </Text>
                <Text
                  style={[
                    styles.tabNumber,
                    activeTab === 'published' && styles.tabNumberActive,
                  ]}
                >
                  {' '}
                  {publishedCount}{' '}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('favorites')}
              style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            >
              <View style={styles.tabContent}>
                <Feather
                  name="heart"
                  size={18}
                  color={activeTab === 'favorites' ? 'black' : palette.accent}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'favorites' && styles.tabTabTextActive,
                  ]}
                >
                  {' '}
                  Favoritos
                </Text>
                <Text
                  style={[
                    styles.tabNumber,
                    activeTab === 'favorites' && styles.tabNumberActive,
                  ]}
                >
                  {' '}
                  {favoriteListings.length}{' '}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.listWrapper}>
            {activeTab === 'published'
              ? renderPublishedSections()
              : renderFavoritesSection()}

            <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
              <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = profileScreenStyles
