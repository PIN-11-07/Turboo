import React, { useCallback } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { homeScreenStyles } from '../HomeStyles'
import { palette } from '../../../theme/palette'
import FavoriteButton from '../../../components/FavoriteButton'
import { useHomeScreen } from '../hooks/useHomeScreen'

const formatPrice = (value) => {
  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('es-ES')}`
  }

  return value ?? '-'
}

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
    searchQuery,
    setSearchQuery,
    handleRefresh,
    handleLoadMore,
  } = useHomeScreen()

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
            <Text style={styles.heroTitle}>TURBOO</Text>
          </View>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Busca marca, modelo o ciudad"
              placeholderTextColor={palette.textMuted}
              style={styles.searchInput}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderListing}
          contentContainerStyle={
            filteredListings.length === 0 ? styles.emptyList : styles.listContent
          }
          ListEmptyComponent={
            !initialLoading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {searchQuery
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
