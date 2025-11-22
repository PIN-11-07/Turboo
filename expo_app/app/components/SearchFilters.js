import React from 'react'
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { palette } from '../theme/palette'
import { formatPrice } from '../utils/format'

const { width } = Dimensions.get('window')

/**
 * SearchFilters component provides a comprehensive filtering interface
 * @param {Object} props
 * @param {Boolean} props.visible - Whether the filter panel is visible
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.setFilters - Function to update filters
 * @param {Object} props.priceRange - Min/max price range from data
 * @param {Object} props.yearRange - Min/max year range from data
 * @param {Array} props.makeOptions - Available make options
 * @param {Array} props.colorOptions - Available color options
 * @param {Array} props.fuelTypeOptions - Available fuel type options
 * @param {Array} props.transmissionOptions - Available transmission options
 * @param {Function} props.onApply - Callback when applying filters
 * @param {Function} props.onClear - Callback when clearing filters
 */
const SearchFilters = ({
  visible,
  filters,
  setFilters,
  priceRange,
  yearRange,
  makeOptions,
  colorOptions,
  fuelTypeOptions,
  transmissionOptions,
  onApply,
  onClear,
}) => {
  const insets = useSafeAreaInsets()

  if (!visible) {
    return null
  }

  const handlePriceChange = ([min, max]) => {
    setFilters(f => ({
      ...f,
      priceMin: Math.min(min, max),
      priceMax: Math.max(min, max)
    }))
  }

  const handleYearChange = ([min, max]) => {
    setFilters(f => ({
      ...f,
      yearMin: Math.round(Math.min(min, max)),
      yearMax: Math.round(Math.max(min, max))
    }))
  }

  const handleMakeToggle = (make) => {
    setFilters(f => {
      const currentMakes = Array.isArray(f.make) ? [...f.make] : []
      const index = currentMakes.indexOf(make)
      
      if (index >= 0) {
        currentMakes.splice(index, 1)
      } else {
        currentMakes.push(make)
      }
      
      return { ...f, make: currentMakes }
    })
  }

  const handleMultiSelect = (key, value) => {
    setFilters(f => {
      const currentArray = Array.isArray(f[key]) ? [...f[key]] : []
      const index = currentArray.indexOf(value)
      
      if (index >= 0) {
        currentArray.splice(index, 1)
      } else {
        currentArray.push(value)
      }
      
      return { ...f, [key]: currentArray }
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtros</Text>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Precio: {formatPrice(filters.priceMin)} - {formatPrice(filters.priceMax)}
          </Text>
          <View style={styles.sliderContainer}>
            <MultiSlider
              values={[filters.priceMin, filters.priceMax]}
              min={priceRange.min}
              max={priceRange.max}
              step={5000}
              sliderLength={width - 110}
              containerStyle={styles.multiSliderContainer}
              trackStyle={styles.sliderTrack}
              onValuesChange={handlePriceChange}
              selectedStyle={styles.sliderSelected}
              unselectedStyle={styles.sliderUnselected}
              markerStyle={styles.sliderMarker}
            />
          </View>
        </View>

        {/* Year Range */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Año: {filters.yearMin} - {filters.yearMax}
          </Text>
          <View style={styles.sliderContainer}>
            <MultiSlider
              values={[filters.yearMin, filters.yearMax]}
              min={yearRange.min}
              max={yearRange.max}
              step={1}
              sliderLength={width - 110}
              containerStyle={styles.multiSliderContainer}
              trackStyle={styles.sliderTrack}
              onValuesChange={handleYearChange}
              selectedStyle={styles.sliderSelected}
              unselectedStyle={styles.sliderUnselected}
              markerStyle={styles.sliderMarker}
            />
          </View>
        </View>

        {/* Make (Brand) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Marca</Text>
          <View style={styles.chipContainer}>
            {makeOptions.map(make => {
              const isSelected = Array.isArray(filters.make) && filters.make.includes(make)
              return (
                <TouchableOpacity
                  key={make}
                  onPress={() => handleMakeToggle(make)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {make}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Color */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Color (selección múltiple)</Text>
          <View style={styles.chipContainer}>
            {colorOptions.map(color => {
              const isSelected = Array.isArray(filters.color) && filters.color.includes(color)
              return (
                <TouchableOpacity
                  key={color}
                  onPress={() => handleMultiSelect('color', color)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {color}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Fuel Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Combustible (selección múltiple)</Text>
          <View style={styles.chipContainer}>
            {fuelTypeOptions.map(fuel => {
              const isSelected = Array.isArray(filters.fuelType) && filters.fuelType.includes(fuel)
              return (
                <TouchableOpacity
                  key={fuel}
                  onPress={() => handleMultiSelect('fuelType', fuel)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {fuel}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Transmission */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Transmisión (selección múltiple)</Text>
          <View style={styles.chipContainer}>
            {transmissionOptions.map(transmission => {
              const isSelected = Array.isArray(filters.transmission) && filters.transmission.includes(transmission)
              return (
                <TouchableOpacity
                  key={transmission}
                  onPress={() => handleMultiSelect('transmission', transmission)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {transmission}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Mileage */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Kilometraje máximo</Text>
          <TextInput
            value={filters.mileageMax?.toString()}
            onChangeText={value => setFilters(f => ({ ...f, mileageMax: value }))}
            keyboardType="numeric"
            placeholder="150000"
            placeholderTextColor={palette.textMuted}
            style={styles.textInput}
          />
        </View>
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={onApply}
          style={[styles.button, styles.applyButton]}
        >
          <Text style={styles.applyButtonText}>Aplicar filtros</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onClear}
          style={[styles.button, styles.clearButton]}
        >
          <Text style={styles.clearButtonText}>Borrar filtros</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = {
  container: {
    backgroundColor: palette.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flex: 1,
  },
  title: {
    color: palette.text,
    fontWeight: '600',
    marginBottom: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: palette.textMuted,
    fontSize: 12,
    marginBottom: 8,
  },
  sliderContainer: {
    paddingHorizontal: 30,
    overflow: 'hidden',
  },
  multiSliderContainer: {
    alignSelf: 'center',
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
  },
  sliderSelected: {
    backgroundColor: palette.accent,
  },
  sliderUnselected: {
    backgroundColor: palette.border,
  },
  sliderMarker: {
    backgroundColor: palette.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  chip: {
    backgroundColor: palette.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: palette.accent,
  },
  chipText: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  chipTextSelected: {
    color: palette.background,
  },
  textInput: {
    backgroundColor: palette.background,
    color: palette.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: palette.accent,
    marginRight: 8,
  },
  clearButton: {
    backgroundColor: palette.border,
  },
  applyButtonText: {
    color: palette.background,
    fontWeight: '600',
  },
  clearButtonText: {
    color: palette.text,
    fontWeight: '600',
  },
}

export default SearchFilters