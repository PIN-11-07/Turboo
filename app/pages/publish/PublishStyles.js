import { StyleSheet } from 'react-native'

const palette = {
  background: '#0D0D0D',
  surface: '#000',
  gold: '#C58A1A',
  goldSoft: '#E0A740',
  textPrimary: '#FFFFFF',
  textMuted: '#888888',
  border: '#3A3A3A',
}

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
    padding: 20,
    paddingBottom: 80, // extra space so bottom buttons stay visible above tab bar
  },

  title: {
    textAlign: 'center',
    color: palette.textPrimary,
    fontSize: 14,
    marginBottom: 22,
    marginTop: 5,
    letterSpacing: 1,
  },

  photoButton: {
    borderWidth: 1,
    borderColor: palette.gold,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  photoButtonPlus: {
    color: palette.gold,
    fontSize: 20,
  },

  photoButtonText: {
    color: palette.gold,
    fontSize: 16,
  },

  tipText: {
    color: '#ddddddff',
    fontSize: 14,
    marginBottom: 30,
    marginTop: 10,
    lineHeight: 16,
  },

  sectionTitle: {
    color: palette.textPrimary,
    fontSize: 20,
    marginBottom: 16,
    marginTop: 10,
  },

  label: {
    color: palette.textPrimary,
    fontFamily: 'System',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },

  selector: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.gold,
    padding: 14,
    borderRadius: 8,
  },

  selectorValue: {
    color: palette.gold,
    fontSize: 16,
  },

  selectorPlaceholder: {
    color: palette.gold,
    opacity: 0.65,
    fontSize: 16,
  },

  input: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.gold,
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    color: palette.gold,
  },

  multiline: {
    height: 130,
    textAlignVertical: 'top',
  },

  tagsButton: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tagsText: {
    color: palette.textPrimary,
    fontSize: 16,
  },

  chevron: {
    color: palette.textPrimary,
    fontSize: 20,
  },

  postButton: {
    marginTop: 54,
    backgroundColor: palette.gold,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  postButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },

  draftButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.gold,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  draftButtonText: {
    color: palette.gold,
    fontSize: 16,
    fontWeight: '600',
  },

  submitDisabled: {
    opacity: 0.5,
  },

  optionList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: palette.gold,
    backgroundColor: palette.surface,
    borderRadius: 8,
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
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9534F',
    backgroundColor: 'rgba(217,83,79,0.15)',
  },

  feedbackBoxSuccess: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4BB543',
    backgroundColor: 'rgba(75,181,67,0.15)',
  },

  feedbackText: {
    color: palette.textPrimary,
    fontSize: 14,
  },

  imageContainer: {
  width: '100%',
  height: 220,
  borderRadius: 10,
  overflow: 'hidden',
  marginBottom: 16,
  borderWidth: 1,
  borderColor: palette.gold,
  backgroundColor: '#000',
},

previewImage: {
  width: '100%',
  height: '100%',
},

removeImageButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'rgba(0,0,0,0.6)',
  width: 32,
  height: 32,
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
},

removeImageX: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},
placeholder: {
  color: palette.gold, 
  opacity: 0.65, 
  fontSize: 16,
},
sellCarTitle: {
  fontFamily: 'serif',
  fontSize: 16,
  color: '#fff',
  textAlign: 'center',
  marginVertical: 20,
  letterSpacing: 1,
},
})
