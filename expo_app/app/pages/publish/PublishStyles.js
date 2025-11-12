import { StyleSheet } from 'react-native'

export const publishScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#0B0B0F',
  },
  infoBox: {
    backgroundColor: '#EEF3FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    color: '#0B5FFF',
    fontSize: 14,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#394150',
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0B0B0F',
  },
  multilineInput: {
    minHeight: 120,
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
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectorValue: {
    fontSize: 16,
    color: '#0B0B0F',
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: '#8892A0',
  },
  optionList: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5DBE4',
    backgroundColor: '#FFFFFF',
    maxHeight: 200,
    overflow: 'hidden',
  },
  optionScroll: {
    maxHeight: 200,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#0B0B0F',
  },
  feedbackBoxError: {
    backgroundColor: '#FFE8E6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  feedbackBoxSuccess: {
    backgroundColor: '#E8F8EF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 14,
    color: '#394150',
  },
  submitButton: {
    backgroundColor: '#0B5FFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitDisabled: {
    backgroundColor: '#A7C0FF',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 24,
  },
})
