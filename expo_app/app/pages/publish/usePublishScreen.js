import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../util/supabase'

const REQUIRED_FIELDS = [
  'title',
  'description',
  'price',
  'make',
  'model',
  'year',
  'mileage',
  'fuel_type',
  'transmission',
  'doors',
  'color',
  'location',
]

const createInitialForm = () => ({
  title: '',
  description: '',
  price: '',
  make: '',
  model: '',
  year: '',
  mileage: '',
  fuel_type: '',
  transmission: '',
  doors: '',
  color: '',
  location: '',
})

const sanitizeNumber = (value) => {
  if (value === null || value === undefined) return null
  const normalized = String(value).replace(',', '.').trim()
  const numericValue = normalized ? Number(normalized) : null
  return Number.isFinite(numericValue) ? numericValue : null
}

const sanitizeInteger = (value) => {
  const numericValue = sanitizeNumber(value)
  return Number.isFinite(numericValue) ? Math.round(numericValue) : null
}

export const usePublishScreen = () => {
  const { user } = useAuth()

  const [form, setForm] = useState(createInitialForm)
  const [activePicker, setActivePicker] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submittingAction, setSubmittingAction] = useState(null)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // 👇 FALTABA ESTO
  const [image, setImage] = useState(null)

  const isAuthenticated = Boolean(user?.id)

  const requiredLabels = useMemo(
    () => ({
      title: 'Titulo',
      description: 'Descripcion',
      price: 'Precio',
      make: 'Marca',
      model: 'Modelo',
      year: 'Anio',
      mileage: 'Kilometraje',
      fuel_type: 'Combustible',
      transmission: 'Transmision',
      doors: 'Puertas',
      color: 'Color',
      location: 'Ubicacion',
    }),
    []
  )

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
    setSuccessMessage(null)
  }

  const togglePicker = (field) => {
    setActivePicker((prev) => (prev === field ? null : field))
    setError(null)
    setSuccessMessage(null)
  }

  const handleOptionSelect = (field, option) => {
    setForm((prev) => ({ ...prev, [field]: option }))
    setActivePicker(null)
  }

  const validateForm = () => {
    const missingFields = REQUIRED_FIELDS.filter((f) => {
      const v = form[f]
      return !(typeof v === 'string' ? v.trim() : v)
    })

    if (missingFields.length > 0) {
      const missingLabels = missingFields.map((f) => requiredLabels[f] || f)
      setError(`Completa los campos obligatorios: ${missingLabels.join(', ')}.`)
      return false
    }

    const priceValue = sanitizeNumber(form.price)
    const yearValue = sanitizeInteger(form.year)
    const mileageValue = sanitizeInteger(form.mileage)
    const doorsValue = sanitizeInteger(form.doors)

    if (priceValue === null) return setError('Introduce un precio valido.')
    if (yearValue === null || yearValue < 1900)
      return setError('Introduce un anio valido.')
    if (mileageValue === null || mileageValue < 0)
      return setError('Introduce un kilometraje valido.')
    if (doorsValue === null || doorsValue <= 0)
      return setError('Introduce un numero de puertas valido.')

    return {
      title: form.title.trim(),
      description: form.description.trim(),
      price: priceValue,
      make: form.make,
      model: form.model.trim(),
      year: yearValue,
      mileage: mileageValue,
      fuel_type: form.fuel_type,
      transmission: form.transmission,
      doors: doorsValue,
      color: form.color.trim(),
      location: form.location.trim(),

      // 👇 SE AGREGA LA IMAGEN AL PAYLOAD
      images: image ? [image] : [],
    }
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesion para publicar un anuncio.')
      return
    }

    const payload = validateForm()
    if (!payload) return

    setSubmitting(true)
    setSubmittingAction('publish')
    setError(null)
    setSuccessMessage(null)

    try {
      const { error: insertError } = await supabase.from('listings').insert({
        ...payload,
        user_id: user.id,
        is_active: true,
      })

      if (insertError) throw insertError

      setForm(createInitialForm())
      setImage(null) // limpiar imagen después de publicar
      setSuccessMessage('Anuncio publicado correctamente.')
    } catch (e) {
      console.error(e)
      setError('No fue posible publicar el anuncio. Intentalo de nuevo.')
    } finally {
      setSubmitting(false)
      setSubmittingAction(null)
    }
  }

  const handleSaveDraft = async () => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesion para guardar el borrador.')
      return
    }

    const payload = validateForm()
    if (!payload) return

    setSubmitting(true)
    setSubmittingAction('draft')
    setError(null)
    setSuccessMessage(null)

    try {
      const { error: insertError } = await supabase.from('listings').insert({
        ...payload,
        user_id: user.id,
        is_active: false,
      })

      if (insertError) throw insertError

      setSuccessMessage('Anuncio guardado como borrador.')
    } catch (e) {
      console.error(e)
      setError('No fue posible guardar el borrador. Intentalo de nuevo.')
    } finally {
      setSubmitting(false)
      setSubmittingAction(null)
    }
  }

  return {
    form,
    activePicker,
    submitting,
    submittingAction,
    error,
    successMessage,
    isAuthenticated,
    handleChange,
    togglePicker,
    handleOptionSelect,
    handleSubmit,
    handleSaveDraft,

    // 👇 Estos faltaban
    image,
    setImage,
  }
}
