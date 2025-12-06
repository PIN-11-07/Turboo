import { supabase } from '../utils/supabase'

export const processPurchaseTransaction = async ({
  buyerId,
  sellerId,
  listingId,
  price,
  feePercent = 5,
}) => {
  const params = {
    buyer_id: buyerId,
    seller_id: sellerId,
    price: Number(price),
    fee_percent: Number(feePercent),
  }

  if (listingId) {
    params.listing_id = listingId
  }

  const { data, error } = await supabase.rpc('process_vehicle_purchase', params)

  if (error) {
    throw error
  }

  return data
}
