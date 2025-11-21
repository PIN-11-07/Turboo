import React from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { publishScreenStyles as styles } from './PublishStyles'
import { usePublishScreen } from './usePublishScreen'

const MAKE_OPTIONS = [
  'Alfa Romeo', 'Audi', 'BMW', 'Citroen', 'Cupra', 'Dacia', 'Fiat', 'Ford', 'Hyundai',
  'Jeep', 'Kia', 'Mazda', 'Mercedes-Benz', 'Mini', 'Nissan', 'Opel', 'Peugeot',
  'Renault', 'Seat', 'Skoda', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
]

const FUEL_OPTIONS = [
  'Gasolina', 'Diesel', 'Hibrido', 'Electrico', 'GLP', 'GNC'
]

const TRANSMISSION_OPTIONS = [
  'Manual', 'Automatica', 'Semiautomatica'
]

export default function PublishScreen() {

  const {
    form,
    activePicker,
    submitting,
    error,
    successMessage,
    isAuthenticated,
    handleChange,
    togglePicker,
    handleOptionSelect,
    handleSubmit,
    image,
    setImage,
  } = usePublishScreen()

  // ------ GALERÍA ------
  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need gallery permission.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log("GALLERY RESULT:", result)

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri
      setImage(uri)
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera permission.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log("CAMERA RESULT:", result)

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri
      setImage(uri)
    }
  }

  const renderOptionList = (field, options) => {
    if (activePicker !== field) return null

    return (
      <View style={styles.optionList}>
        <ScrollView nestedScrollEnabled style={styles.optionScroll}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.optionItem}
              onPress={() => handleOptionSelect(field, option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          <Text style={styles.title}>SELL A CAR</Text>

          {/* --- FOTO O BOTONES --- */}
          {image ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.previewImage}
                resizeMode="cover"
              />

              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <Text style={styles.removeImageX}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.photoButton}
                activeOpacity={0.7}
                onPress={takePhoto}
              >
                <Text style={styles.photoButtonPlus}>＋</Text>
                <Text style={styles.photoButtonText}>Take picture</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoButton}
                activeOpacity={0.7}
                onPress={pickImageFromGallery}
              >
                <Text style={styles.photoButtonPlus}>＋</Text>
                <Text style={styles.photoButtonText}>Add from gallery</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.tipText}>
            Professional and good photos will catch buyer’s attention!
            Try to take great pictures from all sides.
          </Text>

          {/* ---- FORM ---- */}

          <Text style={styles.sectionTitle}>Car information</Text>

          {/* TITLE */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Great condition, low mileage..."
            placeholderTextColor="#888"
            value={form.title}
            onChangeText={(t) => handleChange('title', t)}
          />


          {/* BRAND */}
          <Text style={styles.label}>Brand</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => togglePicker('make')}
          >
            <Text style={form.make ? styles.selectorValue : styles.selectorPlaceholder}>
              {form.make || 'Select your brand'}
            </Text>
          </TouchableOpacity>
          {renderOptionList('make', MAKE_OPTIONS)}

          {/* MODEL - AHORA VISIBLE JUSTO DEBAJO DE BRAND */}
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            placeholder="Golf, A3, Fiesta..."
            placeholderTextColor="#888"
            value={form.model}
            onChangeText={(t) => handleChange('model', t)}
          />

          {/* YEAR */}
          <Text style={styles.label}>Year</Text>
          <TextInput
            style={styles.input}
            placeholder="2018"
            placeholderTextColor="#888"
            value={form.year}
            keyboardType="numeric"
            maxLength={4}
            onChangeText={(t) => handleChange('year', t.replace(/[^0-9]/g, ''))}
          />

          {/* PRICE */}
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Price in EUR"
            placeholderTextColor="#888"
            value={form.price}
            keyboardType="numeric"
            onChangeText={(t) => handleChange('price', t)}
          />

          {/* BODY COLOR */}
          <Text style={styles.label}>Body color</Text>
          <TextInput
            style={styles.input}
            placeholder="Black, silver, blue..."
            placeholderTextColor="#888"
            value={form.color}
            onChangeText={(t) => handleChange('color', t)}
          />

          {/* MILEAGE */}
          <Text style={styles.label}>Mileage</Text>
          <TextInput
            style={styles.input}
            placeholder="Mileage in KM"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={form.mileage}
            onChangeText={(t) => handleChange('mileage', t)}
          />

          {/* FUEL TYPE */}
          <Text style={styles.label}>Fuel type</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => togglePicker('fuel_type')}
          >
            <Text style={form.fuel_type ? styles.selectorValue : styles.selectorPlaceholder}>
              {form.fuel_type || 'Select fuel type'}
            </Text>
          </TouchableOpacity>
          {renderOptionList('fuel_type', FUEL_OPTIONS)}

          {/* TRANSMISSION */}
          <Text style={styles.label}>Transmission</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => togglePicker('transmission')}
          >
            <Text style={form.transmission ? styles.selectorValue : styles.selectorPlaceholder}>
              {form.transmission || 'Manual or automatic'}
            </Text>
          </TouchableOpacity>
          {renderOptionList('transmission', TRANSMISSION_OPTIONS)}

          {/* DOORS */}
          <Text style={styles.label}>Doors</Text>
          <TextInput
            style={styles.input}
            placeholder="3 / 5"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={form.doors}
            onChangeText={(t) => handleChange('doors', t)}
          />

          {/* LOCATION */}
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="City or province"
            placeholderTextColor="#888"
            value={form.location}
            onChangeText={(t) => handleChange('location', t)}
          />

          {/* STORY */}
          <Text style={styles.label}>Story</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Tell us about your car"
            placeholderTextColor="#888"
            multiline
            numberOfLines={5}
            value={form.description}
            onChangeText={(t) => handleChange('description', t)}
          />


          {/* TAGS */}
          <TouchableOpacity style={styles.tagsButton}>
            <Text style={styles.tagsText}>Add tags</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* FEEDBACK */}
          {error && (
            <View style={styles.feedbackBoxError}>
              <Text style={styles.feedbackText}>{error}</Text>
            </View>
          )}

          {successMessage && (
            <View style={styles.feedbackBoxSuccess}>
              <Text style={styles.feedbackText}>{successMessage}</Text>
            </View>
          )}

          {/* SUBMIT */}
          <TouchableOpacity
            style={[styles.postButton, submitting && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.postButtonText}>Post your vehicle</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
