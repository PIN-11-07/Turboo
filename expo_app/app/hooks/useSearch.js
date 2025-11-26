import { useCallback, useEffect, useMemo, useState } from 'react'
import { normalizeForSearch } from '../utils/format'

/**
 * Custom hook for advanced search functionality with filters and suggestions
 * Adapts the search logic to work with Turboo's listing structure
 */
export const useSearch = (listings = []) => {
  const [searchText, setSearchText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [sortBy, setSortBy] = useState('date') // 'date' or 'price'
  const [sortDir, setSortDir] = useState('desc') // 'asc' or 'desc'
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'
  const [showFilters, setShowFilters] = useState(false)
  
  // Calculate price and year ranges from listings data
  const priceRange = useMemo(() => {
    if (!listings || listings.length === 0) return { min: 0, max: 1000000 }
    
    const prices = listings
      .map(listing => Number(listing.price))
      .filter(price => !isNaN(price) && price > 0)
    
    if (prices.length === 0) return { min: 0, max: 1000000 }
    
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    
    return { min, max }
  }, [listings])

  const yearRange = useMemo(() => {
    if (!listings || listings.length === 0) return { min: 2000, max: new Date().getFullYear() }
    
    const years = listings
      .map(listing => Number(listing.year))
      .filter(year => !isNaN(year) && year > 0)
    
    if (years.length === 0) return { min: 2000, max: new Date().getFullYear() }
    
    return { min: Math.min(...years), max: Math.max(...years) }
  }, [listings])

  // Initialize filters with calculated ranges
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000000,
    yearMin: 2000,
    yearMax: new Date().getFullYear(),
    make: [], // Array for multi-select
    color: [], // Array for multi-select with OR condition
    fuelType: [], // Array for multi-select with OR condition
    transmission: [], // Array for multi-select with OR condition
    mileageMax: '',
    bodyType: [],
    condition: [],
    doors: [],
  })

  // Update filters when ranges change
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      priceMin: prevFilters.priceMin === 0 ? priceRange.min : prevFilters.priceMin,
      priceMax: prevFilters.priceMax === 1000000 ? priceRange.max : prevFilters.priceMax,
      yearMin: prevFilters.yearMin === 2000 ? yearRange.min : prevFilters.yearMin,
      yearMax: prevFilters.yearMax === new Date().getFullYear() ? yearRange.max : prevFilters.yearMax,
    }))
  }, [priceRange, yearRange])

  // Predefined options adapted to Turboo's data structure
  const makeOptions = useMemo(() => {
    const makes = new Set()
    listings.forEach(listing => {
      if (listing.make) makes.add(listing.make.toString().trim())
    })
    return Array.from(makes).sort()
  }, [listings])

  const colorOptions = [
    'Negro', 'Blanco', 'Gris', 'Plata', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja'
  ]

  const fuelTypeOptions = [
    'Gasolina', 'Diésel', 'Eléctrico', 'Híbrido', 'GLP', 'GNC', 'Gas'
  ]

  const transmissionOptions = [
    'Manual', 'Automática', 'Semiautomática'
  ]

  const bodyTypeOptions = [
    'SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Van', 'Pickup', 'Minivan', 'Crossover'
  ]

  const conditionOptions = [
    'Excellent', 'Good', 'Average', 'Needs restoration'
  ]

  const doorsOptions = ['2', '3', '4', '5+']

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (!searchText.trim()) return []

    const query = normalizeForSearch(searchText)
    const matches = []
    
    // Add matching makes
    makeOptions
      .filter(make => normalizeForSearch(make).startsWith(query))
      .forEach(make => matches.push({ type: 'make', value: make }))
    
    // Add matching models
    const models = new Set()
    listings.forEach(listing => {
      if (listing.model && normalizeForSearch(listing.model).startsWith(query)) {
        models.add(listing.model.toString().trim())
      }
    })
    
    Array.from(models)
      .forEach(model => matches.push({ type: 'model', value: model }))

    return matches.slice(0, 5) // Limit to 5 suggestions
  }, [searchText, makeOptions, listings])

  // Update suggestions visibility
  const updateSuggestions = useCallback((text) => {
    if (!text.trim()) {
      setShowSuggestions(false)
      return
    }
    setShowSuggestions(suggestions.length > 0)
  }, [suggestions.length])

  // Handle suggestion selection
  const handleSuggestionPress = useCallback((suggestion) => {
    setSearchText(suggestion.value)
    setShowSuggestions(false)
    setIsFocused(false)
  }, [])

  // Sort listings
  const sortListings = useCallback((items, by, dir) => {
    if (!items) return items
    const arr = [...items]
    arr.sort((a, b) => {
      if (by === 'price') {
        const pa = Number(a.price ?? 0)
        const pb = Number(b.price ?? 0)
        return dir === 'asc' ? pa - pb : pb - pa
      }
      // default: date (using created_at)
      const da = new Date(a.created_at || 0).getTime()
      const db = new Date(b.created_at || 0).getTime()
      return dir === 'asc' ? da - db : db - da
    })
    return arr
  }, [])

  // Cycle through sort options
  const cycleSort = useCallback(() => {
    const key = `${sortBy}_${sortDir}`
    let next = { by: 'date', dir: 'desc' }
    switch (key) {
      case 'date_desc':
        next = { by: 'date', dir: 'asc' }
        break
      case 'date_asc':
        next = { by: 'price', dir: 'asc' }
        break
      case 'price_asc':
        next = { by: 'price', dir: 'desc' }
        break
      case 'price_desc':
      default:
        next = { by: 'date', dir: 'desc' }
        break
    }
    setSortBy(next.by)
    setSortDir(next.dir)
  }, [sortBy, sortDir])

  // Check if listing passes filters
  const passesFilters = useCallback((listing) => {
    // Price filter
    if (Number(listing.price ?? 0) < filters.priceMin) return false
    if (Number(listing.price ?? 0) > filters.priceMax) return false
    
    // Year filter
    if (Number(listing.year ?? 0) < filters.yearMin) return false
    if (Number(listing.year ?? 0) > filters.yearMax) return false
    
    // Make filter (multi-select OR condition)
    if (Array.isArray(filters.make) && filters.make.length > 0) {
      const listingMake = normalizeForSearch(listing.make)
      const selectedMakes = filters.make.map(m => normalizeForSearch(m))
      if (!selectedMakes.includes(listingMake)) return false
    }
    
    // Color filter (multi-select OR condition)
    if (Array.isArray(filters.color) && filters.color.length > 0) {
      const listingColor = normalizeForSearch(listing.color)
      const selectedColors = filters.color.map(c => normalizeForSearch(c))
      if (!selectedColors.includes(listingColor)) return false
    }
    
    // Fuel type filter (multi-select OR condition)
    if (Array.isArray(filters.fuelType) && filters.fuelType.length > 0) {
      const listingFuelType = normalizeForSearch(listing.fuel_type)
      const selectedFuelTypes = filters.fuelType.map(f => normalizeForSearch(f))
      if (!selectedFuelTypes.includes(listingFuelType)) return false
    }
    
    // Transmission filter (multi-select OR condition)
    if (Array.isArray(filters.transmission) && filters.transmission.length > 0) {
      const listingTransmission = normalizeForSearch(listing.transmission)
      const selectedTransmissions = filters.transmission.map(t => normalizeForSearch(t))
      if (!selectedTransmissions.includes(listingTransmission)) return false
    }

    // Condition filter (multi-select OR condition)
    if (Array.isArray(filters.condition) && filters.condition.length > 0) {
      const listingCondition = normalizeForSearch(listing.condition)
      const selectedConditions = filters.condition.map(c => normalizeForSearch(c))
      if (!selectedConditions.includes(listingCondition)) return false
    }

    // Body type filter (multi-select OR condition)
    if (Array.isArray(filters.bodyType) && filters.bodyType.length > 0) {
      const listingBody = normalizeForSearch(listing.body_type)
      const selectedBodies = filters.bodyType.map(b => normalizeForSearch(b))
      if (!selectedBodies.includes(listingBody)) return false
    }

    // Doors filter (multi-select OR). Accepts numeric or string values in listings
    if (Array.isArray(filters.doors) && filters.doors.length > 0) {
      const listingDoors = String(listing.doors ?? '')
      const normalizedListingDoors = listingDoors === '5' ? '5+' : listingDoors
      const matchesDoor = filters.doors.some(d => {
        if (d === '5+' && (Number(listing.doors) >= 5)) return true
        return d === normalizedListingDoors
      })
      if (!matchesDoor) return false
    }
    
    // Mileage filter
    if (filters.mileageMax) {
      const maxMileage = Number(filters.mileageMax)
      if (!isNaN(maxMileage) && Number(listing.mileage ?? 0) > maxMileage) return false
    }
    
    return true
  }, [filters])

  // Apply search and filters
  const filteredListings = useMemo(() => {
    let result = [...listings]
    
    // Apply filters first
    const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
      if (key === 'priceMin' && val === priceRange.min) return false
      if (key === 'priceMax' && val === priceRange.max) return false
      if (key === 'yearMin' && val === yearRange.min) return false
      if (key === 'yearMax' && val === yearRange.max) return false
      if (Array.isArray(val) && val.length === 0) return false
      return val !== '' && val !== null && val !== undefined
    })
    
    if (hasActiveFilters) {
      result = result.filter(passesFilters)
    }
    
    // Apply search
    const query = normalizeForSearch(searchText)
    if (query) {
      result = result.filter(listing => {
        const searchableFields = [
          listing.title,
          listing.make,
          listing.model,
          listing.description,
          listing.location,
        ]
          .filter(Boolean)
          .map(field => normalizeForSearch(field))
          .join(' ')

        return searchableFields.includes(query) || searchableFields.startsWith(query)
      })
    }
    
    // Apply sorting
    return sortListings(result, sortBy, sortDir)
  }, [listings, filters, searchText, sortBy, sortDir, passesFilters, sortListings, priceRange, yearRange])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      yearMin: yearRange.min,
      yearMax: yearRange.max,
      make: [],
      color: [],
      fuelType: [],
      transmission: [],
      mileageMax: '',
      bodyType: [],
      condition: [],
      doors: [],
    })
    setShowFilters(false)
  }, [priceRange, yearRange])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchText('')
    setShowSuggestions(false)
    setIsFocused(false)
  }, [])

  return {
    // Search state
    searchText,
    setSearchText,
    isFocused,
    setIsFocused,
    showSuggestions,
    setShowSuggestions,
    suggestions,
    handleSuggestionPress,
    updateSuggestions,
    clearSearch,

    // Sorting state
    sortBy,
    sortDir,
    cycleSort,

    // View state
    viewMode,
    setViewMode,

    // Filters state
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    clearFilters,

    // Options
    makeOptions,
    colorOptions,
    fuelTypeOptions,
    transmissionOptions,
    bodyTypeOptions,
    conditionOptions,
    doorsOptions,
    priceRange,
    yearRange,

    // Results
    filteredListings,
  }
}