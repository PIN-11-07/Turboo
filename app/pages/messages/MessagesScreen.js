import React from 'react'
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { messagesStyles as styles } from './MessagesStyles'
import { useMessages } from './useMessages'
import { palette } from '../../theme/palette'

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

  const renderConversation = ({ item }) => {
    const name = item.otherUser?.full_name || 'User'
    const listingTitle = item.listing?.title || 'Listing'
    const lastMessage = item.last_message_text || 'Start the conversation'

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('Chat', {
            conversationId: item.id,
            conversation: item,
            otherUserId: item.otherUserId,
            listing: item.listing,
          })
        }
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.time}>{formatTime(item.last_message_at)}</Text>
          </View>
          <Text style={styles.listingTitle} numberOfLines={1}>{listingTitle}</Text>
          <Text style={styles.lastMessage} numberOfLines={2}>{lastMessage}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={palette.lightGrey} />
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={palette.mustard} />
          <Text style={{ color: palette.champagne, marginTop: 10 }}>Loading conversations...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Ionicons name="chatbubble-ellipses-outline" size={22} color={palette.mustard} style={{ marginRight: 8 }} />
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={renderConversation}
        contentContainerStyle={conversations.length === 0 ? styles.emptyState : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="mail-unread-outline" size={46} color={palette.lightGrey} />
            <Text style={styles.emptyText}>
              No chats yet. Contact a seller from a listing to start.
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={() => fetchConversations(true)}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
        refreshing={refreshing}
        onRefresh={() => fetchConversations(true)}
      />
    </SafeAreaView>
  )
}
