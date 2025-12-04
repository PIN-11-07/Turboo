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
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleSubmit = useCallback(async () => {
    setError(null)
    setMessage(null)

    if (isSignup) {
      if (!acceptedTerms) {
        setError('You must accept the Terms and Conditions to continue.')
        return
      }
      const { error } = await signUp(email, password, email)
      if (error) {
        setError(error.message)
      } else {
        setMessage(
          'Registration successful! Check your email to confirm your account.'
        )
        setIsSignup(false)
        setPassword('')
        setName('')
        setAcceptedTerms(false)
      }
      return
    }

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    }
  }, [email, isSignup, name, password, acceptedTerms, signIn, signUp])

  const toggleAuthMode = useCallback(() => {
    setError(null)
    setMessage(null)
    setName('')
    setAcceptedTerms(false)
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
    acceptedTerms,
    setAcceptedTerms,
    handleSubmit,
    toggleAuthMode,
  }
}
