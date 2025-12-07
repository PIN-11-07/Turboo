import { supabase } from './supabase'

// Simple recommender module.
// - Exposes `getRecommendationsForUser(userId, { limit })`
// - Keeps algorithm separate and easy to replace with more advanced logic.

const DEFAULT_LIMIT = 5

async function fetchFavoriteListingIds(userId) {
  if (!userId) return []

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', userId)

    if (error) {
      console.warn('[recommender] could not fetch favorites', error)
      return []
    }

    // Normalize ids to numbers where possible to avoid type mismatches
    return (data || []).map((r) => {
      const val = r.listing_id
      const n = Number(val)
      return Number.isFinite(n) ? n : val
    })
  } catch (e) {
    console.error('[recommender] fetchFavoriteListingIds error', e)
    return []
  }
}

async function fetchListingsByIds(ids) {
  if (!ids || ids.length === 0) return []

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('id, user_id, title, price, make, model, year, mileage, fuel_type, transmission, images, location, created_at')
      .in('id', ids)

    if (error) {
      console.warn('[recommender] fetchListingsByIds error', error)
      return []
    }

    return data || []
  } catch (e) {
    console.error('[recommender] fetchListingsByIds exception', e)
    return []
  }
}

async function fetchSimilarListings({ makes = [], models = [], excludeIds = [], limit = 5 }) {
  try {
    // Build a basic OR query: same make or same model
    // Supabase doesn't support complex OR with arrays directly in JS client,
    // so we do two queries and merge them.
    const queries = []

    if (makes.length > 0) {
      queries.push(
        supabase
          .from('listings')
          .select('id, user_id, title, price, make, model, year, mileage, fuel_type, transmission, images, location, created_at')
          .in('make', makes)
          .neq('is_active', false)
          .limit(limit)
      )
    }

    if (models.length > 0) {
      queries.push(
        supabase
          .from('listings')
          .select('id, user_id, title, price, make, model, year, mileage, fuel_type, transmission, images, location, created_at')
          .in('model', models)
          .neq('is_active', false)
          .limit(limit)
      )
    }

    const results = await Promise.all(queries)

    let merged = []
    results.forEach((r) => {
      if (r && r.data) merged = merged.concat(r.data)
    })

    // Fallback: if still empty, return recent active listings
    if (merged.length === 0) {
      const { data } = await supabase
        .from('listings')
        .select('id, user_id, title, price, make, model, year, mileage, fuel_type, transmission, images, location, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      merged = data || []
    }

    // Exclude provided ids and dedupe
    const filtered = merged
      .filter((l) => !excludeIds.includes(l.id))
      .reduce((acc, cur) => {
        if (!acc.byId.has(cur.id)) {
          acc.byId.add(cur.id)
          acc.items.push(cur)
        }
        return acc
      }, { byId: new Set(), items: [] })
      .items.slice(0, limit)

    return filtered
  } catch (e) {
    console.error('[recommender] fetchSimilarListings error', e)
    return []
  }
}

export async function getRecommendationsForUser(userId, { limit = DEFAULT_LIMIT } = {}) {
  // 1) Try to gather favorites
  const favoriteIds = await fetchFavoriteListingIds(userId)
  console.debug('[recommender] favoriteIds count', favoriteIds.length)

  // 2) If we have favorites, fetch their listing records to extract features
  if (favoriteIds.length > 0) {
    const favSet = new Set((favoriteIds || []).map((v) => String(v)))
    // First attempt: content-based using makes/models
    const favoriteListings = await fetchListingsByIds(favoriteIds)
    console.debug('[recommender] favoriteListings fetched', favoriteListings.length)

    // Build feature profile from the user's favorite listings for MVP
    const makeCounts = {}
    const fuelCounts = {}
    const transCounts = {}
    const prices = []
    const mileages = []

    favoriteListings.forEach((l) => {
      if (l.make) makeCounts[l.make] = (makeCounts[l.make] || 0) + 1
      if (l.fuel_type) fuelCounts[l.fuel_type] = (fuelCounts[l.fuel_type] || 0) + 1
      if (l.transmission) transCounts[l.transmission] = (transCounts[l.transmission] || 0) + 1
      if (l.price) prices.push(Number(l.price))
      if (l.mileage) mileages.push(Number(l.mileage))
    })

    const topMakes = Object.entries(makeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map((r) => r[0])

    const topFuel = Object.entries(fuelCounts)
      .sort((a, b) => b[1] - a[1])
      .map((r) => r[0])[0]

    const topTrans = Object.entries(transCounts)
      .sort((a, b) => b[1] - a[1])
      .map((r) => r[0])[0]

    const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null
    const avgMileage = mileages.length ? mileages.reduce((a, b) => a + b, 0) / mileages.length : null

    console.debug('[recommender] profile topMakes', topMakes, 'topFuel', topFuel, 'topTrans', topTrans, 'avgPrice', avgPrice, 'avgMileage', avgMileage)

    // If we have at least one feature signal, score candidates by distance to this profile
    if (topMakes.length > 0 || topFuel || topTrans || avgPrice || avgMileage) {
      const { data: candidateData, error: candidateErr } = await supabase
        .from('listings')
        .select('id, user_id, title, price, make, model, year, mileage, fuel_type, transmission, images, location, created_at')
        .eq('is_active', true)
        .neq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(200)

      if (candidateErr) {
        console.warn('[recommender] candidate fetch error', candidateErr)
      } else {
        const favSet = new Set((favoriteIds || []).map((v) => String(v)))

        // Weight config (tweak for MVP)
        const MAKE_WEIGHT = 4
        const FUEL_WEIGHT = 2
        const TRANS_WEIGHT = 2
        const PRICE_WEIGHT = 3
        const MILEAGE_WEIGHT = 2
        const RECENCY_WEIGHT = 1

        const scored = (candidateData || [])
          .map((item) => {
            let score = 0

            // Make match (top makes get priority)
            if (item.make && topMakes.includes(item.make)) {
              // stronger if it's the top make
              if (item.make === topMakes[0]) score += MAKE_WEIGHT
              else score += Math.floor(MAKE_WEIGHT / 2)
            }

            // Fuel type
            if (topFuel && item.fuel_type === topFuel) score += FUEL_WEIGHT

            // Transmission
            if (topTrans && item.transmission === topTrans) score += TRANS_WEIGHT

            // Price closeness: normalized distance
            if (avgPrice && item.price) {
              const pd = Math.abs(Number(item.price) - avgPrice) / Math.max(1, avgPrice)
              if (pd <= 0.1) score += PRICE_WEIGHT
              else if (pd <= 0.25) score += Math.ceil(PRICE_WEIGHT / 2)
            }

            // Mileage closeness
            if (avgMileage && item.mileage) {
              const md = Math.abs(Number(item.mileage) - avgMileage) / Math.max(1, avgMileage)
              if (md <= 0.15) score += MILEAGE_WEIGHT
              else if (md <= 0.4) score += Math.ceil(MILEAGE_WEIGHT / 2)
            }

            // small recency bonus
            const ageHours = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60)
            if (ageHours < 48) score += RECENCY_WEIGHT

            return { item, score }
          })
          // exclude favorites
          .filter(({ item }) => !favSet.has(String(item.id)))
          // only keep positive-score items first
          .filter(({ score }) => score > 0)
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score
            return new Date(b.item.created_at) - new Date(a.item.created_at)
          })
          .slice(0, limit)
          .map((s) => s.item)

        console.debug('[recommender] scored candidates', scored.length)

        if (scored.length > 0) {
          return scored
        }
      }
    }

    // If content-based returned nothing, try a simple collaborative approach:
    try {
      // 1) find other users who favorited the same listings
      const { data: coFavorites, error: coFavErr } = await supabase
        .from('favorites')
        .select('user_id')
        .in('listing_id', favoriteIds)
        .neq('user_id', userId)

      if (!coFavErr && Array.isArray(coFavorites) && coFavorites.length > 0) {
        const coUserIds = [...new Set(coFavorites.map((r) => r.user_id))].slice(0, 200)
        console.debug('[recommender] coUserIds count', coUserIds.length)

        // 2) get the favorites of those users
        const { data: othersFavs, error: othersFavsErr } = await supabase
          .from('favorites')
          .select('listing_id')
          .in('user_id', coUserIds)

        if (!othersFavsErr && Array.isArray(othersFavs) && othersFavs.length > 0) {
          // count occurrences and pick top ones not already favorited
          const counts = new Map()
          othersFavs.forEach((r) => {
            const id = Number(r.listing_id)
            if (!favoriteIds.includes(id)) {
              counts.set(id, (counts.get(id) || 0) + 1)
            }
          })

          const topIds = Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map((r) => r[0])

          console.debug('[recommender] collaborative topIds', topIds)

          if (topIds.length > 0) {
            let recs = await fetchListingsByIds(topIds)
            // Exclude listings owned by the user and any favorites
            recs = (recs || []).filter((r) => String(r.user_id) !== String(userId) && !favSet.has(String(r.id)))
            if (recs.length > 0) return recs
          }
        }
      }
    } catch (e) {
      console.warn('[recommender] collaborative step failed', e)
    }
  }

  // 3) Fallback: return popular / recent listings
  try {
    const { data } = await supabase
      .from('listings')
      .select('id, user_id, title, price, make, model, year, mileage, fuel_type, images, location, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(200)

    const favSet = new Set((favoriteIds || []).map((v) => String(v)))
    const filtered = (data || [])
      .filter((l) => String(l.user_id) !== String(userId))
      .filter((l) => !favSet.has(String(l.id)))
      .slice(0, limit)

    return filtered
  } catch (e) {
    console.error('[recommender] fallback listings error', e)
    return []
  }
}

export default {
  getRecommendationsForUser,
}
