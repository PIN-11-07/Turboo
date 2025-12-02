import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { palette } from '../../theme/palette'

// Mock data with anonymous avatars
const MOCK_CONVERSATIONS = [
    {
        id: '1',
        name: 'Jonas R.',
        lastMessage: '',
        time: '5 hours ago',
        unreadCount: 0,
    },
    {
        id: '2',
        name: 'Bernie P.',
        time: '17 hours ago',
        unreadCount: 3,
    },
    {
        id: '3',
        name: 'Laura M.',
        time: '1 day ago',
        unreadCount: 0,
    },
    {
        id: '4',
        name: 'Javier A.',
        time: '1 day ago',
        unreadCount: 0,
    },
    {
        id: '5',
        name: 'Lydia F.',
        time: '3 days ago',
        unreadCount: 1,
    },
]

const ACCENT_GOLD = '#C58A1A'
const ACCENT_GOLD_DARK = '#5E4209'

export default function MessagesScreen() {
    const navigation = useNavigation()

    const handlePress = (conversation) => {
        navigation.navigate('Chat', {
            sellerName: conversation.name,
            listing: { title: 'Vehículo', price: 0 },
        })
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => handlePress(item)}
            activeOpacity={0.8}
        >
            <View style={styles.avatarContainer}>
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={28} color={ACCENT_GOLD} />
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.topRow}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
            </View>

            {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Custom Gradient Header */}
            <LinearGradient
                colors={[ACCENT_GOLD_DARK, '#000000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity style={styles.infoIcon}>
                            <Ionicons name="information-circle-outline" size={24} color="#CCC" />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Text style={styles.headerTitleLight}>You have new</Text>
                            <Text style={styles.headerTitleBold}>messages</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <FlatList
                data={MOCK_CONVERSATIONS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                style={styles.list}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    headerGradient: {
        paddingBottom: 20,
    },
    safeAreaHeader: {
        marginBottom: 0,
    },
    headerContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    infoIcon: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    titleContainer: {
        marginTop: 0,
    },
    headerTitleLight: {
        fontSize: 32,
        color: '#E0E0E0',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '300',
    },
    headerTitleBold: {
        fontSize: 42,
        color: '#E0E0E0',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        fontStyle: 'italic',
        lineHeight: 48,
    },
    list: {
        flex: 1,
        backgroundColor: '#121212',
    },
    listContent: {
        paddingTop: 0,
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: ACCENT_GOLD,
        backgroundColor: '#121212',
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: ACCENT_GOLD,
        backgroundColor: '#1A1A1A', // Slightly lighter than bg
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 10,
    },
    name: {
        color: '#E0E0E0',
        fontSize: 20,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '500',
    },
    time: {
        color: '#AAAAAA',
        fontSize: 12,
        position: 'absolute',
        right: 0,
        top: -10,
    },
    unreadBadge: {
        backgroundColor: '#FFFFFF',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    unreadText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: 'bold',
    },
})
