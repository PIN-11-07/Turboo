import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { palette } from '../theme/palette'
import { formatPrice } from '../utils/format'

/**
 * ActiveFiltersChips component displays the currently active filters as removable chips
 * @param {Object} props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onRemoveFilter - Callback when removing a specific filter
 * @param {Function} props.onClearAll - Callback when clearing all filters
 * @param {Object} props.priceRange - Min/max price range from data
 * @param {Object} props.yearRange - Min/max year range from data
 */
const ActiveFiltersChips = ({ filters, onRemoveFilter, onClearAll, priceRange, yearRange }) => {
    // Build an array of active filters with their labels and keys
    const activeFilters = []

    // Make/Brand filters
    if (Array.isArray(filters.make) && filters.make.length > 0) {
        filters.make.forEach(brand => {
            activeFilters.push({
                id: `make_${brand}`,
                label: brand,
                onRemove: () => onRemoveFilter('make', brand)
            })
        })
    }

    // Year range filter
    if (filters.yearMin !== yearRange.min || filters.yearMax !== yearRange.max) {
        activeFilters.push({
            id: 'year',
            label: `${filters.yearMin}-${filters.yearMax}`,
            onRemove: () => onRemoveFilter('year')
        })
    }

    // Price range filter
    if (filters.priceMin > priceRange.min || filters.priceMax < priceRange.max) {
        const priceLabel = filters.priceMax >= priceRange.max
            ? `>${formatPrice(filters.priceMin)}`
            : `${formatPrice(filters.priceMin)}-${formatPrice(filters.priceMax)}`
        activeFilters.push({
            id: 'price',
            label: priceLabel,
            onRemove: () => onRemoveFilter('price')
        })
    }

    // Color filters
    if (Array.isArray(filters.color) && filters.color.length > 0) {
        filters.color.forEach(color => {
            activeFilters.push({
                id: `color_${color}`,
                label: color,
                onRemove: () => onRemoveFilter('color', color)
            })
        })
    }

    // Fuel type filters
    if (Array.isArray(filters.fuelType) && filters.fuelType.length > 0) {
        filters.fuelType.forEach(fuel => {
            activeFilters.push({
                id: `fuelType_${fuel}`,
                label: fuel,
                onRemove: () => onRemoveFilter('fuelType', fuel)
            })
        })
    }

    // Transmission filters
    if (Array.isArray(filters.transmission) && filters.transmission.length > 0) {
        filters.transmission.forEach(trans => {
            activeFilters.push({
                id: `transmission_${trans}`,
                label: trans,
                onRemove: () => onRemoveFilter('transmission', trans)
            })
        })
    }

    // Body type filters
    if (Array.isArray(filters.bodyType) && filters.bodyType.length > 0) {
        filters.bodyType.forEach(bt => {
            activeFilters.push({
                id: `bodyType_${bt}`,
                label: bt,
                onRemove: () => onRemoveFilter('bodyType', bt)
            })
        })
    }

    // Condition filters
    if (Array.isArray(filters.condition) && filters.condition.length > 0) {
        filters.condition.forEach(cond => {
            activeFilters.push({
                id: `condition_${cond}`,
                label: cond,
                onRemove: () => onRemoveFilter('condition', cond)
            })
        })
    }

    // Doors filters
    if (Array.isArray(filters.doors) && filters.doors.length > 0) {
        filters.doors.forEach(door => {
            activeFilters.push({
                id: `doors_${door}`,
                label: `${door} doors`,
                onRemove: () => onRemoveFilter('doors', door)
            })
        })
    }

    // Mileage filter
    if (filters.mileageMax && filters.mileageMax !== '') {
        activeFilters.push({
            id: 'mileage',
            label: `<${filters.mileageMax} km`,
            onRemove: () => onRemoveFilter('mileageMax')
        })
    }

    // If no active filters, return null
    if (activeFilters.length === 0) {
        return null
    }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {activeFilters.map(filter => (
                    <TouchableOpacity
                        key={filter.id}
                        style={styles.chip}
                        onPress={filter.onRemove}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.chipLabel}>{filter.label}</Text>
                        <Ionicons name="close" size={16} color={palette.textPrimary} style={styles.chipIcon} />
                    </TouchableOpacity>
                ))}

                {/* Clear all button - only show if there are 2 or more filters */}
                {activeFilters.length >= 2 && (
                    <TouchableOpacity
                        style={styles.clearAllButton}
                        onPress={onClearAll}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.clearAllText}>Clear all</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    )
}

const styles = {
    container: {
        paddingVertical: 12,
    },
    scrollContent: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.champagne,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    chipLabel: {
        color: palette.lightGrey,
        fontSize: 13,
        fontWeight: '500',
        marginRight: 4,
        fontFamily: 'BaiJamjuree-Regular',
    },
    chipIcon: {
        marginLeft: 2,
        color: palette.champagne,
        fontFamily: 'BaiJamjuree-Regular',
    },
    clearAllButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginLeft: 4,
    },
    clearAllText: {
        color: palette.champagne,
        fontSize: 13,
        fontWeight: '600',
    },
}

export default ActiveFiltersChips
