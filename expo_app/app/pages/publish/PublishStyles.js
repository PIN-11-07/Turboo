import { StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export const publishScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: palette.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: palette.textPrimary,
  },
  infoBox: {
    backgroundColor: palette.overlay,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: palette.accent,
  },
  infoText: {
    color: palette.accent,
    fontSize: 14,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: palette.textSecondary,
  },
  input: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: palette.border,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  rowItem: {
    flex: 1,
  },
  selector: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: palette.border,
  },
  selectorValue: {
    fontSize: 16,
    color: palette.textPrimary,
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: palette.textMuted,
  },
  optionList: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.elevated,
    maxHeight: 200,
    overflow: 'hidden',
  },
  optionScroll: {
    maxHeight: 200,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  optionText: {
    fontSize: 16,
    color: palette.textPrimary,
  },
  feedbackBoxError: {
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palette.danger,
  },
  feedbackBoxSuccess: {
    backgroundColor: 'rgba(111, 228, 181, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palette.success,
  },
  feedbackText: {
    fontSize: 14,
    color: palette.textSecondary,
  },
  submitButton: {
    backgroundColor: palette.accentStrong,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  submitDisabled: {
    backgroundColor: palette.disabled,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  bottomSpacing: {
    height: 24,
  },
})
