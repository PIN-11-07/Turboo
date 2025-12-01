import React, { useCallback } from 'react'
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ratingStyles as styles } from './ratingStyles'
import { useRatingScreen } from './useRatingScreen'

const STAR_SET = [1, 2, 3, 4, 5]

export default function RatingScreen() {
  const {
    sellerId,
    sellerName,
    formattedTitle,
    selectedRating,
    setSelectedRating,
    submitting,
    error,
    submitRating,
    closeScreen,
    navigateHome,
    resetRating,
    isSellerMissing,
  } = useRatingScreen()

  const handleSubmit = useCallback(async () => {
    const success = await submitRating()
    if (!success) return

    Alert.alert('Thanks!', 'Your rating was submitted successfully.', [
      { text: 'OK', onPress: () => (resetRating(), navigateHome()) },
    ])
  }, [submitRating, navigateHome, resetRating])

  if (isSellerMissing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <Text style={styles.title}>Rate your experience</Text>
          <Text style={styles.subtitle}>
            We could not load the seller information. Return and try again.
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={closeScreen}>
            <Text style={styles.secondaryText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.close} onPress={closeScreen} disabled={submitting}>
          <Ionicons name="close" size={20} color="#C58A1A" />
        </TouchableOpacity>

        <Text style={styles.title}>Rate your experience</Text>
        <Text style={styles.subtitle}>
          {`How was your experience with ${sellerName || 'this seller'}?`}
        </Text>

        <View style={styles.vehicleBox}>
          <Text style={styles.vehicleLabel}>Vehicle acquired</Text>
          <Text style={styles.vehicleValue}>{formattedTitle}</Text>
        </View>

        <Text style={styles.prompt}>Select your score</Text>
        <View style={styles.starsRow}>
          {STAR_SET.map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setSelectedRating(star)}
              disabled={submitting}
            >
              <Ionicons
                name={star <= selectedRating ? 'star' : 'star-outline'}
                size={40}
                color={star <= selectedRating ? '#C58A1A' : '#4C4C4C'}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Your rating helps other buyers make informed decisions and keeps the community safe.
          </Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.primaryButton, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.primaryText}>{submitting ? 'Sending…' : 'Send rating'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}