import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { supabase } from '../../utils/supabase'
import { processPurchaseTransaction } from '../../services/payments'
import { useAuth } from '../../context/AuthContext'

const PLATFORM_FEE_PERCENTAGE = 5

const normalizeMoney = (value) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return 0
  }
  return Number(numeric.toFixed(2))
}

const sanitizeCardNumber = (value) => value.replace(/\s+/g, '')

export const usePurchaseScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { user } = useAuth()

  const listingId = route.params?.listingId ?? route.params?.listing?.id ?? null
  const initialListing = route.params?.listing ?? null

  const [listing, setListing] = useState(initialListing)
  const [sellerProfile, setSellerProfile] = useState(null)
  const [buyerBalance, setBuyerBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [cardData, setCardData] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvc: '',
  })

  const sellerName = useMemo(
    () =>
      typeof sellerProfile?.full_name === 'string' && sellerProfile.full_name.trim()
        ? sellerProfile.full_name
        : null,
    [sellerProfile?.full_name]
  )

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (!listingId) {
        if (isMounted) {
          setError('No se ha indicado el anuncio a comprar.')
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      try {
        let resolvedListing = initialListing

        if (
          !resolvedListing ||
          !resolvedListing.user_id ||
          resolvedListing.price == null ||
          !resolvedListing.title
        ) {
          const { data, error: listingError } = await supabase
            .from('listings')
            .select('id, title, price, user_id')
            .eq('id', listingId)
            .maybeSingle()

          if (listingError) {
            throw listingError
          }

          resolvedListing = data
        }

        if (!resolvedListing) {
          throw new Error('No se encontró el anuncio indicado.')
        }

        const sellerId = resolvedListing.user_id

        const sellerPromise = supabase
          .from('profiles')
          .select('full_name, saldo')
          .eq('id', sellerId)
          .maybeSingle()

        const buyerPromise = user?.id
          ? supabase
              .from('profiles')
              .select('full_name, saldo')
              .eq('id', user.id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null })

        const [{ data: sellerData, error: sellerError }, { data: buyerData, error: buyerError }] =
          await Promise.all([sellerPromise, buyerPromise])

        if (sellerError) {
          throw sellerError
        }
        if (buyerError) {
          throw buyerError
        }

        if (!isMounted) {
          return
        }

        setListing(resolvedListing)
        setSellerProfile({
          full_name: sellerData?.full_name ?? null,
          saldo: normalizeMoney(sellerData?.saldo),
        })
        setBuyerBalance(
          buyerData && buyerData.saldo != null ? normalizeMoney(buyerData.saldo) : null
        )
      } catch (fetchError) {
        console.error(fetchError)
        if (isMounted) {
          setError('No es posible preparar el pago ahora mismo.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [initialListing, listingId, user?.id])

  const totals = useMemo(() => {
    const price = normalizeMoney(listing?.price)
    const fee = normalizeMoney((price * PLATFORM_FEE_PERCENTAGE) / 100)
    const sellerReceives = Math.max(0, normalizeMoney(price - fee))
    const nextBuyerBalance =
      buyerBalance != null ? normalizeMoney(buyerBalance - price) : buyerBalance

    return { price, fee, sellerReceives, nextBuyerBalance }
  }, [buyerBalance, listing?.price])

  const isOwner = useMemo(() => {
    if (!listing?.user_id || !user?.id) {
      return false
    }
    return listing.user_id === user.id
  }, [listing?.user_id, user?.id])

  const payingWithBalanceOnly =
    buyerBalance != null && totals.price > 0 && buyerBalance >= totals.price

  const cardIsValid = useMemo(() => {
    if (payingWithBalanceOnly) {
      return true
    }

    const number = sanitizeCardNumber(cardData.number)
    return (
      cardData.holder.trim().length > 3 &&
      number.length >= 12 &&
      cardData.expiry.trim().length >= 4 &&
      cardData.cvc.trim().length >= 3
    )
  }, [cardData.cvc, cardData.expiry, cardData.holder, cardData.number, payingWithBalanceOnly])

  const canSubmit =
    Boolean(user && listing && totals.price > 0 && !loading && !isOwner) &&
    cardIsValid &&
    buyerBalance != null &&
    buyerBalance >= totals.price &&
    !submitting

  const disableReason = useMemo(() => {
    if (loading) {
      return 'Cargando información del anuncio...'
    }
    if (!listing) {
      return 'No se encontró el anuncio que quieres comprar.'
    }
    if (!user) {
      return 'Inicia sesión para continuar con el pago.'
    }
    if (isOwner) {
      return 'No puedes comprar tu propio anuncio.'
    }
    if (totals.price <= 0) {
      return 'El precio configurado no es válido.'
    }
    if (buyerBalance == null) {
      return 'No se pudo obtener tu saldo disponible.'
    }
    if (buyerBalance < totals.price) {
      return 'Tu saldo no es suficiente para este pago.'
    }
    if (!cardIsValid) {
      return 'Completa los datos de la tarjeta para habilitar el pago.'
    }
    if (submitting) {
      return 'Procesando pago...'
    }
    return null
  }, [
    buyerBalance,
    cardIsValid,
    isOwner,
    listing,
    loading,
    submitting,
    totals.price,
    user,
  ])

  const setCardField = (field, value) => {
    setCardData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const goToConfirmation = useCallback(
    (nextBuyerBalance, nextSellerBalance) => {
      setSubmitting(false)
      navigation.replace('PurchaseConfirmation', {
        listing,
        sellerName,
        totals: {
          price: totals.price,
          fee: totals.fee,
          sellerReceives: totals.sellerReceives,
        },
        buyerBalance: nextBuyerBalance,
        sellerBalance: nextSellerBalance,
      })
    },
    [listing, navigation, sellerName, totals.fee, totals.price, totals.sellerReceives]
  )

  const handleConfirmPurchase = async () => {
    if (!listing) {
      setError('El anuncio no está disponible.')
      return
    }

    if (!user) {
      setError('Inicia sesión para continuar con el pago.')
      return
    }

    if (isOwner) {
      setError('No puedes comprar tu propio anuncio.')
      return
    }

    if (!cardIsValid) {
      setError('Completa los datos de la tarjeta para seguir.')
      return
    }

    const price = totals.price

    if (price <= 0) {
      setError('El precio configurado no es válido.')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const rpcResult = await processPurchaseTransaction({
        buyerId: user.id,
        sellerId: listing.user_id,
        listingId,
        price,
        feePercent: PLATFORM_FEE_PERCENTAGE,
      })

      const nextBuyer =
        rpcResult && rpcResult.buyer_balance != null
          ? normalizeMoney(rpcResult.buyer_balance)
          : totals.nextBuyerBalance
      const nextSeller =
        rpcResult && rpcResult.seller_balance != null
          ? normalizeMoney(rpcResult.seller_balance)
          : normalizeMoney((sellerProfile?.saldo ?? 0) + totals.sellerReceives)

      setBuyerBalance(nextBuyer)
      setSellerProfile((prev) => ({
        ...(prev ?? {}),
        saldo: nextSeller,
      }))
      setListing((prev) => (prev ? { ...prev, is_active: false } : prev))
      goToConfirmation(nextBuyer, nextSeller)
      return
    } catch (rpcError) {
      console.error('process_vehicle_purchase RPC error', rpcError)
      const message = (rpcError?.message || '').toLowerCase()

      if (
        rpcError?.code === 'PGRST204' ||
        (message.includes('process_vehicle_purchase') && message.includes('function'))
      ) {
        setError(
          'Falta la función SQL "process_vehicle_purchase" en Supabase. Añádela con el snippet indicado para habilitar la transferencia de saldo.'
        )
        setSubmitting(false)
        return
      }

      if (message.includes('permission') || message.includes('rls')) {
        setError(
          'Supabase bloqueó la transferencia por políticas de seguridad. Añade la función "process_vehicle_purchase" con SECURITY DEFINER o ajusta las RLS.'
        )
        setSubmitting(false)
        return
      }
    }

    try {
      const [
        { data: buyerData, error: buyerError },
        { data: sellerData, error: sellerError },
      ] = await Promise.all([
        supabase.from('profiles').select('saldo').eq('id', user.id).maybeSingle(),
        supabase.from('profiles').select('saldo').eq('id', listing.user_id).maybeSingle(),
      ])

      if (buyerError) {
        throw buyerError
      }
      if (sellerError) {
        throw sellerError
      }

      const currentBuyerBalance = normalizeMoney(buyerData?.saldo)
      const currentSellerBalance = normalizeMoney(sellerData?.saldo)

      if (currentBuyerBalance < price) {
        setError('Tu saldo no es suficiente para cubrir este pago.')
        setSubmitting(false)
        return
      }

      const sellerPayout = totals.sellerReceives
      const nextBuyer = normalizeMoney(currentBuyerBalance - price)
      const nextSeller = normalizeMoney(currentSellerBalance + sellerPayout)

      const {
        data: updatedBuyer,
        error: buyerUpdateError,
      } = await supabase
        .from('profiles')
        .update({ saldo: nextBuyer })
        .eq('id', user.id)
        .select('saldo')
        .maybeSingle()

      if (buyerUpdateError) {
        throw buyerUpdateError
      }

      const {
        data: updatedSeller,
        error: sellerUpdateError,
      } = await supabase
        .from('profiles')
        .update({ saldo: nextSeller })
        .eq('id', listing.user_id)
        .select('saldo')
        .maybeSingle()

      if (sellerUpdateError) {
        await supabase.from('profiles').update({ saldo: currentBuyerBalance }).eq('id', user.id)
        throw sellerUpdateError
      }

      setBuyerBalance(
        updatedBuyer && updatedBuyer.saldo != null
          ? normalizeMoney(updatedBuyer.saldo)
          : nextBuyer
      )
      setSellerProfile((prev) => ({
        ...(prev ?? {}),
        saldo:
          updatedSeller && updatedSeller.saldo != null
            ? normalizeMoney(updatedSeller.saldo)
            : nextSeller,
      }))

      goToConfirmation(nextBuyer, nextSeller)
    } catch (confirmError) {
      console.error(confirmError)
      const message = (confirmError?.message || '').toLowerCase()
      if (message.includes('permission') || message.includes('rls') || message.includes('policy')) {
        setError(
          'Supabase bloqueó la actualización de saldo (RLS). Asegúrate de tener la función process_vehicle_purchase o políticas que permitan la transferencia.'
        )
      } else {
        setError('No se pudo completar el pago. Inténtalo de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoBack = () => navigation.goBack()

  return {
    listing,
    sellerProfile,
    buyerBalance,
    loading,
    submitting,
    error,
    successMessage,
    cardData,
    totals,
    canSubmit,
    isOwner,
    setCardField,
    handleConfirmPurchase,
    handleGoBack,
    disableReason,
    payingWithBalanceOnly,
  }
}
