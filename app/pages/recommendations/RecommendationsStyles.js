import { StyleSheet } from "react-native"
import { palette } from "../../theme/palette"

const FONT_FAMILY = 'OTJubileeGolden'

export const styles = StyleSheet.create({

  safeArea: { flex: 1, backgroundColor: palette.background },

  // HEADER
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: palette.black,
  },
  iconButton: {
    padding: 8,
  },

  // HEADER CONTAINER
  headerContainer: { paddingHorizontal: 22, paddingTop: 0 },
  heroTitleMain: { fontSize: 50, fontWeight: "700", color: palette.champagne, fontFamily: 'OTJubileeGolden-Extralight' },
  heroTitleSub: { fontSize: 50, fontStyle: "italic", color: palette.champagne, marginTop: -6, fontFamily: 'OTJubileeGolden-Italic' },
  headerText: { marginTop: 16, marginBottom:8, fontSize: 16, color: palette.lightGrey, marginBottom: 24, paddingTop: 8, fontFamily: FONT_FAMILY },

  gradientBackground: {
    position: "absolute",
    top: 225,
    width: "100%",
    height: 350,
    zIndex: -1,
  },

  emptyText: { textAlign: "center", marginTop: 40, color: palette.textMuted, fontSize: 16, fontFamily: FONT_FAMILY },

  // ==============================
  // 🔥 CARDS GRANDES SEPARADAS
  // ==============================
  cardCarouselItem: {
    backgroundColor: palette.lightGrey,
    borderRadius: 22,
    overflow: "hidden",
    width: 300,
    height: 380,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },

  // Imagen
  cardImageWrapper: {
    width: "100%",
    height: 240,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden"
  },

  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  favoriteButton: {
    position: "absolute",
    bottom: 12,
    left: 12,
    zIndex: 10,
  },

  cardContent: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 2,
    backgroundColor: palette.lightGrey,
  },
  cardTitle: {
    fontSize: 27,
    fontWeight: "600",
    color: palette.darkGrey,
    lineHeight: 24,
    minHeight: 48,
    fontFamily: FONT_FAMILY,
    paddingTop: 16,
  },
  cardPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  favoriteHeartButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 0,
  },
  cardPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: palette.darkGrey,
    fontFamily: FONT_FAMILY,
  },

  // Placeholder
  cardImagePlaceholder: {
    width: "100%",
    height: 240,
    backgroundColor: palette.elevated,
    justifyContent: "center",
    alignItems: "center"
  },
  cardImagePlaceholderText: { color: palette.textSecondary, fontFamily: FONT_FAMILY }

});
