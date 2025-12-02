import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { supabase } from '../utils/supabase'
import { useAuth } from '../context/AuthContext'
import { palette } from '../theme/palette'

const FAVORITE_NOT_FOUND_CODES = new Set(['PGRST116', 'PGRST114'])
const DEFAULT_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 }

const favoriteStatusCache = new Map()
const favoriteStatusListeners = new Map()
let cachedUserId = undefined

const subscribeToFavoriteStatus = (listingKey, callback) => {
  if (!listingKey) {
    return () => {}
  }

  if (!favoriteStatusListeners.has(listingKey)) {
    favoriteStatusListeners.set(listingKey, new Set())
  }

  const callbacks = favoriteStatusListeners.get(listingKey)
  callbacks.add(callback)

  return () => {
    callbacks.delete(callback)
    if (callbacks.size === 0) {
      favoriteStatusListeners.delete(listingKey)
    }
  }
}

const setFavoriteStatus = (listingKey, value, { emit = true } = {}) => {
  if (!listingKey) {
    return
  }

  const normalizedValue = Boolean(value)
  const previousValue = favoriteStatusCache.get(listingKey)
  favoriteStatusCache.set(listingKey, normalizedValue)

  if (!emit || previousValue === normalizedValue) {
    return
  }

  const callbacks = favoriteStatusListeners.get(listingKey)
  if (!callbacks) {
    return
  }

  callbacks.forEach((listener) => {
    try {
      listener(normalizedValue)
    } catch (listenerError) {
      console.error('[FavoriteButton] Listener error', listenerError)
    }
  })
}

const syncCacheForUser = (userId) => {
  if (cachedUserId === userId) {
    return
  }

  cachedUserId = userId
  favoriteStatusCache.clear()

  favoriteStatusListeners.forEach((callbacks) => {
    callbacks.forEach((listener) => {
      try {
        listener(false)
      } catch (listenerError) {
        console.error('[FavoriteButton] Listener error', listenerError)
      }
    })
  })
}

const variantStyles = StyleSheet.create({
  detail: {
    button: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
    },
    buttonActive: {},
    buttonDisabled: {
      opacity: 0.6,
    },
    icon: {
      fontSize: 20,
      color: palette.textPrimary,
    },
    iconActive: {
      color: palette.danger,
    },
  },
  overlay: {
    button: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(4, 4, 4, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonActive: {
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
    },
    buttonDisabled: {
      opacity: 0.65,
    },
    icon: {
      fontSize: 20,
      color: palette.textPrimary,
    },
    iconActive: {
      color: palette.danger,
    },
  },
  list: {
    button: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
      marginLeft: 12,
    },
    buttonActive: {},
    buttonDisabled: {
      opacity: 0.6,
    },
    icon: {
      fontSize: 18,
      color: palette.textPrimary,
    },
    iconActive: {
      color: palette.danger,
    },
  },
})

export function FavoriteButton({
  listingId,
  variant = 'detail',
  initialIsFavorite,
  fetchOnMount = true,
  onStatusChange,
  style,
  iconStyle,
  hitSlop = DEFAULT_HIT_SLOP,
  disabled: disabledProp = false,
}) {
  const { user } = useAuth()
  const listingKey = useMemo(() => (listingId == null ? null : String(listingId)), [listingId])
  const variantConfig = variantStyles[variant] ?? variantStyles.detail
  const onStatusChangeRef = useRef(onStatusChange)
  onStatusChangeRef.current = onStatusChange

  const derivedInitial = useMemo(() => {
    if (typeof initialIsFavorite === 'boolean') {
      return initialIsFavorite
    }

    if (listingKey && favoriteStatusCache.has(listingKey)) {
      return favoriteStatusCache.get(listingKey)
    }

    return false
  }, [initialIsFavorite, listingKey])

  const [isFavorite, setIsFavorite] = useState(derivedInitial)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    syncCacheForUser(user?.id ?? null)
  }, [user?.id])

  useEffect(() => {
    if (!listingKey) {
      setIsFavorite(false)
      return
    }

    setIsFavorite((prev) => (prev === derivedInitial ? prev : derivedInitial))

    if (typeof initialIsFavorite === 'boolean') {
      setFavoriteStatus(listingKey, initialIsFavorite, { emit: false })
    }
  }, [derivedInitial, initialIsFavorite, listingKey])

  useEffect(() => {
    if (!listingKey) {
      return undefined
    }

    const unsubscribe = subscribeToFavoriteStatus(listingKey, (nextValue) => {
      setIsFavorite((prev) => (prev === nextValue ? prev : nextValue))

      if (typeof onStatusChangeRef.current === 'function') {
        onStatusChangeRef.current(nextValue)
      }
    })

    return unsubscribe
  }, [listingKey])

  useEffect(() => {
    if (!user || !listingKey || !fetchOnMount) {
      setLoading(false)
      return
    }

    if (favoriteStatusCache.has(listingKey)) {
      setLoading(false)
      return
    }

    let isMounted = true
    setLoading(true)

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('listing_id', listingId)
          .maybeSingle()

        if (error && !FAVORITE_NOT_FOUND_CODES.has(error.code)) {
          throw error
        }

        if (isMounted) {
          setFavoriteStatus(listingKey, Boolean(data))
        }
      } catch (statusError) {
        console.error('[FavoriteButton] Error fetching status', statusError)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStatus()

    return () => {
      isMounted = false
    }
  }, [fetchOnMount, listingId, listingKey, user])

  useEffect(() => {
    if (user) {
      return
    }

    if (listingKey) {
      setFavoriteStatus(listingKey, false)
    }
  }, [listingKey, user])

  const handleToggle = useCallback(async () => {
    if (!user || !listingId || loading || disabledProp) {
      return
    }

    setLoading(true)

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId)

        if (error) {
          throw error
        }
      } else {
        const { error } = await supabase.from('favorites').insert({
          user_id: user.id,
          listing_id: listingId,
        })

        if (error) {
          throw error
        }
      }

      setFavoriteStatus(listingKey, !isFavorite)
    } catch (toggleError) {
      console.error('[FavoriteButton] Error toggling favorite', toggleError)
    } finally {
      setLoading(false)
    }
  }, [disabledProp, isFavorite, listingId, listingKey, loading, user])

  const disabled = disabledProp || loading || !user || !listingId
  const buttonStyles = [
    variantConfig.button,
    isFavorite && variantConfig.buttonActive,
    disabled && variantConfig.buttonDisabled,
    style,
  ]
  const iconStyles = [variantConfig.icon, isFavorite && variantConfig.iconActive, iconStyle]
  const accessibilityLabel = isFavorite
    ? 'Quitar de favoritos'
    : 'Agregar a favoritos'

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={0.8}
      style={buttonStyles}
      onPress={handleToggle}
      disabled={disabled}
      hitSlop={hitSlop}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.textPrimary} />
      ) : (
        <Text style={iconStyles}>{isFavorite ? '♥' : '♡'}</Text>
      )}
    </TouchableOpacity>
  )
}

export { subscribeToFavoriteStatus, setFavoriteStatus }
export default FavoriteButton
