import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 10

const formatPrice = (value) => {
  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('it-IT')}`
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

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const handleRefresh = useCallback(() => {
    if (!refreshing) {
      fetchListings({ refresh: true })
    }
  }, [fetchListings, refreshing])

  const handleLoadMore = useCallback(() => {
    if (
      !loadingMore &&
      hasMore &&
      listings.length > 0 &&
      !initialLoading
    ) {
      const cursor = listings[listings.length - 1]
      fetchListings({ cursor })
    }
  }, [fetchListings, hasMore, initialLoading, listings, loadingMore])

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
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>
            {item.make} {item.model} • {item.year}
          </Text>
          <Text style={styles.cardMeta}>
            {item.mileage ? `${item.mileage} km` : 'km n/d'} • {item.fuel_type}{' '}
            • {item.transmission}
          </Text>
          <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.cardLocation}>{item.location}</Text>
        </View>
      </View>
    )
  }, [])

  const listHeader = useCallback(() => {
    if (!error) {
      return null
    }

    return <Text style={styles.errorText}>{error}</Text>
  }, [error])

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
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={renderListing}
        contentContainerStyle={
          listings.length === 0 ? styles.emptyList : styles.listContent
        }
        ListEmptyComponent={
          !initialLoading && (
            <Text style={styles.emptyText}>
              Non ci sono annunci disponibili al momento.
            </Text>
          )
        }
        ListHeaderComponent={listHeader}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  listContent: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
    padding: 16,
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
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B5FFF',
    marginTop: 6,
  },
  cardLocation: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: '600',
    marginBottom: 16,
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
