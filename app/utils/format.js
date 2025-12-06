/**
 * Formats a price value to a localized string
 * @param {number|string} value - The price value to format
 * @returns {string} - Formatted price string
 */
export const formatPrice = (value) => {
  const numericValue = Number(value)

  if (Number.isFinite(numericValue) && numericValue >= 0) {
    return `€ ${numericValue.toLocaleString('es-ES')}`
  }

  return value ? String(value) : 'Precio no disponible'
}

/**
 * Formats mileage with proper units
 * @param {number|string} mileage - The mileage value
 * @returns {string} - Formatted mileage string
 */
export const formatMileage = (mileage) => {
  const numericValue = Number(mileage)
  
  if (Number.isFinite(numericValue) && numericValue >= 0) {
    return `${numericValue.toLocaleString('es-ES')} km`
  }
  
  return 'Kilometraje s/d'
}

/**
 * Normalizes a string for search operations
 * @param {string} str - String to normalize
 * @returns {string} - Normalized string
 */
export const normalizeForSearch = (str) => {
  if (!str) return ''
  return str.toString().toLowerCase().trim()
}