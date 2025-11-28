import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../util/supabase'

const CLOUD_NAME = "di7ioytqx"
const UPLOAD_PRESET = "vehiculos_upload"

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
    }
  }

  const uploadToCloudinary = async (uri) => {
    try {
      const data = new FormData()
      data.append("file", { uri, type:"image/jpeg", name:`vehiculo_${Date.now()}.jpg` })
      data.append("upload_preset", UPLOAD_PRESET)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method:"POST",
        body:data
      })

      const json = await res.json()
      return json.secure_url ?? null

    } catch {
      return null
    }
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) return setError("Debes iniciar sesión")
    
    const payload = validateForm()
    if (!payload) return

    setSubmitting(true); setError(null); setSuccessMessage(null)

    try {
      let imageUrl = null

      if (image) {
        imageUrl = await uploadToCloudinary(image)
        if (!imageUrl) throw new Error("Error subiendo imagen")
      }

      const { error: insertError } = await supabase.from("listings").insert({
        ...payload,
        user_id:user.id,
        images: imageUrl ? [imageUrl] : [],
        is_active:true,
      })

      if (insertError) throw insertError

      setForm(createInitialForm())
      setImage(null)
      setSuccessMessage("Publicado correctamente.")

    } catch (e) {
      setError("Error al publicar. Inténtalo más tarde.")
    } finally {
      setSubmitting(false)
    }
  }

  return {
    form, image, setImage, submitting, error,
    successMessage, activePicker, isAuthenticated,
    handleChange, togglePicker, handleOptionSelect, handleSubmit,
  }
}
