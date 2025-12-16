import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
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
  const insets = useSafeAreaInsets()
  const keyboardOffset = useRef(new Animated.Value(0)).current
  const [keyboardVisible, setKeyboardVisible] = useState(false)

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

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const handleShow = event => {
      const height = Math.max(event?.endCoordinates?.height || 0, 0)
      setKeyboardVisible(true)
      Animated.timing(keyboardOffset, {
        toValue: height,
        duration: Platform.OS === 'ios' ? event?.duration || 250 : 0,
        useNativeDriver: false,
      }).start()
    }

    const handleHide = event => {
      setKeyboardVisible(false)
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? event?.duration || 180 : 0,
        useNativeDriver: false,
      }).start()
    }

    const showSub = Keyboard.addListener(showEvent, handleShow)
    const hideSub = Keyboard.addListener(hideEvent, handleHide)

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [keyboardOffset])

  const handleSend = async () => {
    if (!message.trim()) return
    await sendMessage(message)
    setMessage('')
  }

  const counterpartName = useMemo(() => {
    return conversation?.otherUser?.full_name || params.sellerName || 'User'
  }, [conversation?.otherUser?.full_name, params.sellerName])

  const listingTitle = conversation?.listing?.title || listingFromParams?.title || 'Listing'
  const listingPrice = conversation?.listing?.price || listingFromParams?.price

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrapper}>
          <Text style={styles.errorText}>Log in to chat with sellers.</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={palette.mustard} />
          <Text style={{ color: palette.textSecondary, marginTop: 10 }}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
              <Text style={styles.listingPrice}>€ {Number(listingPrice).toLocaleString('en-US')}</Text>
            )}
          </View>
        </View>
      </View>

      {error && (
        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
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
                Start the conversation with the seller to get more details.
              </Text>
            </View>
          }
        />

        <Animated.View
          style={[
            styles.inputContainer,
            {
              paddingBottom: keyboardVisible ? 10 : Math.max(insets.bottom, 10),
              marginBottom: keyboardOffset,
            },
          ]}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Write a message..."
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
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}
