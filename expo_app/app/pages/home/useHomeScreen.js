import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../util/supabase'
import { useSearch } from '../../hooks/useSearch'

// Number of listings to fetch per page. Increased to show more results per request.
const PAGE_SIZE = 50

export const useHomeScreen = () => {
  const [listings, setListings] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)

  // Initialize advanced search functionality
  const search = useSearch(listings)

  const fetchListings = useCallback(
    async ({ cursor, refresh } = {}) => {
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
    },
    []
  )

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  // Use advanced search exclusively
  const filteredListings = search.filteredListings

  const handleRefresh = useCallback(() => {
    if (!refreshing) {
      fetchListings({ refresh: true })
    }
  }, [fetchListings, refreshing])

  const handleLoadMore = useCallback(() => {
    // Disable load more when using search or filters
    if (search.searchText.trim() || search.showFilters) {
      return
    }

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
    search.searchText,
    search.showFilters,
  ])

  const removeListingById = useCallback((listingId) => {
    if (!listingId) {
      return
    }
    setListings((prev) => prev.filter((listing) => listing.id !== listingId))
  }, [])

  return {
    listings,
    filteredListings,
    initialLoading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    handleRefresh,
    handleLoadMore,
    removeListingById,
    search,
  }
}
