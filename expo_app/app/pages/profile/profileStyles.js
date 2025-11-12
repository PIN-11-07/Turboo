import { StyleSheet } from 'react-native'

export const profileScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    textAlign: 'center',
    color: '#D93025',
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    color: '#1F1F1F',
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 16,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: '600',
    color: '#4C7EFF',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6A7280',
    marginTop: 12,
  },
  cardValue: {
    fontSize: 18,
    color: '#1F1F1F',
    fontWeight: '500',
    marginTop: 4,
  },
  section: {
    width: '100%',
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F1F1F',
    marginBottom: 16,
  },
  emptyState: {
    fontSize: 16,
    color: '#6A7280',
  },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  listingImageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  listingImage: {
    width: '100%',
    height: '100%',
  },
  listingImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingImagePlaceholderText: {
    fontSize: 12,
    color: '#6A7280',
    textAlign: 'center',
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
  },
  listingPrice: {
    fontSize: 15,
    color: '#0B5FFF',
    marginTop: 6,
    fontWeight: '500',
  },
  listingDate: {
    fontSize: 13,
    color: '#6A7280',
    marginTop: 4,
  },
  signOutButton: {
    marginTop: 32,
    backgroundColor: '#D93025',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
})

export const profileListingDetailScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  loader: {
    marginTop: 24,
    alignItems: 'center',
  },
  errorBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FDECEA',
  },
  errorText: {
    color: '#C62828',
    fontSize: 16,
    textAlign: 'center',
  },
  galleryWrapper: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  galleryImage: {
    height: 220,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  galleryPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryPlaceholderText: {
    color: '#6B7280',
    fontSize: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    color: '#111827',
    fontWeight: '700',
  },
  price: {
    fontSize: 20,
    color: '#0B5FFF',
    fontWeight: '600',
    marginTop: 8,
  },
  caption: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attributeRowSpacing: {
    marginTop: 12,
  },
  attributeLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  attributeValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },
})
