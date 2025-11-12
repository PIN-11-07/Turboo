import React, { useMemo, useState } from 'react'
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
import { useAuth } from '../../../context/AuthContext'
import { supabase } from '../../../util/supabase'
import { publishScreenStyles } from '../PublishStyles'

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

const REQUIRED_FIELDS = [
  'title',
  'description',
  'price',
  'make',
  'model',
  'year',
  'mileage',
  'fuel_type',
  'transmission',
  'doors',
  'color',
  'location',
]

const createInitialForm = () => ({
  title: '',
  description: '',
  price: '',
  make: '',
  model: '',
  year: '',
  mileage: '',
  fuel_type: '',
  transmission: '',
  doors: '',
  color: '',
  location: '',
})

const sanitizeNumber = (value) => {
  if (value === null || value === undefined) {
    return null
  }

  const normalized = String(value).replace(',', '.').trim()
  const numericValue = normalized ? Number(normalized) : null

  return Number.isFinite(numericValue) ? numericValue : null
}

const sanitizeInteger = (value) => {
  const numericValue = sanitizeNumber(value)
  return Number.isFinite(numericValue) ? Math.round(numericValue) : null
}

export default function PublishScreen() {
  const { user } = useAuth()
  const [form, setForm] = useState(() => createInitialForm())
  const [activePicker, setActivePicker] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const isAuthenticated = Boolean(user?.id)

  const requiredLabels = useMemo(() => ({
    title: 'Titulo',
    description: 'Descripcion',
    price: 'Precio',
    make: 'Marca',
    model: 'Modelo',
    year: 'Anio',
    mileage: 'Kilometraje',
    fuel_type: 'Combustible',
    transmission: 'Transmision',
    doors: 'Puertas',
    color: 'Color',
    location: 'Ubicacion',
  }), [])

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError(null)
    setSuccessMessage(null)
  }

  const togglePicker = (field) => {
    setActivePicker((prev) => (prev === field ? null : field))
    setError(null)
    setSuccessMessage(null)
  }

  const handleOptionSelect = (field, option) => {
    setForm((prev) => ({
      ...prev,
      [field]: option,
    }))
    setActivePicker(null)
  }

  const validateForm = () => {
    const missingFields = REQUIRED_FIELDS.filter((field) => {
      const value = form[field]
      return !(typeof value === 'string' ? value.trim() : value)
    })

    if (missingFields.length > 0) {
      const missingLabels = missingFields.map((field) => requiredLabels[field] || field)
      setError(`Completa los campos obligatorios: ${missingLabels.join(', ')}.`)
      return false
    }

    const priceValue = sanitizeNumber(form.price)
    const yearValue = sanitizeInteger(form.year)
    const mileageValue = sanitizeInteger(form.mileage)
    const doorsValue = sanitizeInteger(form.doors)

    if (priceValue === null) {
      setError('Introduce un precio valido.')
      return false
    }

    if (yearValue === null || yearValue < 1900) {
      setError('Introduce un anio valido.')
      return false
    }

    if (mileageValue === null || mileageValue < 0) {
      setError('Introduce un kilometraje valido.')
      return false
    }

    if (doorsValue === null || doorsValue <= 0) {
      setError('Introduce un numero de puertas valido.')
      return false
    }

    return {
      title: form.title.trim(),
      description: form.description.trim(),
      price: priceValue,
      make: form.make,
      model: form.model.trim(),
      year: yearValue,
      mileage: mileageValue,
      fuel_type: form.fuel_type,
      transmission: form.transmission,
      doors: doorsValue,
      color: form.color.trim(),
      location: form.location.trim(),
    }
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesion para publicar un anuncio.')
      return
    }

    const payload = validateForm()

    if (!payload) {
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { error: insertError } = await supabase.from('listings').insert({
        ...payload,
        user_id: user.id,
        is_active: true,
      })

      if (insertError) {
        throw insertError
      }

      setForm(createInitialForm())
      setSuccessMessage('Anuncio publicado correctamente.')
    } catch (submitError) {
      console.error(submitError)
      setError('No fue posible publicar el anuncio. Intentalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

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
