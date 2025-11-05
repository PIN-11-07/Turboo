import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'

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
      setError('Impossibile caricare gli annunci. Riprova più tardi.')
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

  const renderListing = useCallback(({ item }) => {
    const mainImage = getMainImage(item.images)

    return (
      <View style={styles.card}>
        {mainImage ? (
          <Image source={{ uri: mainImage }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Text style={styles.cardImagePlaceholderText}>Nessuna foto</Text>
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
              {item.mileage ? `${item.mileage} km` : 'km n/d'}
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
              {item.doors ? `${item.doors} porte` : item.color || 'Dettagli n/d'}
            </Text>
          </View>
        </View>
      </View>
    )
  }, [])

  const listFooter = useCallback(() => {
    if (!loadingMore) {
      return null
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0B5FFF" />
      </View>
    )
  }, [loadingMore])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Esplora le migliori occasioni</Text>
            <Text style={styles.heroSubtitle}>
              Trova l'auto perfetta vicino a te
            </Text>
          </View>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cerca marca, modello o città"
              placeholderTextColor="#9CA3AF"
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
                    ? 'Nessun annuncio corrisponde alla tua ricerca.'
                    : 'Non ci sono annunci disponibili al momento.'}
                </Text>
              </View>
            )
          }
          ListFooterComponent={listFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />

        {initialLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0B5FFF" />
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  topSection: {
    paddingTop: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  hero: {
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  searchInput: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardImagePlaceholder: {
    backgroundColor: '#D9DCE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImagePlaceholderText: {
    color: '#525868',
    fontWeight: '600',
  },
  cardContent: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#4B5563',
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B5FFF',
  },
  cardBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  cardBadge: {
    backgroundColor: '#EEF2FF',
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  cardLocation: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 246, 250, 0.6)',
  },
})
