import React, { useCallback, useState, useEffect } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { homeScreenStyles } from './HomeStyles'
import { palette } from '../../theme/palette'
import FavoriteButton from '../../components/FavoriteButton'
import SearchSuggestions from '../../components/SearchSuggestions'
import SearchFilters from '../../components/SearchFilters'
import { useHomeScreen } from './useHomeScreen'
import { formatPrice } from '../../utils/format'
import * as ImagePicker from 'expo-image-picker'
import ImageAnalysisButton from '../../components/ImageAnalisisButton'
import AnimatedAISearchButton from '../../components/AnimatedAISearchButton'
import { LinearGradient } from 'expo-linear-gradient'


// formatPrice is now imported from utils

const getMainImage = (images) => (Array.isArray(images) && images.length > 0 ? images[0] : null)

export default function HomeScreen() {
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
    filteredListings,
    initialLoading,
    refreshing,
    loadingMore,
    error,
    handleRefresh,
    handleLoadMore,
    removeListingById,
    search,
  } = useHomeScreen()
  // Compact link to Recommendations screen (keeps home compact)

  useFocusEffect(
    useCallback(() => {
      handleRefresh()
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
                <Text style={styles.cardImagePlaceholderText}>Sin foto</Text>
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
              <Text style={styles.cardBadge}>{item.mileage ? `${item.mileage} km` : 'km s/d'}</Text>
              {item.fuel_type ? <Text style={styles.cardBadge}>{item.fuel_type}</Text> : null}
              {item.transmission ? <Text style={styles.cardBadge}>{item.transmission}</Text> : null}
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardLocation}>{item.location}</Text>
              <Text style={styles.cardMeta}>{item.doors ? `${item.doors} puertas` : item.color || 'Detalles s/d'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    },
    [navigation]
  )

  const [image, setImage] = useState(null)
  const [aiMessageVisible, setAiMessageVisible] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      // Minimal feedback; avoid blocking UX
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri
      setImage(uri)
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== 'granted') {
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri
      setImage(uri)
    }
  }

  const handleAnalysisCompleteForSearch = (data) => {
    if (!data) return

    // Only apply a small set of simple filters: make, color and price
    const newFilters = { ...search.filters }

    // Apply brand and color if detected
    if (data.make) {
      newFilters.make = [data.make]
      // Use make as search text to help narrow results
      search.setSearchText(`${data.make}`)
      search.setShowSuggestions(false)
    }

    if (data.color) {
      newFilters.color = [data.color]
    }

    // If AI provides a price estimate, set a +-20% range around it
    if (data.price) {
      const parsedPrice = Number(String(data.price).replace(/[^0-9.]/g, ''))
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        const min = Math.max(search.priceRange.min, Math.round(parsedPrice * 0.8))
        const max = Math.min(search.priceRange.max, Math.round(parsedPrice * 1.2))
        newFilters.priceMin = min
        newFilters.priceMax = max
      }
    }

    // Apply filters silently (do not open the filters panel)
    search.setFilters(newFilters)
    search.setShowFilters(false)

    // Simple banner summarizing applied filters
    const parts = []
    if (newFilters.make && newFilters.make.length) parts.push(`Brand: ${newFilters.make.join(', ')}`)
    if (newFilters.color && newFilters.color.length) parts.push(`Color: ${newFilters.color.join(', ')}`)
    if (newFilters.priceMin !== undefined && newFilters.priceMax !== undefined) parts.push(`Price: ${formatPrice(newFilters.priceMin)} - ${formatPrice(newFilters.priceMax)}`)

    const banner = parts.length > 0
      ? `AI-proposed filters applied:\n${parts.join('\n')}`
      : 'AI analyzed the image but did not find confident filter suggestions.'

    setAiMessage(banner)
    setAiMessageVisible(true)
    setTimeout(() => setAiMessageVisible(false), 6000)

    // Clear picked image after applying
    setTimeout(() => setImage(null), 500)
  }

  const renderGridItem = useCallback(
    ({ item }) => {
      const mainImage = getMainImage(item.images)
      return (
        <TouchableOpacity
          style={styles.gridItem}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('ListingDetail', {
              listingId: item.id,
              listing: item,
            })
          }
        >
          <View style={styles.gridImageContainer}>
            {mainImage ? (
              <Image source={{ uri: mainImage }} style={styles.gridImage} />
            ) : (
              <View style={[styles.gridImage, styles.cardImagePlaceholder]}>
                <Text style={styles.cardImagePlaceholderText}>Sin foto</Text>
              </View>
            )}
            <FavoriteButton listingId={item.id} variant="overlay" />
          </View>
          <View style={styles.gridContent}>
            <Text style={styles.gridTitle}>{item.make} {item.model}</Text>
            <Text style={styles.gridPrice}>{formatPrice(item.price)}</Text>
            <Text style={styles.gridYear}>{item.year || 'Año s/d'}</Text>
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
          <View style={{ height: 30 }} />
          <LinearGradient
            colors={['#bf8a2e', '#000000ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroContainer}
          />

          {/* Enhanced FSearch Interface */}
          <View style={styles.searchBarContainer}>
            <View style={styles.searchInputWrapper}>
              <TouchableOpacity
                style={styles.searchIconLeft}
                onPress={() => {
                  search.updateSuggestions(search.searchText)
                }}
              >
                <Ionicons name="search" size={18} color={palette.accent} />
              </TouchableOpacity>

              <TextInput
                value={search.searchText}
                onChangeText={(text) => {
                  search.setSearchText(text)
                  search.updateSuggestions(text)
                }}
                onFocus={() => {
                  search.setIsFocused(true)
                }}
                onBlur={() => {
                  setTimeout(() => {
                    search.setShowSuggestions(false)
                    search.setIsFocused(false)
                  }, 200)
                }}
                placeholder="Busca marca, modelo o ciudad"
                placeholderTextColor={palette.textMuted}
                style={[
                  styles.enhancedSearchInput,
                  search.isFocused && styles.searchInputFocused
                ]}
                returnKeyType="search"
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                }}
              />

              {search.searchText && !search.isFocused && (
                <TouchableOpacity
                  onPress={() => {
                    search.clearSearch()
                  }}
                  style={styles.clearSearchButton}
                >
                  <Ionicons name="close" size={16} color={palette.text} />
                </TouchableOpacity>
              )}
            </View>

            {/* Control buttons - hidden when search is focused */}
            {!search.isFocused && (
              <>
                {/* Sort Button */}
                <TouchableOpacity
                  onPress={search.cycleSort}
                  style={styles.controlButton}
                >
                  <Ionicons name="swap-vertical" size={16} color={palette.accent} />
                  <Text style={styles.controlButtonText}>
                    {search.sortBy === 'date' ? 'Fecha' : 'Precio'} {search.sortDir === 'desc' ? '↓' : '↑'}
                  </Text>
                </TouchableOpacity>

                {/* Filters Button */}
                <TouchableOpacity
                  onPress={() => search.setShowFilters(!search.showFilters)}
                  style={[styles.controlButton, search.showFilters && styles.controlButtonActive]}
                >
                  <Ionicons
                    name="options"
                    size={16}
                    color={search.showFilters ? palette.background : palette.accent}
                  />
                  <Text style={[styles.controlButtonText, search.showFilters && styles.controlButtonTextActive]}>
                    Filtros
                  </Text>
                </TouchableOpacity>

                {/* View Mode Button */}
                <TouchableOpacity
                  onPress={() => search.setViewMode(search.viewMode === 'list' ? 'grid' : 'list')}
                  style={styles.controlButton}
                >
                  <Ionicons
                    name={search.viewMode === 'list' ? 'grid' : 'list'}
                    size={16}
                    color={palette.accent}
                  />
                </TouchableOpacity>
              </>
            )}

            {/* Cancel button when in search mode */}
            {search.isFocused && (
              <TouchableOpacity
                onPress={() => {
                  search.clearSearch()
                  Keyboard.dismiss()
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}

          </View>

          {/* Search Suggestions */}
          <SearchSuggestions
            suggestions={search.suggestions}
            onSuggestionPress={search.handleSuggestionPress}
            visible={search.showSuggestions && search.isFocused}
          />

          <TouchableOpacity
            style={styles.recommendButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Recommendations')}
          >
            <Text style={styles.recommendButtonText}>Para ti</Text>
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* AI Search: pick/take image and analyze to generate filters */}
          <View style={styles.aiSearchContainer}>
            {image ? (
              <View style={styles.aiPreviewRow}>
                <Image source={{ uri: image }} style={styles.aiPreviewImage} />
                <TouchableOpacity style={styles.removeImageButtonSmall} onPress={() => setImage(null)}>
                  <Text style={styles.removeImageX}>X</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.aiButtonsRow}>
                <AnimatedAISearchButton
                  onPress={takePhoto}
                  icon="camera-outline"
                  label="Scan Car"
                />
                <AnimatedAISearchButton
                  onPress={pickImageFromGallery}
                  icon="images-outline"
                  label="Upload"
                />
              </View>
            )}

            {/* Show analyze button when an image is selected */}
            {image && (
              <ImageAnalysisButton
                imageUri={image}
                onAnalysisComplete={handleAnalysisCompleteForSearch}
                style={{ width: '100%' }}
              />
            )}
          </View>

          {/* AI Banner: professional English message shown after analysis */}
          {aiMessageVisible && (
            <View style={{ backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, marginHorizontal: 20, marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#111', fontWeight: '700', marginBottom: 6 }}>AI-driven Recommendations</Text>
                  <Text style={{ color: '#222', lineHeight: 20 }}>{aiMessage}</Text>
                </View>
                <TouchableOpacity onPress={() => setAiMessageVisible(false)} style={{ marginLeft: 12 }}>
                  <Text style={{ color: '#666', fontWeight: '600' }}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Search Filters */}
        <SearchFilters
          visible={search.showFilters}
          filters={search.filters}
          setFilters={search.setFilters}
          priceRange={search.priceRange}
          yearRange={search.yearRange}
          makeOptions={search.makeOptions}
          colorOptions={search.colorOptions}
          fuelTypeOptions={search.fuelTypeOptions}
          transmissionOptions={search.transmissionOptions}
          bodyTypeOptions={search.bodyTypeOptions}
          conditionOptions={search.conditionOptions}
          doorsOptions={search.doorsOptions}
          onApply={() => {
            search.setShowFilters(false)
            Keyboard.dismiss()
          }}
          onClear={search.clearFilters}
        />
        {/* Content: List or Grid view - hidden when filters are shown */}
        {!search.showFilters && (
          <FlatList
            data={filteredListings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={search.viewMode === 'grid' ? renderGridItem : renderListing}
            numColumns={search.viewMode === 'grid' ? 2 : 1}
            key={search.viewMode === 'grid' ? 'grid' : 'list'} // Force re-render when switching modes
            contentContainerStyle={
              filteredListings.length === 0 ? styles.emptyList :
                search.viewMode === 'grid' ? styles.gridContainer :
                  styles.listContent
            }
            ListEmptyComponent={
              !initialLoading && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    {search.searchText
                      ? 'Ningún anuncio coincide con tu búsqueda.'
                      : 'No hay anuncios disponibles en este momento.'}
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
        )}

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

const styles = homeScreenStyles
