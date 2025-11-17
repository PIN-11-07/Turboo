import { useCallback, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export const useLoginScreen = () => {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = useCallback(async () => {
    setError(null)
    setMessage(null)

    if (isSignup) {
      const trimmedName = name.trim()
      if (!trimmedName) {
        setError('Ingresa tu nombre para completar el registro.')
        return
      }
      const { error } = await signUp(email, password, trimmedName)
      if (error) {
        setError(error.message)
      } else {
        setMessage(
          '¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta.'
        )
        setIsSignup(false)
        setPassword('')
        setName('')
      }
      return
    }

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    }
  }, [email, isSignup, name, password, signIn, signUp])

  const toggleAuthMode = useCallback(() => {
    setError(null)
    setMessage(null)
    setName('')
    setIsSignup((prev) => !prev)
  }, [])

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    error,
    message,
    isSignup,
    handleSubmit,
    toggleAuthMode,
  }
}
