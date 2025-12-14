import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { useAuth } from '../../context/AuthContext'

const shapeListingFromConversation = conversation => {
  if (!conversation) return null
  return {
    id: conversation.listing_id,
    title: conversation.listing_title || 'Annuncio',
    price: conversation.listing_price,
    images: conversation.listing_image ? [conversation.listing_image] : [],
  }
}

export const useMessages = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const hydrateWithProfiles = useCallback(
    async rows => {
      if (!rows || rows.length === 0) {
        setConversations([])
        return
      }

      const participantIds = rows
        .map(row => (row.user_one_id === user.id ? row.user_two_id : row.user_one_id))
        .filter(Boolean)

      const uniqueIds = Array.from(new Set(participantIds))

      const { data: profileRows } = await supabase
        .from('profiles')
        .select('id, full_name, profile_image_url')
        .in('id', uniqueIds)

      const profileMap = new Map((profileRows || []).map(profile => [profile.id, profile]))

      const hydrated = rows.map(row => {
        const otherUserId = row.user_one_id === user.id ? row.user_two_id : row.user_one_id
        return {
          ...row,
          otherUserId,
          otherUser: profileMap.get(otherUserId) || null,
          listing: shapeListingFromConversation(row),
        }
      })

      setConversations(hydrated)
    },
    [user?.id]
  )

  const fetchConversations = useCallback(
    async (isRefresh = false) => {
      if (!user) return
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('chat_conversations')
        .select(
          'id, listing_id, user_one_id, user_two_id, listing_title, listing_price, listing_image, last_message_text, last_message_at, last_message_sender_id'
        )
        .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })

      if (fetchError) {
        setError('Impossibile caricare le conversazioni.')
      } else {
        await hydrateWithProfiles(data || [])
      }

      setLoading(false)
      setRefreshing(false)
    },
    [user, hydrateWithProfiles]
  )

  useEffect(() => {
    fetchConversations()

    if (!user) return undefined

    const channel = supabase
      .channel(`chat-conversations-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations',
        },
        () => fetchConversations(true)
      )
      .subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user, fetchConversations])

  return {
    conversations,
    loading,
    refreshing,
    error,
    fetchConversations,
  }
}
