import { StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export const loginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: palette.background,
  },
  card: {
    width: '100%',
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 5,
    transform: [{ translateY: -90 }],
    borderWidth: 1,
    borderColor: palette.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: palette.textPrimary,
  },
  input: {
    backgroundColor: palette.overlay,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: palette.border,
  },
  button: {
    backgroundColor: palette.accentStrong,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: palette.textPrimary,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: palette.danger,
    textAlign: 'center',
    marginBottom: 10,
  },
  success: {
    color: palette.success,
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: palette.accent,
  },
})
