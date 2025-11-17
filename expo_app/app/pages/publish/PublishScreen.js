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
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { publishScreenStyles } from './PublishStyles'
import { usePublishScreen } from './usePublishScreen'

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
]

const FUEL_OPTIONS = [
  'Gasolina',
  'Diesel',
  'Hibrido',
  'Electrico',
  'GLP',
  'GNC',
]

const TRANSMISSION_OPTIONS = [
  'Manual',
  'Automatica',
  'Semiautomatica',
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
  } = usePublishScreen()

  const renderOptionList = (field, options) => {
    if (activePicker !== field) {
      return null
    }

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
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Publica tu vehiculo</Text>

          {!isAuthenticated ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Inicia sesion para poder publicar tus anuncios.
              </Text>
            </View>
          ) : null}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Titulo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Introduce un titulo atractivo"
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
              editable={!submitting && isAuthenticated}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Descripcion *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Describe el vehiculo (estado, extras, historial...)"
              value={form.description}
              onChangeText={(text) => handleChange('description', text)}
              editable={!submitting && isAuthenticated}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Precio (€) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 12500"
                value={form.price}
                onChangeText={(text) => handleChange('price', text)}
                keyboardType="numeric"
                editable={!submitting && isAuthenticated}
              />
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.label}>Anio *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 2018"
                value={form.year}
                onChangeText={(text) => handleChange('year', text)}
                keyboardType="numeric"
                editable={!submitting && isAuthenticated}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Kilometraje *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 95000"
                value={form.mileage}
                onChangeText={(text) => handleChange('mileage', text)}
                keyboardType="numeric"
                editable={!submitting && isAuthenticated}
              />
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.label}>Puertas *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. 5"
                value={form.doors}
                onChangeText={(text) => handleChange('doors', text)}
                keyboardType="numeric"
                editable={!submitting && isAuthenticated}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Marca *</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => togglePicker('make')}
              disabled={submitting || !isAuthenticated}
              activeOpacity={0.7}
            >
              <Text style={form.make ? styles.selectorValue : styles.selectorPlaceholder}>
                {form.make || 'Selecciona una marca'}
              </Text>
            </TouchableOpacity>
            {renderOptionList('make', MAKE_OPTIONS)}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Modelo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Golf, 500, Fiesta..."
              value={form.model}
              onChangeText={(text) => handleChange('model', text)}
              editable={!submitting && isAuthenticated}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Combustible *</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => togglePicker('fuel_type')}
              disabled={submitting || !isAuthenticated}
              activeOpacity={0.7}
            >
              <Text style={form.fuel_type ? styles.selectorValue : styles.selectorPlaceholder}>
                {form.fuel_type || 'Selecciona un tipo de combustible'}
              </Text>
            </TouchableOpacity>
            {renderOptionList('fuel_type', FUEL_OPTIONS)}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Transmision *</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => togglePicker('transmission')}
              disabled={submitting || !isAuthenticated}
              activeOpacity={0.7}
            >
              <Text
                style={form.transmission ? styles.selectorValue : styles.selectorPlaceholder}
              >
                {form.transmission || 'Selecciona una transmision'}
              </Text>
            </TouchableOpacity>
            {renderOptionList('transmission', TRANSMISSION_OPTIONS)}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Color *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Azul metalizado"
              value={form.color}
              onChangeText={(text) => handleChange('color', text)}
              editable={!submitting && isAuthenticated}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Ubicacion *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ciudad o provincia"
              value={form.location}
              onChangeText={(text) => handleChange('location', text)}
              editable={!submitting && isAuthenticated}
            />
          </View>

          {error ? (
            <View style={styles.feedbackBoxError}>
              <Text style={styles.feedbackText}>{error}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.feedbackBoxSuccess}>
              <Text style={styles.feedbackText}>{successMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.submitButton, (!isAuthenticated || submitting) && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={!isAuthenticated || submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Publicar anuncio</Text>
            )}
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = publishScreenStyles
