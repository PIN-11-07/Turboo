import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  safeArea:{ flex:1, backgroundColor:"#000" },

  // HEADER
  headerContainer:{ paddingHorizontal:22, paddingTop:0 },
  heroTitleMain:{ fontSize:42, fontWeight:"700", color:"#fff" },
  heroTitleSub:{ fontSize:32, fontStyle:"italic", color:"#D6B170", marginTop:-6 },
  headerText:{ marginTop:6, fontSize:14, color:"#cfc6b3", marginBottom:40, paddingTop:20 },

  gradientBackground:{
    position:"absolute",
    top:200,
    width:"100%",
    height:350,
    zIndex:-1,
  },

  emptyText:{ textAlign:"center", marginTop:40, color:"#aaa", fontSize:16 },

  // ==============================
  // 🔥 CARDS GRANDES SEPARADAS
  // ==============================
  cardCarouselItem:{
    backgroundColor:"#fff",
    borderRadius:22,
    overflow:"hidden",
    width:300,       // más ancha
    height:380,      // más alta
    marginHorizontal:20, // 💥 separación REAL entre tarjetas
  },

  // Imagen
cardImageWrapper:{
  width:"100%",
  height:240,
  borderTopLeftRadius:22,
  borderTopRightRadius:22,
  overflow:"hidden"
},

  cardImage:{
    width:"100%",
    height:"100%",
    resizeMode:"cover",
  },

  favoriteButton:{
    position:"absolute",
    bottom:12,
    left:12,
    zIndex:10,
  },

  cardContent:{
    paddingHorizontal:18,
    paddingVertical:14,
  },
  cardHeader:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
  },
  cardTitle:{
    fontSize:18,
    fontWeight:"700",
    color:"#000",
    maxWidth:"70%",
  },
  cardPrice:{
    fontSize:18,
    fontWeight:"700",
    color:"#000",
  },
  cardSubtitle:{
    fontSize:14,
    color:"#666",
    marginTop:8,
  },

  // Placeholder
  cardImagePlaceholder:{
    width:"100%",
    height:240,
    backgroundColor:"#444",
    justifyContent:"center",
    alignItems:"center"
  },
  cardImagePlaceholderText:{ color:"#fff" }

});
