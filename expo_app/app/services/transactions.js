import { supabase } from '../util/supabase'

/**
 * Récupère l'historique des transactions d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Liste des transactions avec les détails du listing et des profils
 */
export const getUserTransactionHistory = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required')
  }

  // D'abord récupérer les transactions
  const { data: transactionsData, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    throw error
  }

  // Ensuite récupérer les détails des listings et profils séparément
  const formattedTransactions = []
  
  for (const transaction of transactionsData || []) {
    // Récupérer le listing (même s'il est inactif)
    const { data: listingData, error: listingError } = await supabase
      .from('listings')
      .select('id, title, make, model, year, images, color, fuel_type, is_active')
      .eq('id', transaction.listing_id)
      .maybeSingle()

    if (listingError) {
      console.error('Error fetching listing:', listingError)
    }

    // Si le listing n'existe pas, créer un objet par défaut
    const safeListing = listingData || {
      id: transaction.listing_id,
      title: 'Vehículo no disponible',
      make: null,
      model: null,
      year: null,
      images: [],
      color: null,
      fuel_type: null
    }

    // Récupérer les profils
    const { data: buyerProfile } = await supabase
      .from('profiles')
      .select('id, full_name, profile_image_url')
      .eq('id', transaction.buyer_id)
      .single()

    const { data: sellerProfile } = await supabase
      .from('profiles')
      .select('id, full_name, profile_image_url')
      .eq('id', transaction.seller_id)
      .single()

    formattedTransactions.push({
      ...transaction,
      listing: safeListing, // Utilise safeListing au lieu de listingData
      buyer_profile: buyerProfile,
      seller_profile: sellerProfile,
      counterpart: transaction.transaction_type === 'purchase' ? sellerProfile : buyerProfile,
      formattedDate: new Date(transaction.created_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      formattedPrice: `€ ${Number(transaction.price).toLocaleString('es-ES')}`,
    })
  }

  return formattedTransactions
}