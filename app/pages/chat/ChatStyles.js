import { StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export const chatStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    backgroundColor: palette.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  counterpartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: palette.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  counterpartName: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  listingRow: {
    marginTop: 4,
  },
  listingTitle: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  listingPrice: {
    color: palette.mustard,
    fontSize: 12,
    marginTop: 2,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: palette.background,
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: '82%',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  incoming: {
    alignSelf: 'flex-start',
    backgroundColor: palette.elevated,
  },
  outgoing: {
    alignSelf: 'flex-end',
    backgroundColor: palette.darkGrey,
    borderColor: '#3a3a3a',
  },
  messageText: {
    color: palette.textPrimary,
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    color: palette.textMuted,
    fontSize: 11,
    marginTop: 6,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.elevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    color: palette.textPrimary,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: palette.mustard,
  },
  disabledSend: {
    backgroundColor: palette.disabled,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: palette.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: palette.danger,
    textAlign: 'center',
    marginTop: 8,
  },
})
