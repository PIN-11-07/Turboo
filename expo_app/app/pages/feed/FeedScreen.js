import React, { useCallback, useState, useEffect } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { feedScreenStyles as styles } from './FeedStyles'
import { palette } from '../../theme/palette'
import FavoriteButton from '../../components/FavoriteButton'
import { useFeed } from './useFeed'
import { formatPrice } from '../../utils/format'
import { LinearGradient } from 'expo-linear-gradient'

const getMainImage = (images) => (Array.isArray(images) && images.length > 0 ? images[0] : null)

export default function FeedScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { user } = useAuth()
  const [authModalVisible, setAuthModalVisible] = useState(false)

  useEffect(() => {
    let timer
    if (!user) {
      timer = setTimeout(() => {
        setAuthModalVisible(true)
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [user])

  const {
    listings,
    initialLoading,
    refreshing,
    loadingMore,
    error,
    handleRefresh,
    handleLoadMore,
    removeListingById,
  } = useFeed()

  useFocusEffect(
    useCallback(() => {
      // Optional: Refresh on focus if needed, or just rely on initial load
      // handleRefresh() 
    }, [])
  )

  const renderListing = useCallback(
    ({ item }) => {
      const mainImage = getMainImage(item.images)
      return (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('ListingDetail', {
              listingId: item.id,
              listing: item,
            })
          }
        >
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
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.make}</Text>
              <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
            </View>
            <Text style={styles.cardSubtitle}>
              {item.make} {item.model} • {item.year}
            </Text>
            <View style={styles.cardBadgeRow}>
              <Text style={styles.cardBadge}>{item.mileage ? `${item.mileage} km` : 'km N/A'}</Text>
              {item.fuel_type ? <Text style={styles.cardBadge}>{item.fuel_type}</Text> : null}
              {item.transmission ? <Text style={styles.cardBadge}>{item.transmission}</Text> : null}
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardLocation}>{item.location}</Text>
              <Text style={styles.cardMeta}>{item.doors ? `${item.doors} doors` : item.color || 'Details N/A'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    },
    [navigation]
  )

  const listFooter = useCallback(() => {
    if (!loadingMore) {
      return null
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={palette.accent} />
      </View>
    )
  }, [loadingMore])

  useFocusEffect(
    useCallback(() => {
      const purchasedId = route.params?.purchasedListingId
      const shouldRefresh = route.params?.refreshAfterPurchase

      if (purchasedId) {
        removeListingById(purchasedId)
      }
      if (shouldRefresh) {
        handleRefresh()
      }

      if (purchasedId || shouldRefresh) {
        navigation.setParams({
          purchasedListingId: undefined,
          refreshAfterPurchase: undefined,
        })
      }
    }, [handleRefresh, navigation, removeListingById, route.params])
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.heroTitleMain}>Discover</Text>
          <Text style={styles.heroTitleSub}>all cars</Text>
          <View style={{ height: 20 }} />
          <LinearGradient
            colors={['#c68515ff', '#000000ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroContainer}
          />

          {/* Recommendations Button */}
          <TouchableOpacity
            style={styles.recommendButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Recommendations')}
          >
            <Ionicons name="sparkles-outline" size={16} color={palette.accent} />
            <Text style={styles.recommendButtonText}>For you</Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <FlatList
          data={listings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderListing}
          contentContainerStyle={
            listings.length === 0 ? styles.emptyList : styles.listContent
          }
          ListEmptyComponent={
            !initialLoading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No listings available at the moment.
                </Text>
              </View>
            )
          }
          ListFooterComponent={listFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={palette.accent}
              colors={[palette.accent]}
              progressBackgroundColor={palette.surface}
            />
          }
        />

        {initialLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={palette.accent} />
          </View>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={authModalVisible}
        onRequestClose={() => setAuthModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join the Community</Text>
            <Text style={styles.modalText}>
              You are not connected. Please log in or create an account to unlock exclusive deals and features.
            </Text>
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => {
                setAuthModalVisible(false)
                navigation.navigate('Auth')
              }}
            >
              <Text style={styles.modalButtonText}>Log In / Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => setAuthModalVisible(false)}
            >
              <Text style={styles.modalButtonTextSecondary}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  )
}
