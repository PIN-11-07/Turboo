import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { supabase } from '../../../util/supabase'
import { homeScreenStyles } from '../HomeStyles'
import { palette } from '../../../theme/palette'

const PAGE_SIZE = 10

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
  const [listings, setListings] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchListings = useCallback(async ({ cursor, refresh } = {}) => {
    if (refresh) {
      setRefreshing(true)
    } else if (cursor) {
      setLoadingMore(true)
    } else {
      setInitialLoading(true)
    }

    try {
      const baseQuery = supabase
        .from('listings')
        .select(
          'id, title, description, price, make, model, year, mileage, fuel_type, transmission, doors, color, location, images, created_at'
        )
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .limit(PAGE_SIZE)

      if (cursor) {
        const createdAtISO = new Date(cursor.created_at).toISOString()
        baseQuery.or(
          `created_at.lt.${createdAtISO},and(created_at.eq.${createdAtISO},id.lt.${cursor.id})`
        )
      }

      const { data, error: queryError } = await baseQuery

      if (queryError) {
        throw queryError
      }

      setHasMore(data.length === PAGE_SIZE)
      setError(null)

      if (refresh) {
        setListings(data)
      } else if (cursor) {
        setListings((prev) => [...prev, ...data])
      } else {
        setListings(data)
      }
    } catch (fetchError) {
      console.error(fetchError)
      setError('No es posible cargar los anuncios. Inténtalo de nuevo más tarde.')
    } finally {
      if (refresh) {
        setRefreshing(false)
      } else if (cursor) {
        setLoadingMore(false)
      } else {
        setInitialLoading(false)
      }
    }
  }, [])

  const filteredListings = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return listings
    }

    return listings.filter((listing) => {
      const searchableFields = [
        listing.title,
        listing.make,
        listing.model,
        listing.description,
        listing.location,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableFields.includes(normalizedQuery)
    })
  }, [listings, searchQuery])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const handleRefresh = useCallback(() => {
    if (!refreshing) {
      fetchListings({ refresh: true })
    }
  }, [fetchListings, refreshing])

  const handleLoadMore = useCallback(() => {
    if (searchQuery.trim()) {
      return
    }

    if (
      !loadingMore &&
      hasMore &&
      listings.length > 0 &&
      !initialLoading
    ) {
      const cursor = listings[listings.length - 1]
      fetchListings({ cursor })
    }
  }, [fetchListings, hasMore, initialLoading, listings, loadingMore, searchQuery])

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
          {mainImage ? (
            <Image source={{ uri: mainImage }} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <Text style={styles.cardImagePlaceholderText}>Sin foto</Text>
            </View>
          )}
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
            <Text style={styles.heroTitle}>Explora las mejores ofertas</Text>
            <Text style={styles.heroSubtitle}>
              Encuentra el coche perfecto cerca de ti
            </Text>
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
