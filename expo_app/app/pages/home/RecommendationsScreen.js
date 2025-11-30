import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { homeScreenStyles } from './HomeStyles'
import { palette } from '../../theme/palette'
import FavoriteButton from '../../components/FavoriteButton'
import { useAuth } from '../../context/AuthContext'
import recommender from '../../util/recommender'
import { styles } from "./RecommendationsStyles"
import { LinearGradient } from 'expo-linear-gradient'

const getMainImage = (images) => (Array.isArray(images) && images.length > 0 ? images[0] : null)

export default function RecommendationsScreen() {
  const navigation = useNavigation()
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [visibleCount, setVisibleCount] = useState(1) // show top item first

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const recs = await recommender.getRecommendationsForUser(user?.id, { limit: 24 })
        // recommender returns scored list (best first)
        if (mounted) setRecommendations(recs || [])
      } catch (e) {
        console.warn('[RecommendationsScreen] load error', e)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [user?.id])

  const renderItem = useCallback(
    ({ item }) => {
      const mainImage = getMainImage(item.images)
      return (
        <TouchableOpacity
          style={[homeScreenStyles.card, { marginBottom: 12 }]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ListingDetail', { listingId: item.id, listing: item })}
        >
          {mainImage ? (
            <View style={homeScreenStyles.cardImageWrapper}>
              <Image source={{ uri: mainImage }} style={[homeScreenStyles.cardImage, { height: 220 }]} />
              <View style={homeScreenStyles.favoriteButton}>
                <FavoriteButton listingId={item.id} variant="icon" />
              </View>
            </View>
          ) : (
            <View style={[homeScreenStyles.cardImage, homeScreenStyles.cardImagePlaceholder]}>
              <Text style={homeScreenStyles.cardImagePlaceholderText}>Sin foto</Text>
            </View>
          )}
          <View style={homeScreenStyles.cardContent}>
            <View style={homeScreenStyles.cardHeader}>
              <Text style={homeScreenStyles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                {item.title || `${item.make || ''} ${item.model || ''}`}
              </Text>
              <Text style={homeScreenStyles.cardPrice}>{item.price ? `€ ${Number(item.price).toLocaleString('es-ES')}` : '-'}</Text>
            </View>
            <Text style={homeScreenStyles.cardSubtitle}>{item.year || ''} • {item.mileage ? `${item.mileage} km` : '-'} • {item.fuel_type || '-'}</Text>
          </View>
        </TouchableOpacity>
      )
    },
    [navigation]
  )

  const featured = useMemo(() => (recommendations && recommendations.length > 0 ? recommendations[0] : null), [recommendations])

  const remaining = useMemo(() => (recommendations && recommendations.length > 1 ? recommendations.slice(1) : []), [recommendations])

  const dataToShow = remaining.slice(0, Math.max(0, visibleCount - (featured ? 1 : 0)))

  const onEndReached = () => {
    // reveal 3 more items each time
    setVisibleCount((v) => Math.min(recommendations.length, v + 3))
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.heroTitleMain}>Selected</Text>
        <Text style={styles.heroTitleSub}>for you</Text>
        <Text style={styles.headerText}>Curated classics inspired by your recent interests.</Text>
      </View>

      <LinearGradient
        colors={['#bf8a2e', '#000']}
        style={styles.gradientBackground}
      />

      {recommendations.length === 0 ? (
        <View style={{ padding: 24 }}>
            <Text style={homeScreenStyles.emptyText}>No hay recomendaciones por el momento.</Text>
        </View>
      ) : (
        <FlatList
          data={dataToShow} 
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}
            ListHeaderComponent={
              featured ? (
                <TouchableWithoutFeedback onPress={() => navigation.navigate('ListingDetail', { listingId: featured.id, listing: featured })}>
                  <View style={[homeScreenStyles.card, { marginHorizontal: 16, marginBottom: 12 }]}> 
                    {getMainImage(featured.images) ? (
                      <View style={homeScreenStyles.cardImageWrapper}>
                        <Image source={{ uri: getMainImage(featured.images) }} style={homeScreenStyles.cardImage} />
                        <View style={homeScreenStyles.favoriteButton}>
                          <FavoriteButton listingId={featured.id} variant="icon" />
                        </View>
                      </View>
                    ) : (
                      <View style={[homeScreenStyles.cardImage, homeScreenStyles.cardImagePlaceholder]}>
                        <Text style={homeScreenStyles.cardImagePlaceholderText}>Sin foto</Text>
                      </View>
                    )}
                    <View style={homeScreenStyles.cardContent}>
                      <View style={homeScreenStyles.cardHeader}>
                        <Text style={homeScreenStyles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                          {featured.title || `${featured.make || ''} ${featured.model || ''}`}
                        </Text>
                        <Text style={homeScreenStyles.cardPrice}>{featured.price ? `€ ${Number(featured.price).toLocaleString('es-ES')}` : '-'}</Text>
                      </View>
                      <Text style={homeScreenStyles.cardSubtitle}>{featured.year || ''} • {featured.mileage ? `${featured.mileage} km` : '-'} • {featured.fuel_type || '-'}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ) : null
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.6}
            ListFooterComponent={<View style={{ height: 64 }} />}
        />
      )}

    </SafeAreaView>
  )
}
