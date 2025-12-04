import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { useDataCache } from '../../context/DataCacheContext'

// Number of listings to fetch per page.
const PAGE_SIZE = 50

export const useHomeScreen = () => {
  const { homeCache, prefetchHome } = useDataCache()
  const [listings, setListings] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)

  const fetchListings = useCallback(
    async ({ cursor, refresh } = {}) => {
      // If we have cache and this is initial load, use it immediately
      if (!refresh && !cursor && homeCache && homeCache.listings.length > 0) {
        setListings(homeCache.listings)
        setHasMore(homeCache.listings.length === PAGE_SIZE)
        setInitialLoading(false)
        // Refresh in background
        prefetchHome()
        return
      }

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
            'id, user_id, title, description, price, make, model, year, mileage, fuel_type, transmission, doors, color, location, images, created_at'
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
        setError('Unable to load listings. Please try again later.')
      } finally {
        if (refresh) {
          setRefreshing(false)
        } else if (cursor) {
          setLoadingMore(false)
        } else {
          setInitialLoading(false)
        }
      }
    },
    [homeCache, prefetchHome]
  )

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const handleRefresh = useCallback(() => {
    if (!refreshing) {
      fetchListings({ refresh: true })
    }
  }, [fetchListings, refreshing])

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && listings.length > 0 && !initialLoading) {
      const cursor = listings[listings.length - 1]
      fetchListings({ cursor })
    }
  }, [
    fetchListings,
    hasMore,
    initialLoading,
    listings,
    loadingMore,
  ])

  const removeListingById = useCallback((listingId) => {
    if (!listingId) {
      return
    }
    setListings((prev) => prev.filter((listing) => listing.id !== listingId))
  }, [])

  return {
    listings,
    initialLoading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    handleRefresh,
    handleLoadMore,
    removeListingById,
  }
}
