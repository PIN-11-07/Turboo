import React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { purchaseScreenStyles as styles } from './PurchaseStyles'
import { usePurchaseScreen } from './usePurchaseScreen'
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

const PLACEHOLDER_COLOR = palette.textMuted
const ACCENT_TEXT_COLOR = '#1E1E1E'

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
  } = usePurchaseScreen()

  const renderSummary = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {listing?.title || 'Vehículo'}
        </Text>
        <Text style={styles.cardPrice}>{formatCurrency(totals.price)}</Text>
      </View>
      <Text style={styles.cardSubtitle}>
        Vendido por {sellerProfile?.full_name || 'Vendedor no disponible'}
      </Text>
    </View>
  )

  const renderTotals = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Resumen de pago</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Precio del anuncio</Text>
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
      <View style={[styles.row, styles.rowSpacing]}>
        <Text style={styles.label}>Tu saldo disponible</Text>
        <Text style={styles.value}>
          {buyerBalance != null ? formatCurrency(buyerBalance) : 'Inicia sesión'}
        </Text>
      </View>
      {buyerBalance != null && (
        <View style={styles.row}>
          <Text style={styles.label}>Saldo tras la compra</Text>
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
          <Text style={styles.sectionTitle}>Pago con saldo</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>No necesitas tarjeta</Text>
            <Text style={styles.infoText}>
              Tu saldo cubre el total del vehículo. Confirmando usaremos el saldo disponible sin
              pedir datos de tarjeta.
            </Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Método de pago</Text>

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
                <Text style={styles.cardExpiry}>Expira {card.expiry}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => navigation.navigate('AddCard', { onSave: addNewCard })}
          activeOpacity={0.8}
        >
          <Text style={styles.addCardText}>+ Agregar nueva tarjeta</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderControls = () => (
    <>
      <TouchableOpacity
        style={[styles.primaryButton, (!canSubmit || isOwner) && styles.buttonDisabled]}
        onPress={handleConfirmPurchase}
        disabled={!canSubmit || isOwner}
        activeOpacity={0.8}
      >
        {submitting ? (
          <ActivityIndicator color={ACCENT_TEXT_COLOR} />
        ) : (
          <Text style={styles.primaryButtonText}>
            {isOwner ? 'Este es tu anuncio' : 'Confirmar compra'}
          </Text>
        )}
      </TouchableOpacity>
      {disableReason ? (
        <Text style={styles.disabledHint}>{disableReason}</Text>
      ) : null}
      <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack} activeOpacity={0.8}>
        <Text style={styles.secondaryButtonText}>Volver al detalle</Text>
      </TouchableOpacity>
    </>
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Pago con saldo</Text>
        <Text style={styles.subtitle}>
          Usa tu saldo de Turboo para pagar y enviaremos el importe al vendedor descontando la
          comisión.
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
            <Text style={styles.emptyText}>No encontramos el anuncio que quieres comprar.</Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack}>
              <Text style={styles.secondaryButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
