import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { useAuth } from '../../context/AuthContext'

const getFirstImage = listing => {
  if (!listing) return null
  if (Array.isArray(listing.images) && listing.images.length > 0) {
    return listing.images[0]
  }
  return null
}

const sortParticipants = (a, b) => {
  const pair = [a, b].sort()
  return { user_one_id: pair[0], user_two_id: pair[1] }
}

export const useChat = ({ initialConversationId, listing, listingId, targetUserId, initialConversation }) => {
  const { user } = useAuth()
  const [conversationId, setConversationId] = useState(initialConversationId || initialConversation?.id || null)
  const [conversation, setConversation] = useState(initialConversation || null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const channelRef = useRef(null)

  const removeChannel = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  const loadMessages = useCallback(async convId => {
    const { data, error: fetchError } = await supabase
      .from('chat_messages')
      .select('id, conversation_id, sender_id, content, created_at')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })

    if (!fetchError && data) {
      setMessages(data)
    }
  }, [])

  const subscribeToMessages = useCallback(convId => {
    removeChannel()

    const channel = supabase
      .channel(`chat-messages-${convId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${convId}`,
      }, payload => {
        const incoming = payload.new
        setMessages(prev => {
          if (prev.some(m => m.id === incoming.id)) {
            return prev
          }
          return [...prev, incoming].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        })
      })
      .subscribe()

    channelRef.current = channel
  }, [removeChannel])

  const hydrateConversation = useCallback(async (convId, baseRow) => {
    const { data: conversationRow, error: conversationError } = baseRow
      ? { data: baseRow, error: null }
      : await supabase
        .from('chat_conversations')
        .select(
          'id, listing_id, user_one_id, user_two_id, listing_title, listing_price, listing_image, last_message_text, last_message_at, last_message_sender_id'
        )
        .eq('id', convId)
        .maybeSingle()

    if (conversationError || !conversationRow) {
      setError('Impossibile caricare la conversazione.')
      setLoading(false)
      return
    }

    const otherId = conversationRow.user_one_id === user?.id
      ? conversationRow.user_two_id
      : conversationRow.user_one_id

    const [profileResult, listingResult] = await Promise.all([
      otherId
        ? supabase
          .from('profiles')
          .select('id, full_name, profile_image_url')
          .eq('id', otherId)
          .maybeSingle()
        : Promise.resolve({ data: null }),
      listing || conversationRow.listing_title
        ? Promise.resolve({ data: listing || null })
        : supabase
          .from('listings')
          .select('id, title, price, images, user_id')
          .eq('id', conversationRow.listing_id)
          .maybeSingle(),
    ])

    const listingData = listingResult?.data || (conversationRow.listing_title
      ? {
        id: conversationRow.listing_id,
        title: conversationRow.listing_title,
        price: conversationRow.listing_price,
        images: conversationRow.listing_image ? [conversationRow.listing_image] : [],
      }
      : null)

    setConversation({
      ...conversationRow,
      otherUserId: otherId,
      otherUser: profileResult?.data || null,
      listing: listingData,
    })

    await loadMessages(convId)
    subscribeToMessages(convId)
    setLoading(false)
  }, [loadMessages, subscribeToMessages, user?.id, listing])

  const ensureConversation = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    if (conversationId) {
      await hydrateConversation(conversationId, initialConversation || null)
      return
    }

    const finalListingId = listingId || listing?.id
    const participantId = targetUserId || listing?.user_id

    if (!finalListingId || !participantId) {
      setError('Mancano i dati per avviare la chat.')
      setLoading(false)
      return
    }

    const { user_one_id, user_two_id } = sortParticipants(user.id, participantId)

    try {
      const { data: existingConversation, error: fetchError } = await supabase
        .from('chat_conversations')
        .select(
          'id, listing_id, user_one_id, user_two_id, listing_title, listing_price, listing_image, last_message_text, last_message_at, last_message_sender_id'
        )
        .eq('listing_id', finalListingId)
        .eq('user_one_id', user_one_id)
        .eq('user_two_id', user_two_id)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      if (existingConversation) {
        setConversationId(existingConversation.id)
        await hydrateConversation(existingConversation.id, existingConversation)
        return
      }

      const insertPayload = {
        listing_id: finalListingId,
        user_one_id,
        user_two_id,
        listing_title: listing?.title || null,
        listing_price: listing?.price || null,
        listing_image: getFirstImage(listing),
        last_message_at: new Date().toISOString(),
      }

      const { data: createdConversation, error: insertError } = await supabase
        .from('chat_conversations')
        .insert(insertPayload)
        .select(
          'id, listing_id, user_one_id, user_two_id, listing_title, listing_price, listing_image, last_message_text, last_message_at, last_message_sender_id'
        )
        .maybeSingle()

      if (insertError) {
        throw insertError
      }

      if (createdConversation) {
        setConversationId(createdConversation.id)
        await hydrateConversation(createdConversation.id, createdConversation)
      } else {
        setLoading(false)
      }
    } catch (err) {
      console.error('Chat initialization error', err)
      setError('Non e stato possibile avviare la chat.')
      setLoading(false)
    }
  }, [
    user,
    conversationId,
    hydrateConversation,
    listingId,
    listing,
    targetUserId,
    initialConversation,
  ])

  useEffect(() => {
    ensureConversation()

    return () => {
      removeChannel()
    }
  }, [ensureConversation, removeChannel])

  const sendMessage = useCallback(async text => {
    if (!conversationId || !user) return
    const cleaned = text.trim()
    if (!cleaned) return

    setSending(true)
    setError(null)

    try {
      const { data, error: sendError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: cleaned,
        })
        .select('id, conversation_id, sender_id, content, created_at')
        .maybeSingle()

      if (sendError) throw sendError

      if (data) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev
          return [...prev, data]
        })

        await supabase
          .from('chat_conversations')
          .update({
            last_message_text: cleaned,
            last_message_at: data.created_at || new Date().toISOString(),
            last_message_sender_id: user.id,
          })
          .eq('id', conversationId)
      }
    } catch (err) {
      console.error('Send message error', err)
      setError('Invio del messaggio non riuscito.')
    } finally {
      setSending(false)
    }
  }, [conversationId, user])

  return {
    conversationId,
    conversation,
    messages,
    loading,
    sending,
    error,
    sendMessage,
  }
}
