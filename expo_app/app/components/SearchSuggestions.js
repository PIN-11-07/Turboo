import React from 'react'
import { Keyboard, Text, TouchableOpacity, View } from 'react-native'
import { palette } from '../theme/palette'

/**
 * SearchSuggestions component displays autocomplete suggestions for search input
 * @param {Object} props
 * @param {Array} props.suggestions - Array of suggestion objects with type and value
 * @param {Function} props.onSuggestionPress - Callback when a suggestion is pressed
 * @param {Boolean} props.visible - Whether suggestions should be visible
 */
const SearchSuggestions = ({ suggestions = [], onSuggestionPress, visible = false }) => {
  if (!visible || suggestions.length === 0) {
    return null
  }

  return (
    <View style={styles.container}>
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={`${suggestion.type}-${suggestion.value}`}
          onPress={() => {
            onSuggestionPress(suggestion)
            Keyboard.dismiss()
          }}
          style={[
            styles.suggestion,
            index < suggestions.length - 1 && styles.suggestionWithBorder
          ]}
        >
          <Text style={styles.suggestionText}>
            {suggestion.value}
          </Text>
          <Text style={styles.suggestionType}>
            {suggestion.type === 'make' ? 'Marca' : 'Modelo'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = {
  container: {
    backgroundColor: palette.surface,
    borderRadius: 8,
    marginTop: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestion: {
    padding: 12,
  },
  suggestionWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  suggestionText: {
    color: palette.textPrimary,
    fontSize: 15,
  },
  suggestionType: {
    color: palette.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
}

export default SearchSuggestions