import { StyleSheet, Platform, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

const COLORS = {
  background: '#090809',
  white: '#FFFFFF',
  mustard: '#C58A1A',
  mustardDark: '#8A5C0D',
  mustardSoft: '#E3B45A',
  charcoal: '#1C1C1C',
  champagne: '#F4E3C3',
  border: 'rgba(197, 138, 26, 0.35)',
  overlay: 'rgba(197, 138, 26, 0.12)',
}

export const listingDetailScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30, // REVVOL: 30 padding
    paddingVertical: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 0, // Clean look
  },
  headerTitle: {
    color: COLORS.mustard,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  iconButton: {
    padding: 8,
  },
  // Hero / Title Block
  titleBlock: {
    paddingHorizontal: 30, // REVVOL: 30 padding
    marginTop: 20,
    marginBottom: 10,
  },
  carTitle: {
    fontSize: 50, // REVVOL: H1 50px
    color: COLORS.white,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '200', // Extralight feel
    marginBottom: 8,
    lineHeight: 56,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    fontSize: 27, // REVVOL: H2 27px
    color: COLORS.mustard,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Italic' : 'serif',
    fontStyle: 'italic',
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  interactionText: {
    color: COLORS.mustard,
    fontSize: 14,
  },
  // Image Section
  imageSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0, // Remove bottom margin to allow overlap
    zIndex: 10, // Ensure image is on top
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  heroImage: {
    width: width - 40, // Slightly wider
    height: 280,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  galleryList: {
    paddingHorizontal: 30,
    marginTop: 10,
    zIndex: 10, // Ensure gallery is also on top if needed
  },
  galleryThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // About Section
  aboutSection: {
    marginHorizontal: 0,
    marginTop: -50,
    marginBottom: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  aboutGradient: {
    paddingHorizontal: 30,
    paddingTop: 70, // Add padding to clear the overlapped image
    paddingBottom: 30,
  },
  sectionTitleWhite: {
    fontSize: 27,
    color: COLORS.white,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 12,
  },
  descriptionText: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  // Specs Section
  specsSection: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  sectionTitleGold: {
    fontSize: 27, // REVVOL: H2
    color: COLORS.mustard,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.mustard,
    paddingLeft: 10,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10, // REVVOL: 10px spacing
  },
  specItem: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: COLORS.overlay,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specLabel: {
    color: COLORS.mustardSoft,
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Italic' : 'serif',
  },
  specValue: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  // Seller Section
  sellerSection: {
    marginHorizontal: 30,
    marginBottom: 30,
    backgroundColor: COLORS.overlay,
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sellerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.charcoal,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.mustard,
  },
  sellerAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  sellerAvatarText: {
    color: COLORS.mustard,
    fontSize: 24,
    fontWeight: 'bold',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  sellerRating: {
    color: COLORS.mustard,
    fontSize: 14,
    marginTop: 4,
  },
  sellerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  sellerStar: {
    position: 'relative',
  },
  sellerStarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  sellerRatingValue: {
    color: COLORS.mustard,
    fontSize: 16,
    fontWeight: '600',
  },
  sellerRatingFallback: {
    color: COLORS.champagne,
    fontSize: 14,
    marginTop: 6,
  },
  // Action Buttons
  actionsSection: {
    paddingHorizontal: 30,
    marginBottom: 30,
    gap: 16,
  },
  primaryButton: {
    borderRadius: 100, // REVVOL: 100 radius (Capsule)
    overflow: 'hidden',
    height: 50, // REVVOL: 50px height
    shadowColor: COLORS.mustard,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white, // White text on gold gradient
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    height: 50, // REVVOL: 50px height
    borderRadius: 100, // REVVOL: 100 radius
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  // Footer
  footer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  footerCta: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  footerGradient: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#000000',
    fontSize: 27, // REVVOL: H2
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  // Loaders/Errors
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
})
