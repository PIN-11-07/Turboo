import React from 'react';
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
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { publishScreenStyles as styles } from './PublishStyles';
import { usePublishScreen } from './usePublishScreen';
import ImageAnalysisButton from '../../components/ImageAnalisisButton';

const MAKE_OPTIONS = [
  'Alfa Romeo',
  'Audi',
  'BMW',
  'Citroen',
  'Cupra',
  'Dacia',
  'Fiat',
  'Ford',
  'Hyundai',
  'Jeep',
  'Kia',
  'Mazda',
  'Mercedes-Benz',
  'Mini',
  'Nissan',
  'Opel',
  'Peugeot',
  'Renault',
  'Seat',
  'Skoda',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
];

const FUEL_OPTIONS = ['Gasolina', 'Diesel', 'Hibrido', 'Electrico', 'GLP', 'GNC'];

const TRANSMISSION_OPTIONS = ['Manual', 'Automatica', 'Semiautomatica'];

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
    handleSaveDraft,
    submittingAction,
    image,
    setImage,
  } = usePublishScreen();

  const handleAnalysisComplete = (data) => {
    handleChange('make', data.make || '');
    handleChange('model', data.model || '');
    handleChange('year', data.year ? String(data.year).replace(/[^0-9]/g, '') : '');
    handleChange('color', data.color || '');
    if (data.body_type) handleChange('body_type', data.body_type);
    if (data.condition) handleChange('condition', data.condition);
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need gallery permission.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImage(uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera permission.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImage(uri);
    }
  };

  const renderOptionList = (field, options) => {
    if (activePicker !== field) return null;

    return (
      <View style={styles.optionList}>
        <ScrollView nestedScrollEnabled style={styles.optionScroll}>
          {options.map((option) => (
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
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
         <Text style={styles.sellCarTitle}>
  SELL A CAR
</Text>

          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />

              <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
                <Text style={styles.removeImageX}>X</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.photoButton}
                activeOpacity={0.7}
                onPress={takePhoto}
              >
                <Text style={styles.photoButtonPlus}>+</Text>
                <Text style={styles.photoButtonText}>Take picture</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoButton}
                activeOpacity={0.7}
                onPress={pickImageFromGallery}
              >
                <Text style={styles.photoButtonPlus}>+</Text>
                <Text style={styles.photoButtonText}>Add from gallery</Text>
              </TouchableOpacity>
            </>
          )}

          <ImageAnalysisButton
            style={{ width: '100%' }}
            imageUri={image}
            onAnalysisComplete={handleAnalysisComplete}
            onDescriptionGenerated={(text) => handleChange('description', text)}
          />

          <Text style={styles.tipText}>
            Professional and good photos will catch buyer's attention! Try to take great pictures from
            all sides.
          </Text>

         <Text style={{ fontFamily: 'serif', fontSize: 24, color: '#fff' }}>
            Car information
          </Text>



          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Select your title"
            placeholderTextColor={styles.placeholder.color}
            value={form.title}
            onChangeText={(t) => handleChange('title', t)}
          />

          <Text style={styles.label}>Brand</Text>
          <TouchableOpacity style={styles.selector} onPress={() => togglePicker('make')}>
            <Text style={styles.selectorValue}>
              {form.make || 'Select your brand'}
            </Text>
          </TouchableOpacity>
          {renderOptionList('make', MAKE_OPTIONS)}

          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            placeholder="Select your model"
            placeholderTextColor={styles.placeholder.color}
            value={form.model}
            onChangeText={(t) => handleChange('model', t)}
          />

          <Text style={styles.label}>Year</Text>
          <TextInput
            style={styles.input}
            placeholder="Select year of production"
            placeholderTextColor={styles.placeholder.color}
            value={form.year}
            keyboardType="numeric"
            maxLength={4}
            onChangeText={(t) => handleChange('year', t.replace(/[^0-9]/g, ''))}
          />

          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Price in EUR"
            placeholderTextColor={styles.placeholder.color}
            value={form.price}
            keyboardType="numeric"
            onChangeText={(t) => handleChange('price', t)}
          />

          <Text style={styles.label}>Body color</Text>
          <TextInput
            style={styles.input}
            placeholder="Select your color"
            placeholderTextColor={styles.placeholder.color}
            value={form.color}
            onChangeText={(t) => handleChange('color', t)}
          />

          <Text style={styles.label}>Mileage</Text>
          <TextInput
            style={styles.input}
            placeholder="Mileage in KM"
            placeholderTextColor={styles.placeholder.color}
            keyboardType="numeric"
            value={form.mileage}
            onChangeText={(t) => handleChange('mileage', t)}
          />

          <Text style={styles.label}>Fuel type</Text>
          <TouchableOpacity style={styles.selector} onPress={() => togglePicker('fuel_type')}>
            <Text style={styles.selectorValue}>
              {form.fuel_type || 'Select fuel type'}
            </Text>
          </TouchableOpacity>
          {renderOptionList('fuel_type', FUEL_OPTIONS)}

          <Text style={styles.label}>Transmission</Text>
          <TouchableOpacity style={styles.selector} onPress={() => togglePicker('transmission')}>
            <Text style={styles.selectorValue}>
              {form.transmission || 'Select transmission type'}
            </Text>
          </TouchableOpacity>
          {renderOptionList('transmission', TRANSMISSION_OPTIONS)}

          <Text style={styles.label}>Doors</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of doors"
            placeholderTextColor={styles.placeholder.color}
            keyboardType="numeric"
            value={form.doors}
            onChangeText={(t) => handleChange('doors', t)}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Where is your car located?"
            placeholderTextColor={styles.placeholder.color}
            value={form.location}
            onChangeText={(t) => handleChange('location', t)}
          />

          <Text style={styles.label}>Story</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Tell us about your car"
            placeholderTextColor={styles.placeholder.color}
            multiline
            numberOfLines={5}
            value={form.description}
            onChangeText={(t) => handleChange('description', t)}
          />

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

          <TouchableOpacity
            style={[styles.draftButton, submitting && styles.submitDisabled]}
            onPress={handleSaveDraft}
            disabled={submitting}
          >
            {submitting && submittingAction === 'draft' ? (
              <ActivityIndicator color="#C58A1A" />
            ) : (
              <Text style={styles.draftButtonText}>Save draft</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
