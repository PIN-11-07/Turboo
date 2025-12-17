import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
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
import { useProfile } from './useProfile'
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
    return `€ ${numericValue.toLocaleString('en-US')}`
  }

  if (typeof value === 'string' && value.trim()) {
    return value
  }

  return 'Price on request'
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
  } = useProfile()

  const [profile, setProfile] = useState(fetchedProfile)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(fetchedProfile?.name || 'User')
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
        setName(fetchedProfile.name || user?.email || 'User')
        setEmail(fetchedProfile.mail || user?.email || '')
        setNewAvatarUri(fetchedProfile.profileImageUrl ?? null)
      }
    } else if (!editing) {
      setName(user?.email || 'User')
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
    // Navigate to listing detail when available
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
          'Permission denied',
          'We need access to your gallery. Please check permissions in your device settings.'
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
      Alert.alert('Error', 'Unable to open the gallery.')
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need access to your camera.')
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
    Alert.alert('Change Profile Photo', 'How would you like to select a photo?', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'From Gallery', onPress: pickImageFromGallery },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  const handleSaveProfile = useCallback(async () => {
    if (!user?.id) {
      setLocalError('User not authenticated.')
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
        throw new Error('Profile update failed.')
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
      Alert.alert('Success', 'Profile updated successfully.')
    } catch (updateError) {
      console.error('Error updating profile/uploading image:', updateError)
      setLocalError(updateError?.message || 'Error during the update.')
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
    setName(profile?.name || fetchedProfile?.name || user?.email || 'User')
    setEmail(profile?.mail || fetchedProfile?.mail || user?.email || '')
    setNewAvatarUri(
      profile?.profileImageUrl ?? fetchedProfile?.profileImageUrl ?? null
    )
  }, [profile, fetchedProfile, user?.email])

  const handleReactivate = useCallback(
    async (listingId) => {
      const success = await reactivateListing(listingId)
      if (!success) {
        Alert.alert('Activation failed', 'Please try again later.')
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
        ? new Date(listing.created_at).toLocaleDateString('en-US')
        : 'date unavailable'
      const isInactive = listing.is_active === false
      const isReactivating = reactivatingId === listing.id
      const isOwnListing = listing.user_id === user?.id
      const dateLabel = isInactive
        ? `Saved on ${publishDate}`
        : `Published on ${publishDate}`

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
                <Text style={styles.listingImagePlaceholderText}>No photo</Text>
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
                  <Text style={styles.inactiveBadgeText}>Inactive</Text>
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
                    <Text style={styles.activateButtonText}>Activate</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : isInactive && !isOwnListing ? (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveBadgeText}>Unavailable</Text>
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
          <Text style={styles.loadingText}>Loading data...</Text>
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
          <Text style={styles.infoText}>Sign in to view the profile.</Text>
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
                    Change
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.verificationBadge}>
                <LinearGradient
                  colors={[palette.mustard, palette.darkGrey]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.verificationBadgeGradient}
                >
                  <Text style={styles.verificationBadgeText}>3</Text>
                </LinearGradient>
              </View>
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
              <Pressable
                style={({ pressed }) => [
                  styles.reviewButton,
                  { backgroundColor: pressed ? palette.champagne : palette.darkMustard },
                ]}
                onPress={() => {
                  // TODO: Navigate to reviews screen
                  console.log('Navigate to reviews')
                }}
              >
                {({ pressed }) => (
                  <Text style={[styles.reviewButtonText, { color: pressed ? palette.darkMustard : palette.champagne }]}>
                    See customer reviews{' '}
                    <Text style={{ fontFamily: 'OTJubileeGolden', fontSize: 18 }}>
                      ({profile.ratingCount})
                    </Text>
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
          <View style={styles.verificationDetails}>
            <Text style={styles.verificationDetailsText}>
              User verification levels:{'\n'}
              1. Basic: Email + phone number confirmed{'\n'}
              2. Full: 1 + ID + selfie verified{'\n'}
              3. Advanced: 2 + payment info + purchase history
            </Text>
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
              placeholder="Full name"
              placeholderTextColor={palette.textMuted}
            />

            <Text style={styles.personalDataLabel}>Contact</Text>
            <TextInput
              style={[styles.personalDataInput, { backgroundColor: palette.disabled, color: palette.textMuted }]}
              value={email}
              editable={false}
              placeholder="Email (not editable)"
              placeholderTextColor={palette.textMuted}
            />

            {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && { borderColor: palette.champagne },
                saving && { opacity: 0.7 },
              ]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {({ pressed }) => (
                <>
                  {saving ? (
                    <ActivityIndicator color={palette.mustard} />
                  ) : (
                    <Text style={[styles.saveButtonText, pressed && { color: palette.champagne, fontWeight: '700' }]}>
                      Save Changes
                    </Text>
                  )}
                </>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.personalDataLabel}>Full name</Text>
            <Text style={styles.personalDataValue}>{profile?.name || user?.email || 'User'}</Text>

            <Text style={styles.personalDataLabel}>Member since</Text>
            <Text style={styles.personalDataValue}>{joinDate || 'N/A'}</Text>

            <Text style={styles.personalDataLabel}>Contact</Text>
            <Text style={styles.personalDataValue}>{email || 'Not available'}</Text>

            {profile?.balance !== undefined && (
              <>
                <Text style={styles.personalDataLabel}>Available balance</Text>
                <Text style={styles.personalDataValue}>{formatPrice(profile.balance)}</Text>
              </>
            )}
          </>
        )}
      </View>

      {/* Smart Car Alerts */}
      <View style={styles.personalDataSection}>
        <Pressable
          style={({ pressed }) => [
            styles.smartAlertsCard,
            { backgroundColor: pressed ? palette.champagne : palette.mustard },
          ]}
          onPress={() => {
            // TODO: Navigate to smart alerts settings
            console.log('Navigate to smart alerts')
          }}
        >
          {({ pressed }) => (
            <Text style={[styles.smartAlertsTitle, { color: pressed ? palette.darkMustard : palette.champagne }]}>
              Smart car alerts
            </Text>
          )}
        </Pressable>
        <Text style={styles.smartAlertsDescription}>
          Keep this enabled to receive alerts for cars that match your interests and to help us improve your "Selected for You" recommendations.
        </Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  )

  const renderPublishedCarsTab = () => (
    <ScrollView style={styles.contentWrapper} contentContainerStyle={styles.scrollContent}>
      {/* Active Listings */}
      <View style={styles.publishedSection}>
        <Text style={styles.publishedSectionTitle}>Published cars</Text>
        
        {activeListings.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No active listings.</Text>
          </View>
        ) : (
          <View style={styles.publishedGrid}>
            {activeListings.map((listing) => {
              if (!listing?.id) return null

              const hasImage = Array.isArray(listing.images) && listing.images.length > 0
              const firstImage = hasImage ? listing.images[0] : null

              return (
                <TouchableOpacity
                  key={`published-active-${listing.id}`}
                  style={styles.publishedCard}
                  onPress={() => handleListingPress(listing)}
                  activeOpacity={0.8}
                >
                  <View style={styles.publishedImageWrapper}>
                    {firstImage ? (
                      <Image
                        source={{ uri: firstImage }}
                        style={styles.publishedImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.publishedImagePlaceholder}>
                        <Text style={styles.publishedImagePlaceholderText}>No photo</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.publishedInfo}>
                    <Text style={styles.publishedTitle} numberOfLines={2}>
                      {listing.title}
                    </Text>
                    <View style={styles.publishedPriceRow}>
                      <Text style={styles.publishedPrice}>
                        {formatPrice(listing.price)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </View>

      {/* Drafts / Inactive Listings */}
      <View style={styles.publishedSection}>
        <Text style={styles.publishedSectionTitleInactive}>Drafts</Text>
        
        {inactiveListings.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No drafts yet.</Text>
          </View>
        ) : (
          <View style={styles.publishedGrid}>
            {inactiveListings.map((listing) => {
              if (!listing?.id) return null

              const hasImage = Array.isArray(listing.images) && listing.images.length > 0
              const firstImage = hasImage ? listing.images[0] : null

              return (
                <TouchableOpacity
                  key={`published-inactive-${listing.id}`}
                  style={styles.publishedCardInactive}
                  onPress={() => handleListingPress(listing)}
                  activeOpacity={0.8}
                >
                  <View style={styles.publishedImageWrapper}>
                    {firstImage ? (
                      <Image
                        source={{ uri: firstImage }}
                        style={styles.publishedImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.publishedImagePlaceholder}>
                        <Text style={styles.publishedImagePlaceholderText}>No photo</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.publishedInfoInactive}>
                    <Text style={styles.publishedTitleInactive} numberOfLines={2}>
                      {listing.title}
                    </Text>
                    <View style={styles.publishedPriceRowInactive}>
                      <Text style={styles.publishedPriceInactive}>
                        {formatPrice(listing.price)}
                      </Text>
                      <TouchableOpacity
                        style={styles.reactivateButton}
                        disabled={reactivatingId === listing.id}
                        onPress={(e) => {
                          e.stopPropagation()
                          handleReactivate(listing.id)
                        }}
                      >
                        {reactivatingId === listing.id ? (
                          <ActivityIndicator size="small" color="#000" />
                        ) : (
                          <Text style={styles.reactivateButtonText}>Publish</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  )

  const renderFavoriteCarsTab = () => (
    <ScrollView style={styles.contentWrapper} contentContainerStyle={styles.scrollContent}>
      <View style={styles.favoriteSection}>
        <Text style={styles.favoriteSectionTitle}>Favorite cars</Text>
        {favoriteListings.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>You have not added favorites yet.</Text>
          </View>
        ) : (
          <View style={styles.favoriteGrid}>
            {favoriteListings.map((listing) => {
              if (!listing?.id) return null

              const hasImage = Array.isArray(listing.images) && listing.images.length > 0
              const firstImage = hasImage ? listing.images[0] : null

              return (
                <TouchableOpacity
                  key={`favorite-${listing.id}`}
                  style={styles.favoriteCard}
                  onPress={() => handleListingPress(listing)}
                  activeOpacity={0.8}
                >
                  <View style={styles.favoriteImageWrapper}>
                    {firstImage ? (
                      <Image
                        source={{ uri: firstImage }}
                        style={styles.favoriteImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.favoriteImagePlaceholder}>
                        <Text style={styles.favoriteImagePlaceholderText}>No photo</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteTitle} numberOfLines={2}>
                      {listing.title}
                    </Text>
                    <View style={styles.favoritePriceRow}>
                      <FavoriteButton
                        listingId={listing.id}
                        variant="list"
                        initialIsFavorite
                        fetchOnMount={false}
                        onStatusChange={(nextValue) => {
                          if (!nextValue) {
                            handleFavoriteRemoval(listing.id)
                          }
                        }}
                        style={styles.favoriteHeartButton}
                      />
                      <Text style={styles.favoritePrice}>
                        {formatPrice(listing.price)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Sign out</Text>
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
