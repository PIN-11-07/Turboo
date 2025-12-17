import React, { useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useMessages } from './useMessages'
import { palette } from '../../theme/palette'

const ACCENT_GOLD = '#C58A1A'
const ACCENT_GOLD_DARK = '#5E4209'

const formatTime = iso => {
  if (!iso) return ''
  const date = new Date(iso)
  const now = new Date()

  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (sameDay) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' })
}

export default function MessagesScreen() {
  const navigation = useNavigation()
  const { conversations, loading, refreshing, error, fetchConversations } = useMessages()
  const [infoVisible, setInfoVisible] = useState(false)

  const handlePress = (item) => {
    navigation.navigate('Chat', {
      conversationId: item.id,
      conversation: item,
      otherUserId: item.otherUserId,
      listing: item.listing,
    })
  }

  const renderItem = ({ item }) => {
    const name = item.otherUser?.full_name || 'User'
    const listingTitle = item.listing?.title || 'Listing'
    const lastMessage = item.last_message_text || 'Start the conversation'
    // unreadCount not currently available in backend schema, defaulting to 0
    const unreadCount = 0

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => handlePress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            {/* Use first letter as avatar placeholder */}
            <Text style={{ color: ACCENT_GOLD, fontSize: 24, fontWeight: 'bold' }}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.topRow}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>{formatTime(item.last_message_at)}</Text>
          </View>
          <Text style={{ color: '#888', marginTop: 4, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }} numberOfLines={1}>
            {listingTitle}
          </Text>
          <Text style={{ color: '#AAA', marginTop: 2, fontSize: 13 }} numberOfLines={2}>
            {lastMessage}
          </Text>
        </View>

        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

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
            <TouchableOpacity
              style={styles.infoIcon}
              onPress={() => setInfoVisible(true)}
            >
              <Ionicons name="information-circle-outline" size={24} color="#CCC" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitleLight}>You have new</Text>
              <Text style={styles.headerTitleBold}>messages</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {error && (
        <View style={{ padding: 20 }}>
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity onPress={() => fetchConversations(true)} style={{ padding: 10, alignItems: 'center' }}>
            <Text style={{ color: ACCENT_GOLD }}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={ACCENT_GOLD} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={conversations.length === 0 ? { flex: 1, justifyContent: 'center', alignItems: 'center' } : styles.listContent}
          style={styles.list}
          refreshing={refreshing}
          onRefresh={() => fetchConversations(true)}
          ListEmptyComponent={
            !loading && (
              <View style={{ alignItems: 'center', padding: 40 }}>
                <Ionicons name="mail-unread-outline" size={50} color={ACCENT_GOLD} />
                <Text style={{ color: '#888', marginTop: 20, textAlign: 'center' }}>
                  No messages yet. Contact a seller to start a chat.
                </Text>
              </View>
            )
          }
        />
      )}

      {/* Custom Modal for Info */}
      <Modal
        transparent
        visible={infoVisible}
        animationType="fade"
        onRequestClose={() => setInfoVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setInfoVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.infoModal}>
                <Ionicons name="shield-checkmark" size={48} color={ACCENT_GOLD} style={{ marginBottom: 16 }} />
                <Text style={styles.modalTitle}>Secure Messaging</Text>
                <Text style={styles.modalText}>
                  Your conversations are encrypted and secure.
                  We prioritize your privacy and safety throughout the transaction.
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setInfoVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Understood</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
    borderBottomColor: 'rgba(197, 138, 26, 0.2)', // ACCENT_GOLD with opacity
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
    backgroundColor: '#1A1A1A',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)', // Darker backdrop for premium feel
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoModal: {
    backgroundColor: '#151515', // Matches palette.elevated or slightly darker
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ACCENT_GOLD,
    width: '85%',
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginTop: 8,
  },
  modalText: {
    fontSize: 15,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  closeButton: {
    backgroundColor: 'rgba(197, 138, 26, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: ACCENT_GOLD,
  },
  closeButtonText: {
    color: ACCENT_GOLD,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})
