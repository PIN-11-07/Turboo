import React, { useMemo } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { purchaseScreenStyles as styles } from './PurchaseStyles'

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
    return 'Vehículo'
  }, [listing?.title])

  const handleChatPress = () =>
    Alert.alert('Chat', 'La chat con el vendedor llegará pronto. 👋')

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
      Alert.alert('Sin vendedor', 'No pudimos encontrar al vendedor.')
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
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.loader}>
          <Text style={styles.errorText}>
            No encontramos los datos de la compra. Vuelve al listado para intentarlo de nuevo.
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleBackHome}>
            <Text style={styles.secondaryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.confirmationHeader}>
          <Text style={styles.confirmationIcon}>✅</Text>
          <Text style={styles.confirmationTitle}>Compra completada</Text>
          <Text style={styles.confirmationSubtitle}>
            El importe se envió al vendedor y hemos aplicado la comisión de plataforma.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalles del vehículo</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Título</Text>
            <Text style={styles.value}>{title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Precio</Text>
            <Text style={styles.value}>{formatCurrency(totals.price)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vendedor</Text>
            <Text style={styles.value}>{sellerName || 'Vendedor'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen del pago</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Precio</Text>
            <Text style={styles.value}>{formatCurrency(totals.price)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Comisión (5%)</Text>
            <Text style={styles.value}>-{formatCurrency(totals.fee)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Recibe el vendedor</Text>
            <Text style={styles.value}>{formatCurrency(totals.sellerReceives)}</Text>
          </View>
          {buyerBalance != null && (
            <View style={[styles.row, styles.rowSpacing]}>
              <Text style={styles.label}>Tu saldo restante</Text>
              <Text style={styles.value}>{formatCurrency(buyerBalance)}</Text>
            </View>
          )}
          {sellerBalance != null && (
            <View style={styles.row}>
              <Text style={styles.label}>Saldo del vendedor</Text>
              <Text style={styles.value}>{formatCurrency(sellerBalance)}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRateSeller}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Valorar al vendedor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBackHome}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
