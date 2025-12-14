import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import { chatStyles as styles } from './ChatStyles'
import { useChat } from './useChat'
import { palette } from '../../theme/palette'

const formatTime = iso => {
  if (!iso) return ''
  const date = new Date(iso)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const listRef = useRef(null)

  const params = route.params || {}
  const listingFromParams = params.listing
  const targetUserId = params.otherUserId || listingFromParams?.user_id || params.sellerId

  const {
    conversationId,
    conversation,
    messages,
    loading,
    sending,
    error,
    sendMessage,
  } = useChat({
    initialConversationId: params.conversationId,
    initialConversation: params.conversation,
    listing: listingFromParams,
    targetUserId,
  })

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true })
    }
  }, [messages])

  const handleSend = async () => {
    if (!message.trim()) return
    await sendMessage(message)
    setMessage('')
  }

  const counterpartName = useMemo(() => {
    return conversation?.otherUser?.full_name || params.sellerName || 'Utente'
  }, [conversation?.otherUser?.full_name, params.sellerName])

  const listingTitle = conversation?.listing?.title || listingFromParams?.title || 'Annuncio'
  const listingPrice = conversation?.listing?.price || listingFromParams?.price

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrapper}>
          <Text style={styles.errorText}>Effettua l&apos;accesso per chattare con i venditori.</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={palette.mustard} />
          <Text style={{ color: palette.textSecondary, marginTop: 10 }}>Caricamento chat...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={palette.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.counterpartRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(counterpartName || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.counterpartName} numberOfLines={1}>
              {counterpartName}
            </Text>
          </View>
          <View style={styles.listingRow}>
            <Text style={styles.listingTitle} numberOfLines={1}>
              {listingTitle}
            </Text>
            {listingPrice != null && (
              <Text style={styles.listingPrice}>€ {Number(listingPrice).toLocaleString('it-IT')}</Text>
            )}
          </View>
        </View>
      </View>

      {error && (
        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const isOwn = item.sender_id === user.id
            return (
              <View
                style={[
                  styles.messageContainer,
                  isOwn ? styles.outgoing : styles.incoming,
                ]}
              >
                <Text style={styles.messageText}>{item.content}</Text>
                <Text style={styles.timestamp}>{formatTime(item.created_at)}</Text>
              </View>
            )
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={44} color={palette.textMuted} />
              <Text style={styles.emptyText}>
                Inizia la conversazione con il venditore per ricevere maggiori dettagli.
              </Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Scrivi un messaggio..."
              placeholderTextColor={palette.textMuted}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSend}
              editable={!!conversationId && !sending}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!message.trim() || sending) && styles.disabledSend]}
              onPress={handleSend}
              disabled={!message.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color={palette.textPrimary} />
              ) : (
                <Ionicons name="send" size={18} color={palette.textPrimary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
