import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const notFoundErrorCodes = new Set(['PGRST116', 'PGRST114'])

const extractName = (supabaseUser) => {
  if (!supabaseUser) {
    return null
  }

  const metadata =
    supabaseUser.user_metadata ??
    supabaseUser.raw_user_meta_data ??
    supabaseUser.app_metadata ??
    {}

  return (
    (typeof metadata.full_name === 'string' && metadata.full_name.trim()) ||
    (typeof metadata.name === 'string' && metadata.name.trim()) ||
    (typeof metadata.display_name === 'string' && metadata.display_name.trim()) ||
    null
  )
}

const formatPrice = (value) => {
  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('it-IT')}`
  }

  if (typeof value === 'string' && value.trim()) {
    return value
  }

  return 'Prezzo su richiesta'
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)
  const [listings, setListings] = useState([])

  useEffect(() => {
    let isMounted = true

    const fetchProfile = async () => {
      if (!user) {
        if (isMounted) {
          setProfile(null)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [
          { data: authData, error: authError },
          { data: profileData, error: profileError },
          { data: listingsData, error: listingsError },
        ] =
          await Promise.all([
            supabase.auth.getUser(),
            supabase
              .from('profiles')
              .select('profile_image_url')
              .eq('id', user.id)
              .maybeSingle(),
            supabase
              .from('listings')
              .select('id, title, price, images, created_at')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
          ])

        if (authError) {
          throw authError
        }

        if (profileError && !notFoundErrorCodes.has(profileError.code)) {
          throw profileError
        }

        if (listingsError) {
          throw listingsError
        }

        if (!isMounted) {
          return
        }

        const authUser = authData?.user ?? null

        const name =
          extractName(authUser) ||
          extractName(user) ||
          null

        const mail =
          (typeof authUser?.email === 'string' && authUser.email.trim()) ||
          (typeof user?.email === 'string' && user.email.trim()) ||
          null

        setProfile({
          name,
          mail,
          profileImageUrl: profileData?.profile_image_url || null,
        })
        setListings(Array.isArray(listingsData) ? listingsData : [])
      } catch (fetchError) {
        console.error(fetchError)
        if (isMounted) {
          setError('Impossibile caricare il profilo. Riprova più tardi.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      isMounted = false
    }
  }, [user])

  const avatarInitial = useMemo(() => {
    const fallbackName = profile?.name || user?.email || ''
    return fallbackName.trim().charAt(0).toUpperCase() || '?'
  }, [profile?.name, user?.email])

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0B5FFF" />
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )
    }

    if (!user) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.infoText}>Effettua l&apos;accesso per visualizzare il profilo.</Text>
        </View>
      )
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarWrapper}>
          {profile?.profileImageUrl ? (
            <Image
              source={{ uri: profile.profileImageUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{avatarInitial}</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Nome</Text>
          <Text style={styles.cardValue}>{profile?.name || 'Non disponibile'}</Text>

          <Text style={styles.cardLabel}>Email</Text>
          <Text style={styles.cardValue}>{profile?.mail || 'Non disponibile'}</Text>

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I tuoi annunci</Text>
          {listings.length === 0 ? (
            <Text style={styles.emptyState}>Non hai ancora pubblicato annunci.</Text>
          ) : (
            listings.map((listing) => (
              <View key={listing.id} style={styles.listingCard}>
                <View style={styles.listingImageWrapper}>
                  {Array.isArray(listing.images) && listing.images.length > 0 ? (
                    <Image
                      source={{ uri: listing.images[0] }}
                      style={styles.listingImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.listingImagePlaceholder}>
                      <Text style={styles.listingImagePlaceholderText}>Nessuna foto</Text>
                    </View>
                  )}
                </View>
                <View style={styles.listingInfo}>
                  <Text style={styles.listingTitle}>{listing.title}</Text>
                  <Text style={styles.listingPrice}>{formatPrice(listing.price)}</Text>
                  <Text style={styles.listingDate}>
                    Pubblicato il{' '}
                    {listing.created_at
                      ? new Date(listing.created_at).toLocaleDateString('it-IT')
                      : 'data n/d'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Esci</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }

  return <SafeAreaView style={styles.safeArea}>{renderContent()}</SafeAreaView>
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    textAlign: 'center',
    color: '#D93025',
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    color: '#1F1F1F',
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 16,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: '600',
    color: '#4C7EFF',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6A7280',
    marginTop: 12,
  },
  cardValue: {
    fontSize: 18,
    color: '#1F1F1F',
    fontWeight: '500',
    marginTop: 4,
  },
  section: {
    width: '100%',
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F1F1F',
    marginBottom: 16,
  },
  emptyState: {
    fontSize: 16,
    color: '#6A7280',
  },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  listingImageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  listingImage: {
    width: '100%',
    height: '100%',
  },
  listingImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingImagePlaceholderText: {
    fontSize: 12,
    color: '#6A7280',
    textAlign: 'center',
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
  },
  listingPrice: {
    fontSize: 15,
    color: '#0B5FFF',
    marginTop: 6,
    fontWeight: '500',
  },
  listingDate: {
    fontSize: 13,
    color: '#6A7280',
    marginTop: 4,
  },
  signOutButton: {
    marginTop: 32,
    backgroundColor: '#D93025',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
