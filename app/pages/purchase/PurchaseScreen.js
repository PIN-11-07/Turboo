import React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { purchaseScreenStyles as styles } from './PurchaseStyles'
import { usePurchase } from './usePurchase'
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

const PLACEHOLDER_COLOR = palette.champagne
const ACCENT_TEXT_COLOR = palette.darkGrey

export default function PurchaseScreen() {
  const {
    listing,
    sellerProfile,
    buyerBalance,
    loading,
    submitting,
    error,
    successMessage,
    cardData,
    totals,
    canSubmit,
    isOwner,
    setCardField,
    handleConfirmPurchase,
    handleGoBack,
    disableReason,
    payingWithBalanceOnly,
    savedCards,
    selectedCardId,
    setSelectedCardId,
    addNewCard,
  } = usePurchase()

  const renderSummary = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {listing?.title || 'Vehicle'}
        </Text>
        <Text style={styles.cardPrice}>{formatCurrency(totals.price)}</Text>
      </View>
      <Text style={styles.cardSubtitle}>
        Sold by {sellerProfile?.full_name || 'Seller not available'}
      </Text>
    </View>
  )

  const renderTotals = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Payment Summary</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Listing price</Text>
        <Text style={styles.value}>{formatCurrency(totals.price)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Commission (5%)</Text>
        <Text style={styles.value}>-{formatCurrency(totals.fee)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Seller receives</Text>
        <Text style={styles.value}>{formatCurrency(totals.sellerReceives)}</Text>
      </View>
      <View style={[styles.row, styles.rowSpacing]}>
        <Text style={styles.label}>Your available balance</Text>
        <Text style={styles.value}>
          {buyerBalance != null ? formatCurrency(buyerBalance) : 'Log in'}
        </Text>
      </View>
      {buyerBalance != null && (
        <View style={styles.row}>
          <Text style={styles.label}>Balance after purchase</Text>
          <Text style={styles.value}>{formatCurrency(totals.nextBuyerBalance)}</Text>
        </View>
      )}
    </View>
  )

  const { useNavigation } = require('@react-navigation/native')
  const navigation = useNavigation()

  const renderCardForm = () => {
    if (payingWithBalanceOnly) {
      return (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Balance Payment</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>No card needed</Text>
            <Text style={styles.infoText}>
              Your balance covers the total cost of the vehicle. By confirming, we'll use your available balance without requesting card details.
            </Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        {savedCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.paymentOption,
              selectedCardId === card.id && styles.paymentOptionSelected
            ]}
            onPress={() => setSelectedCardId(card.id)}
            activeOpacity={0.8}
          >
            <View style={styles.paymentOptionLeft}>
              <View style={[
                styles.radioButton,
                selectedCardId === card.id && styles.radioButtonSelected
              ]}>
                {selectedCardId === card.id && <View style={styles.radioButtonInner} />}
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardBrand}>{card.brand} •••• {card.last4}</Text>
                <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => navigation.navigate('AddCard', { onSave: addNewCard })}
          activeOpacity={0.8}
        >
          <Text style={styles.addCardText}>+ Add new card</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderControls = () => (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.primaryButtonPressed,
          (!canSubmit || isOwner) && styles.buttonDisabled
        ]}
        onPress={handleConfirmPurchase}
        disabled={!canSubmit || isOwner}
      >
        {({ pressed }) => (
          submitting ? (
            <ActivityIndicator color={ACCENT_TEXT_COLOR} />
          ) : (
            <Text style={[styles.primaryButtonText, pressed && styles.primaryButtonTextPressed]}>
              {isOwner ? 'This is your listing' : 'Confirm purchase'}
            </Text>
          )
        )}
      </Pressable>
      {disableReason ? (
        <Text style={styles.disabledHint}>{disableReason}</Text>
      ) : null}
    </>
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONFIRM PURCHASE</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Balance Payment</Text>
        <Text style={styles.subtitle}>
          Use your Turboo balance to pay and we'll send the amount to the seller after deducting the commission.
        </Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {successMessage && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={ACCENT_TEXT_COLOR} />
          </View>
        ) : listing ? (
          <>
            {renderSummary()}
            {renderTotals()}
            {renderCardForm()}
            {renderControls()}
          </>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>We couldn't find the listing you want to purchase.</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack}>
              <Text style={styles.secondaryButtonText}>Go back</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
