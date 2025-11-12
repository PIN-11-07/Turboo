import { StyleSheet } from 'react-native'

export const homeScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  topSection: {
    paddingTop: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  hero: {
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  searchInput: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardImagePlaceholder: {
    backgroundColor: '#D9DCE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImagePlaceholderText: {
    color: '#525868',
    fontWeight: '600',
  },
  cardContent: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#4B5563',
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B5FFF',
  },
  cardBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  cardBadge: {
    backgroundColor: '#EEF2FF',
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  cardLocation: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 246, 250, 0.6)',
  },
})

export const homeListingDetailScreenStyles = StyleSheet.create({
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
