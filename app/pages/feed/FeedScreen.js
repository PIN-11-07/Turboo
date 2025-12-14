import React, { useCallback, useState, useEffect } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { feedScreenStyles as styles } from './FeedStyles'
import { palette } from '../../theme/palette'
import { useFeed } from './useFeed'
import ListingCard from '../../components/ListingCard'

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
    ({ item }) => (
      <ListingCard
        item={item}
        style={styles.cardWrapper}
        onPress={() =>
          navigation.navigate('ListingDetail', {
            listingId: item.id,
            listing: item,
          })
        }
      />
    ),
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
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroTitles}>
              <Text style={styles.heroTitleMain}>Discover</Text>
              <Text style={styles.heroTitleSub}>all cars</Text>
            </View>

            <TouchableOpacity
              style={styles.recommendButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Recommendations')}
            >
              <Ionicons name="sparkles-outline" size={16} color={palette.champagne} />
              <Text style={styles.recommendButtonText}>For you</Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <FlatList
          data={listings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderListing}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
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
