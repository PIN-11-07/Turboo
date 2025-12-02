import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { palette } from '../../theme/palette'

// Mock initial messages
const INITIAL_MESSAGES = [
    {
        id: '1',
        text: 'Hola, ¿sigue disponible este vehículo?',
        sender: 'me',
        timestamp: '10:30',
    },
    {
        id: '2',
        text: 'Hola! Sí, todavía lo tengo. ¿Te gustaría verlo?',
        sender: 'other',
        timestamp: '10:32',
    },
]

export default function ChatScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const { listing, sellerName, sellerRating } = route.params || {}

    const [messages, setMessages] = useState(INITIAL_MESSAGES)
    const [inputText, setInputText] = useState('')
    const flatListRef = useRef(null)

    const handleSend = () => {
        if (inputText.trim().length === 0) return

        const newMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setMessages((prev) => [...prev, newMessage])
        setInputText('')

        // Simulate response
        setTimeout(() => {
            const responseMessage = {
                id: (Date.now() + 1).toString(),
                text: 'Gracias por tu interés. ¿Tienes alguna otra pregunta?',
                sender: 'other',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
            setMessages((prev) => [...prev, responseMessage])
        }, 2000)
    }

    useEffect(() => {
        // Scroll to bottom when messages change
        if (flatListRef.current) {
            setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100)
        }
    }, [messages])

    const renderItem = ({ item }) => {
        const isMe = item.sender === 'me'
        return (
            <View style={[styles.messageRow, isMe ? styles.messageRowRight : styles.messageRowLeft]}>
                <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
                    <Text style={[styles.messageText, isMe ? styles.messageTextRight : styles.messageTextLeft]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.timestamp, isMe ? styles.timestampRight : styles.timestampLeft]}>
                        {item.timestamp}
                    </Text>
                </View>
            </View>
        )
    }

    // Fallback data if not provided via params
    const carImage = listing?.images?.[0] || listing?.image || null
    const carModel = listing?.title || listing?.model || 'Vehículo'
    const carPrice = listing?.price ? `€ ${Number(listing.price).toLocaleString('es-ES')}` : 'Consultar'
    const displaySellerName = sellerName || 'Vendedor'
    const displayRating = sellerRating || '5.0'

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={palette.background} />

            {/* Custom Header */}
            <View style={styles.header}>
                <View style={styles.headerTopRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={palette.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.sellerInfo}>
                        <Text style={styles.sellerName}>{displaySellerName}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color={palette.accent} />
                            <Text style={styles.ratingText}>{displayRating}</Text>
                        </View>
                    </View>
                    <View style={{ width: 24 }} />
                </View>

                {/* Car Context Sub-header */}
                <View style={styles.carContext}>
                    {carImage ? (
                        <Image source={{ uri: carImage }} style={styles.carThumb} />
                    ) : (
                        <View style={[styles.carThumb, { backgroundColor: '#333' }]} />
                    )}
                    <View style={styles.carDetails}>
                        <Text style={styles.carTitle} numberOfLines={1}>{carModel}</Text>
                        <Text style={styles.carPrice}>{carPrice}</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoiding}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    style={styles.list}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe un mensaje..."
                        placeholderTextColor="#666"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                        <Ionicons name="arrow-up-circle" size={40} color={palette.accent} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },
    header: {
        backgroundColor: palette.surface,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
    },
    backButton: {
        padding: 4,
    },
    sellerInfo: {
        alignItems: 'center',
    },
    sellerName: {
        color: palette.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    ratingText: {
        color: palette.textSecondary,
        fontSize: 12,
        marginLeft: 4,
    },
    carContext: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    carThumb: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    carDetails: {
        flex: 1,
    },
    carTitle: {
        color: palette.textPrimary,
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // Serif as requested
        fontWeight: 'bold',
    },
    carPrice: {
        color: palette.accent,
        fontSize: 14,
        fontWeight: '600',
    },
    keyboardAvoiding: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    messageRow: {
        marginBottom: 12,
        flexDirection: 'row',
    },
    messageRowRight: {
        justifyContent: 'flex-end',
    },
    messageRowLeft: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    bubbleRight: {
        backgroundColor: '#FFFFFF', // White bubble for sender as requested
        borderBottomRightRadius: 2,
    },
    bubbleLeft: {
        backgroundColor: '#333333', // Dark bubble for receiver
        borderBottomLeftRadius: 2,
    },
    messageText: {
        fontSize: 16,
    },
    messageTextRight: {
        color: '#000000', // Dark text for white bubble
    },
    messageTextLeft: {
        color: '#FFFFFF',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    timestampRight: {
        color: '#666',
    },
    timestampLeft: {
        color: '#AAA',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: palette.surface,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    input: {
        flex: 1,
        backgroundColor: '#222',
        color: '#FFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        padding: 4,
    },
})
