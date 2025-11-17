import { useEffect, useMemo, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { supabase } from '../../util/supabase'

const REQUIRED_FIELDS = [
  'description',
  'make',
  'model',
  'year',
  'mileage',
  'fuel_type',
  'transmission',
  'doors',
  'color',
  'images',
  'created_at',
]

const hasRequiredFields = (listing) =>
  listing &&
  REQUIRED_FIELDS.every((field) => Object.prototype.hasOwnProperty.call(listing, field))

const formatDate = (value) => {
  if (!value) {
    return 'Fecha no disponible'
  }

  try {
    return new Date(value).toLocaleDateString('es-ES')
  } catch {
    return 'Fecha no disponible'
  }
}

const normalizeImages = (value) => {
  if (Array.isArray(value)) {
    return value.filter((uri) => typeof uri === 'string' && uri.trim().length > 0)
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed)
        ? parsed.filter((uri) => typeof uri === 'string' && uri.trim().length > 0)
        : []
    } catch {
      return []
    }
  }

  return []
}

export const useListingDetailScreen = () => {
  const route = useRoute()
  const params = route.params ?? {}
  const listingId = params.listingId ?? params?.listing?.id ?? null
  const initialListing = params.listing ?? null
  const [listing, setListing] = useState(initialListing)
  const [loading, setLoading] = useState(!hasRequiredFields(initialListing))
  const [error, setError] = useState(null)

  useEffect(() => {
    const shouldFetch = !hasRequiredFields(initialListing) && listingId

    if (!shouldFetch) {
      return
    }

    let isMounted = true

    const fetchListing = async () => {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('listings')
        .select(
          'id, title, description, price, make, model, year, mileage, fuel_type, transmission, doors, color, images, created_at'
        )
        .eq('id', listingId)
        .maybeSingle()

      if (!isMounted) {
        return
      }

      if (queryError) {
        console.error(queryError)
        setError('No es posible cargar el vehículo en este momento.')
      } else {
        setListing(data)
      }

      setLoading(false)
    }

    fetchListing()

    return () => {
      isMounted = false
    }
  }, [initialListing, listingId])

  const images = useMemo(() => normalizeImages(listing?.images), [listing?.images])

  const caption = useMemo(() => {
    if (!listing?.created_at) {
      return null
    }
    return `Publicado el ${formatDate(listing.created_at)}`
  }, [listing?.created_at])

  return {
    listing,
    listingId,
    loading,
    error,
    images,
    caption,
  }
}
