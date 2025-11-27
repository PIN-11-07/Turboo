import React, { useCallback, useState } from 'react'
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
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { homeScreenStyles } from './HomeStyles'
import { palette } from '../../theme/palette'
import FavoriteButton from '../../components/FavoriteButton'
import SearchSuggestions from '../../components/SearchSuggestions'
import SearchFilters from '../../components/SearchFilters'
import { useHomeScreen } from './useHomeScreen'
import { formatPrice } from '../../utils/format'
import { useFocusEffect } from '@react-navigation/native'


// formatPrice is now imported from utils

const getMainImage = (images) =>
  Array.isArray(images) && images.length > 0 ? images[0] : null

export default function HomeScreen() {
  const navigation = useNavigation()
  const {
    filteredListings,
    initialLoading,
    refreshing,
    loadingMore,
    error,
    handleRefresh,
    handleLoadMore,
    search,
  } = useHomeScreen()

    useFocusEffect(
    useCallback(() => {
      handleRefresh()   // <- el feed se actualiza automático al volver
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
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
            </View>
            <Text style={styles.cardSubtitle}>
              {item.make} {item.model} • {item.year}
            </Text>
            <View style={styles.cardBadgeRow}>
              <Text style={styles.cardBadge}>
                {item.mileage ? `${item.mileage} km` : 'km s/d'}
              </Text>
              {item.fuel_type ? (
                <Text style={styles.cardBadge}>{item.fuel_type}</Text>
              ) : null}
              {item.transmission ? (
                <Text style={styles.cardBadge}>{item.transmission}</Text>
              ) : null}
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardLocation}>{item.location}</Text>
              <Text style={styles.cardMeta}>
                {item.doors ? `${item.doors} puertas` : item.color || 'Detalles s/d'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    },
    [navigation]
  )

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>REVVOL</Text>
          </View>

          {/* Enhanced Search Interface */}
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

          {error && <Text style={styles.errorText}>{error}</Text>}
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
    </SafeAreaView>
  )
}

const styles = homeScreenStyles
