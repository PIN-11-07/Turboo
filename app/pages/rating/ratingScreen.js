import React, { useCallback } from 'react'
import { ScrollView, Text, TouchableOpacity, View, StatusBar, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { ratingStyles as styles } from './ratingStyles'
import { useRating } from './useRating'
import { palette } from '../../theme/palette'

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
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>RATE SELLER</Text>
          <View style={styles.iconButton} />
        </View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.topContent}>
            <Text style={styles.title}>Rate your experience</Text>
            <Text style={styles.subtitle}>
              We could not load the seller information. Return and try again.
            </Text>
          </View>
          <View style={styles.buttonGroup}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed
              ]}
              onPress={handleSkip}
            >
              {({ pressed }) => (
                <Text style={[styles.primaryButtonText, pressed && styles.primaryButtonTextPressed]}>Back to feed</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RATE SELLER</Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.topContent}>
          <View style={styles.titleSection}>
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
                    color={star <= selectedRating ? palette.mustard : palette.champagne}
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

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              (pressed || submitting) && styles.primaryButtonPressed,
              submitting && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {({ pressed }) => (
              <Text style={[(pressed || submitting) && styles.primaryButtonTextPressed, styles.primaryButtonText]}>
                {submitting ? 'Sending…' : 'Submit rating'}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
