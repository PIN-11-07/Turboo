import React, { useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { palette } from '../../theme/palette'
import FavoriteButton from '../../components/FavoriteButton'
import { styles } from "./RecommendationsStyles"
import { LinearGradient } from 'expo-linear-gradient'
import { useRecommendations } from './useRecommendations'
import { formatPrice } from '../../utils/format'

const getMainImage = (images) => (Array.isArray(images) && images.length > 0 ? images[0] : null)

export default function RecommendationsScreen() {
  const navigation = useNavigation()
  const {
    recommendations,
    featured,
    visibleItems,
    onEndReached,
  } = useRecommendations()

  const renderItem = useCallback(
    ({ item, index }) => {
      const mainImage = getMainImage(item.images)
      const title = (item.title || `${item.make ?? ''} ${item.model ?? ''}`.trim()).trim() || 'Vehicle'
      return (
        <TouchableOpacity
          style={[
            styles.cardCarouselItem,
            index === 0 && styles.firstCard,
            { marginBottom: 12 },
          ]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ListingDetail', { listingId: item.id, listing: item })}
        >
          {mainImage ? (
            <View style={styles.cardImageWrapper}>
              <Image source={{ uri: mainImage }} style={[styles.cardImage, { height: 220 }]} />
            </View>
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <Text style={styles.cardImagePlaceholderText}>Sin foto</Text>
            </View>
          )}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.cardPriceRow}>
              <FavoriteButton listingId={item.id} variant="list" style={styles.favoriteHeartButton} />
              <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    },
    [navigation]
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.heroTitleMain}>Selected</Text>
        <Text style={styles.heroTitleSub}>for you</Text>
        <Text style={styles.headerText}>Curated classics inspired by your recent interests.</Text>
      </View>

      <LinearGradient
        colors={['#c68515ff', '#000']}
        style={styles.gradientBackground}
      />

      {recommendations.length === 0 ? (
        <View style={{ padding: 24 }}>
          <Text style={styles.emptyText}>There are no recommendations at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={visibleItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}
          ListHeaderComponent={
            featured ? (
              <TouchableWithoutFeedback onPress={() => navigation.navigate('ListingDetail', { listingId: featured.id, listing: featured })}>
                <View style={[styles.cardCarouselItem, { marginHorizontal: 16, marginBottom: 12 }]}>
                  {getMainImage(featured.images) ? (
                    <View style={styles.cardImageWrapper}>
                      <Image source={{ uri: getMainImage(featured.images) }} style={styles.cardImage} />
                    </View>
                  ) : (
                    <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                      <Text style={styles.cardImagePlaceholderText}>Sin foto</Text>
                    </View>
                  )}
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {featured.title || `${featured.make || ''} ${featured.model || ''}`}
                      </Text>
                      <View style={styles.cardPriceRow}>
                        <FavoriteButton listingId={featured.id} variant="list" style={styles.favoriteHeartButton} />
                        <Text style={styles.cardPrice}>{formatPrice(featured.price)}</Text>
                      </View>
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
