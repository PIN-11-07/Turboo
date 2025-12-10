import React, { useMemo } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View, StatusBar, Pressable } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { purchaseScreenStyles as styles } from './PurchaseStyles'
import { palette } from '../../theme/palette'

const formatCurrency = (value) => {
  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return '€ 0,00'
}

export default function PurchaseConfirmationScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { listing, sellerName, totals, buyerBalance, sellerBalance } = route.params ?? {}

  const title = useMemo(() => {
    if (typeof listing?.title === 'string' && listing.title.trim()) {
      return listing.title
    }
    return 'Vehicle'
  }, [listing?.title])

  const handleChatPress = () =>
    Alert.alert('Chat', 'Chat with the seller coming soon. 👋')

  const handleBackHome = () => {
    const params = {
      refreshAfterPurchase: true,
      purchasedListingId: listing?.id,
    }
    // Enforce going to Home tab and request refresh/removal
    navigation.navigate('Home', {
      screen: 'HomeMain',
      params,
    })
  }

  const handleRateSeller = () => {
    if (!listing?.user_id) {
      Alert.alert('No seller', 'We could not find the seller.')
      return
    }

    navigation.navigate('RatingScreen', {
      sellerId: listing.user_id,
      sellerName,
      listingTitle: title,
    })
  }

  if (!listing || !totals) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <View style={styles.header}>
          <View style={styles.iconButton} />
          <Text style={styles.headerTitle}>PURCHASE COMPLETE</Text>
          <View style={styles.iconButton} />
        </View>
        <View style={styles.loader}>
          <Text style={styles.errorText}>
            We couldn't find the purchase data. Go back to the listing to try again.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed
            ]}
            onPress={handleBackHome}
          >
            {({ pressed }) => (
              <Text style={[styles.primaryButtonText, pressed && styles.primaryButtonTextPressed]}>Go back</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.confirmationSafeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.confirmationBackButton}
        onPress={handleBackHome}
      >
        <Ionicons name="chevron-back" size={32} color={palette.white} />
      </TouchableOpacity>

      {/* Header Title */}
      <View style={styles.confirmationHeaderTitle}>
        <Text style={styles.confirmationBrandTitle}>REVVOL</Text>
      </View>

      <ScrollView contentContainerStyle={styles.confirmationScrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.confirmationSuccessIcon}>
          <View style={styles.confirmationCircleOuter}>
            <View style={styles.confirmationCircleInner}>
              <Ionicons name="arrow-forward" size={42} color={palette.darkGrey} />
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.confirmationMainTitle}>Transaction confirmed!</Text>
        <Text style={styles.confirmationMainSubtitle}>
          Your order has been{'\n'}successfully processed
        </Text>

        {/* Vehicle Info Card */}
        <View style={styles.confirmationVehicleCard}>
          <View style={styles.confirmationVehicleRow}>
            <View style={styles.confirmationVehicleColumnLeft}>
              <Text style={styles.confirmationVehicleLabel}>Vehicle bought</Text>
              <Text style={styles.confirmationVehicleValue}>{title}</Text>
            </View>
            <View style={styles.confirmationVehicleColumnRight}>
              <Text style={styles.confirmationVehicleLabel}>Year</Text>
              <Text style={styles.confirmationVehicleValue}>{listing?.year || '-'}</Text>
            </View>
          </View>
          <View style={[styles.confirmationVehicleRow, { marginTop: 20 }]}>
            <View style={styles.confirmationVehicleColumnLeft}>
              <Text style={styles.confirmationVehicleLabel}>Price</Text>
              <Text style={styles.confirmationVehicleValue}>{formatCurrency(totals.price)}</Text>
            </View>
            <View style={styles.confirmationVehicleColumnRight}>
              <Text style={styles.confirmationVehicleLabel}>Seller</Text>
              <Text style={styles.confirmationVehicleValue}>{sellerName || 'Seller'}</Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.confirmationPaymentDetails}>
          <View style={styles.confirmationPaymentRow}>
            <Text style={styles.confirmationPaymentLabel}>Price</Text>
            <Text style={styles.confirmationPaymentValue}>{formatCurrency(totals.price)}</Text>
          </View>
          <View style={styles.confirmationPaymentRow}>
            <Text style={styles.confirmationPaymentLabel}>Commission (5%)</Text>
            <Text style={styles.confirmationPaymentValue}>-{formatCurrency(totals.fee)}</Text>
          </View>
          <View style={styles.confirmationPaymentDivider} />
          <View style={styles.confirmationPaymentRow}>
            <Text style={styles.confirmationPaymentLabel}>Seller receives</Text>
            <Text style={styles.confirmationPaymentValue}>{formatCurrency(totals.sellerReceives)}</Text>
          </View>
          {buyerBalance != null && (
            <View style={[styles.confirmationPaymentRow, { marginTop: 8 }]}>
              <Text style={styles.confirmationPaymentLabel}>Your remaining balance</Text>
              <Text style={styles.confirmationPaymentValue}>{formatCurrency(buyerBalance)}</Text>
            </View>
          )}
        </View>
        
        {/* Additional Info */}
        <Text style={styles.confirmationInfoText}>
          We will send the confirmation{'\n'}to your email.
        </Text>

        {/* Rate Seller Button */}
        <Pressable
          style={({ pressed }) => [
            styles.confirmationRateButton,
            pressed && styles.confirmationRateButtonPressed
          ]}
          onPress={handleRateSeller}
        >
          {({ pressed }) => (
            <Text style={[styles.confirmationRateButtonText, pressed && styles.confirmationRateButtonTextPressed]}>
              Rate the seller
            </Text>
          )}
        </Pressable>

        
      </ScrollView>
    </SafeAreaView>
  )
}
