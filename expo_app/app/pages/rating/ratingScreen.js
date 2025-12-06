import React, { useCallback } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { ratingStyles as styles } from './ratingStyles'
import { useRating } from './useRating'

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
    navigateHome,
    resetRating,
    isSellerMissing,
  } = useRating()

  const handleSubmit = useCallback(async () => {
    const success = await submitRating()
    if (!success) {
      return
    }

    resetRating()
    navigateHome()
  }, [submitRating, navigateHome, resetRating])

  const handleSkip = useCallback(() => {
    resetRating()
    navigateHome()
  }, [navigateHome, resetRating])

  if (isSellerMissing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.topContent}>
            <Text style={styles.title}>Rate your experience</Text>
            <Text style={styles.subtitle}>
              We could not load the seller information. Return and try again.
            </Text>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
              <Text style={styles.secondaryText}>Back to feed</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.topContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Rate your experience</Text>
            <Text style={styles.subtitle}>
              {`How was your experience with ${sellerName || 'this seller'}?`}
            </Text>
          </View>

          <View style={styles.vehicleBox}>
            <Text style={styles.vehicleLabel}>Vehicle acquired</Text>
            <Text style={styles.vehicleValue}>{formattedTitle}</Text>
          </View>

          <View style={styles.ratingSection}>
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
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Your rating helps other buyers make informed decisions and keeps the community safe.
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.primaryButton, submitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.primaryText}>
              {submitting ? 'Sending…' : 'Send rating and return to feed'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, submitting && styles.buttonDisabled]}
            onPress={handleSkip}
            disabled={submitting}
          >
            <Text style={styles.secondaryText}>Skip and go to feed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
