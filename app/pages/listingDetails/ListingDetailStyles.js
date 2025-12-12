import { StyleSheet, Dimensions } from 'react-native'
import { palette } from '../../theme/palette'

const { width } = Dimensions.get('window')
const borderColor = 'rgba(187, 126, 29, 0.35)'
const overlayColor = 'rgba(187, 126, 29, 0.12)'

export const listingDetailScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.darkGrey,
  },
  scrollView: {
    flex: 1,
    backgroundColor: palette.darkGrey,
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
    backgroundColor: palette.darkGrey,
    borderBottomWidth: 0, // Clean look
  },
  headerTitle: {
    color: palette.white,
    fontSize: 16,
    fontFamily: 'OTJubileeGolden-Italic',
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
    color: palette.lightGrey,
    fontFamily: 'OTJubileeGolden-Italic',
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
    color: palette.mustard,
    fontFamily: 'OTJubileeGolden',
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
    color: palette.mustard,
    fontSize: 14,
    fontFamily: 'OTJubileeGolden',
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
    borderColor: borderColor,
  },
  // About Section
  aboutSection: {
    marginHorizontal: 0,
    marginTop: -50,
    marginBottom: 20,
    overflow: 'hidden',
  },
  aboutGradient: {
    paddingHorizontal: 30,
    paddingTop: 70, // Add padding to clear the overlapped image
    paddingBottom: 30,
  },
  sectionTitleWhite: {
    fontSize: 27,
    color: palette.white,
    fontFamily: 'OTJubileeGolden-ExtralightItalic',
    marginBottom: 12,
  },
  descriptionText: {
    color: palette.white,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
    fontFamily: 'BaiJamjuree-Regular',
    marginLeft: 30,
    marginRight: 10,
  },
  // Specs Section
  specsSection: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  sectionTitleGold: {
    fontSize: 27, // REVVOL: H2
    color: palette.mustard,
    fontFamily: 'OTJubileeGolden',
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: palette.mustard,
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
    padding: 16,
  },
  specLabel: {
    color: palette.lightGrey,
    fontSize: 18,
    marginBottom: 4,
    fontFamily: 'OTJubileeGolden-ExtralightItalic',
  },
  specValue: {
    color: palette.white,
    fontSize: 27,
    fontWeight: '500',
    fontFamily: 'OTJubileeGolden',
  },
  // Seller Section
  sellerSection: {
    marginHorizontal: 30,
    marginBottom: 30,
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
  },
  sellerLabel: {
    color: palette.lightGrey,
    fontSize: 18,
    fontFamily: 'OTJubileeGolden-ExtralightItalic',
    marginBottom: 10,
  },
  sellerCardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.darkMustard,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  sellerBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: palette.mustard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerBadgeText: {
    color: palette.lightGrey,
    fontSize: 18,
    fontFamily: 'OTJubileeGolden',
    fontWeight: '700',
  },
  sellerAvatarPill: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.mustard,
    marginRight: 12,
    backgroundColor: palette.darkGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
  },
  sellerAvatarText: {
    color: palette.white,
    fontSize: 27,
    fontFamily: 'OTJubileeGolden',
  },
  sellerPillInfo: {
    flex: 1,
  },
  sellerName: {
    color: palette.white,
    fontSize: 27,
    fontWeight: '700',
    fontFamily: 'OTJubileeGolden',
  },
  sellerPillRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  sellerRatingCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerRatingValue: {
    color: palette.white,
    fontSize: 27,
    fontWeight: '700',
    fontFamily: 'OTJubileeGolden',
  },
  // Action Buttons
  actionsSection: {
    paddingHorizontal: 30,
    marginBottom: 30,
    gap: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    flex: 1,
    height: 54,
    borderRadius: 5,
    backgroundColor: palette.mustard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    backgroundColor: palette.champagne,
  },
  primaryButtonText: {
    color: palette.darkGrey,
    fontSize: 16,
    fontFamily: 'BaiJamjuree-Regular',
  },
  primaryButtonTextPressed: {
    color: palette.darkMustard,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    height: 54,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.mustard,
    backgroundColor: 'transparent',
  },
  secondaryButtonPressed: {
    borderColor: palette.champagne,
  },
  secondaryButtonText: {
    color: palette.mustard,
    fontSize: 16,
    fontFamily: 'BaiJamjuree-Regular',
  },
  secondaryButtonTextPressed: {
    color: palette.champagne,
    fontWeight: '700',
  },
  // Footer
  footer: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 70
  },
  footerCta: {
    width: '100%',
    overflow: 'hidden',
  },
  footerGradient: {
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  footerText: {
    color: palette.white,
    fontSize: 50, // REVVOL: H2
    fontFamily: 'OTJubileeGolden-Italic',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginLeft: 20,
  },
  // Loaders/Errors
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.darkGrey,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontFamily: 'OTJubileeGolden',
  },
})
