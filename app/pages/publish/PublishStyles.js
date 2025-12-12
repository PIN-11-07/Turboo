import { StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export const publishScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.darkGrey,
  },

  container: {
    flex: 1,
    backgroundColor: palette.darkGrey,
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
    borderColor: palette.mustard,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  photoButtonPlus: {
    color: palette.mustard,
    fontSize: 20,
    fontFamily: 'BaiJamjuree-Regular',
  },

  
  photoButtonOutline: {
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    borderWidth: 1,
  },

  photoButtonPlusOutline: {
    fontSize: 24,    
    fontWeight: '400',
    fontFamily: 'BaiJamjuree-Regular',
  },

  photoButtonTextOutline: {
    fontSize: 16,    
    fontWeight: '400',
    fontFamily: 'BaiJamjuree-Regular',
    color: palette.mustard,
  },

  tipText: {
    color: palette.lightGrey,
    fontSize: 13,
    marginBottom: 30,
    marginTop: 10,
    lineHeight: 16,
    fontFamily: 'BaiJamjuree-Regular',
  },

  sectionTitle: {
    color: palette.textPrimary,
    fontSize: 20,
    marginBottom: 16,
    marginTop: 10,
  },

  label: {
    color: palette.white,
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },

  selector: {
    backgroundColor: palette.darkGrey,
    borderWidth: 1,
    borderColor: palette.mustard,
    padding: 14,
    borderRadius: 5,
  },

  selectorValue: {
    color: palette.mustard,
    fontSize: 16,
    fontFamily: 'BaiJamjuree-Regular',
  },

  selectorPlaceholder: {
    color: palette.mustard,
    opacity: 0.65,
    fontSize: 16,
  },

  input: {
    backgroundColor: palette.darkGrey,
    borderWidth: 1,
    borderColor: palette.mustard,
    padding: 14,
    borderRadius: 5,
    fontSize: 16,
    color: palette.mustard,
    fontFamily: 'BaiJamjuree-Regular',
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
    backgroundColor: palette.mustard,
    paddingVertical: 16,
    borderRadius: 5,
    alignItems: 'center',
  },

  postButtonText: {
    color: palette.darkGrey,
    fontSize: 16,
    fontFamily: 'BaiJamjuree-Regular',
  },

  draftButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.mustard,
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
  },

  draftButtonText: {
    color: palette.mustard,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'BaiJamjuree-Regular',
  },

  submitDisabled: {
    opacity: 0.5,
  },

  optionList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: palette.mustard,
    backgroundColor: palette.darkGrey,
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
  borderColor: palette.mustard,
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
  color: palette.mustard, 
  opacity: 0.65, 
  fontSize: 16,
  fontFamily: 'BaiJamjuree-Regular',
},
sellCarTitle: {
  fontFamily: 'OTJubileeGolden-Italic',
  fontSize: 16,
  fontWeight: '500',
  color: palette.white,
  textAlign: 'center',
  letterSpacing: 1,
  marginVertical: 5,
  paddingBottom: 10,
},
})
