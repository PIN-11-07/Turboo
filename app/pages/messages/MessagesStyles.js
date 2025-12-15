import { StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export const messagesStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: palette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  list: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  card: {
    backgroundColor: palette.elevated,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarLetter: {
    color: palette.textPrimary,
    fontWeight: '700',
    fontSize: 18,
  },
  cardContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  time: {
    color: palette.textMuted,
    fontSize: 12,
  },
  listingTitle: {
    color: palette.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  lastMessage: {
    color: palette.textMuted,
    fontSize: 13,
    marginTop: 6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: palette.textSecondary,
    textAlign: 'center',
    marginTop: 8,
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
    paddingHorizontal: 16,
    marginTop: 12,
  },
  refreshButton: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  refreshText: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
})
