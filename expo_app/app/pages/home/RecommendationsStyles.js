import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({

    safeArea: { flex: 1, backgroundColor: "#000" },

    // HEADER
    headerContainer: { paddingHorizontal: 22, paddingTop: 0 },
    heroTitleMain: { fontSize: 42, fontWeight: "700", color: "#fff" },
    heroTitleSub: { fontSize: 32, fontStyle: "italic", color: "#D6B170", marginTop: -6 },
    headerText: { marginTop: 6, fontSize: 14, color: "#cfc6b3", marginBottom: 40, paddingTop: 20 },


    // 🔥 Gradiente reubicado detrás de las cards (como pediste)
    gradientBackground: {
        position: "absolute",
        top: 200,
        width: "100%",
        height: 350,    // modifícalo si quieres que cubra más o menos
        zIndex: -1
    },

    emptyText: { 
        textAlign: "center", 
        marginTop: 40, 
        color: "#aaa", 
        fontSize: 16 
    },


    // 🔥 Cards más cortas (ahora se ven como en tu foto)
    cardSmall: {
        width: 240,
        height: 300,
        backgroundColor: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        marginRight: 16
    },
    priceTag: {
        color: "#D6B170",
        fontSize: 20,
        fontWeight: "700",
        textAlign: "right",
        marginTop: 10,
        width: "100%"
    },


})
