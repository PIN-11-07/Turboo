import { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { getUserTransactionHistory } from '../services/transactions'
import { useAuth } from './AuthContext'

const LISTING_FIELDS =
    'id, user_id, title, description, price, make, model, year, mileage, fuel_type, transmission, doors, color, images, is_active, created_at, location'

const PAGE_SIZE = 50

// Create context for data preloading
const DataCacheContext = createContext({
    profileCache: null,
    homeCache: null,
    prefetchProfile: () => { },
    prefetchHome: () => { },
    clearCache: () => { },
})

export const useDataCache = () => useContext(DataCacheContext)

export const DataCacheProvider = ({ children }) => {
    const { user } = useAuth()
    const [profileCache, setProfileCache] = useState(null)
    const [homeCache, setHomeCache] = useState(null)
    const profileFetchingRef = useRef(false)
    const homeFetchingRef = useRef(false)

    const prefetchProfile = useCallback(async () => {
        if (!user || profileFetchingRef.current) return

        profileFetchingRef.current = true

        try {
            const [
                { data: authData },
                { data: profileData },
                { data: listingsData },
                { data: favoritesData },
                transactionHistoryData,
            ] = await Promise.all([
                supabase.auth.getUser(),
                supabase
                    .from('profiles')
                    .select('profile_image_url, saldo, full_name, rating_avg')
                    .eq('id', user.id)
                    .maybeSingle(),
                supabase
                    .from('listings')
                    .select(LISTING_FIELDS)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('favorites')
                    .select(`listing:listing_id (${LISTING_FIELDS})`)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false }),
                getUserTransactionHistory(user.id).catch(() => []),
            ])

            setProfileCache({
                authData,
                profileData,
                listingsData,
                favoritesData,
                transactionHistoryData,
                timestamp: Date.now(),
            })
        } catch (error) {
            console.error('Profile prefetch error:', error)
        } finally {
            profileFetchingRef.current = false
        }
    }, [user])

    const prefetchHome = useCallback(async () => {
        if (homeFetchingRef.current) return

        homeFetchingRef.current = true

        try {
            const { data, error } = await supabase
                .from('listings')
                .select(LISTING_FIELDS)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .order('id', { ascending: false })
                .limit(PAGE_SIZE)

            if (!error && data) {
                setHomeCache({
                    listings: data,
                    timestamp: Date.now(),
                })

                // Prefetch first images in background
                const imagesToPrefetch = data
                    .slice(0, 10) // Only prefetch first 10 images
                    .map(listing => Array.isArray(listing.images) && listing.images.length > 0 ? listing.images[0] : null)
                    .filter(Boolean)

                // Prefetch images in background without blocking
                imagesToPrefetch.forEach(imageUrl => {
                    if (imageUrl) {
                        // Using fetch to warm up the cache
                        fetch(imageUrl).catch(() => { }) // Silent fail
                    }
                })
            }
        } catch (error) {
            console.error('Home prefetch error:', error)
        } finally {
            homeFetchingRef.current = false
        }
    }, [])

    const clearCache = useCallback(() => {
        setProfileCache(null)
        setHomeCache(null)
    }, [])

    // Prefetch data when user logs in
    useEffect(() => {
        if (user) {
            // Start prefetching in background
            prefetchProfile()
            prefetchHome()
        } else {
            // Clear cache when user logs out
            clearCache()
        }
    }, [user, prefetchProfile, prefetchHome, clearCache])

    return (
        <DataCacheContext.Provider
            value={{
                profileCache,
                homeCache,
                prefetchProfile,
                prefetchHome,
                clearCache,
            }}
        >
            {children}
        </DataCacheContext.Provider>
    )
}
