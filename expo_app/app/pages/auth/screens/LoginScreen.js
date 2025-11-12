import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useAuth } from '../../../context/AuthContext'
import { LinearGradient } from 'expo-linear-gradient'
import { loginScreenStyles } from '../AuthStyles'

export default function LoginScreen() {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = async () => {
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
    if (error) setError(error.message)
  }

  const toggleAuthMode = () => {
    setError(null)
    setMessage(null)
    setName('')
    setIsSignup((prev) => !prev)
  }

  return (
    <LinearGradient colors={['#4C7EFF', '#6AD7F2']} style={styles.container}>
      {/* Usa una vista simple en lugar de KeyboardAvoidingView para que la tarjeta no se mueva cuando aparece el teclado */}
      <View style={styles.innerContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {isSignup ? 'Crea una cuenta' : 'Inicia sesión'}
          </Text>

          {isSignup && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor="#aaa"
                textContentType="name"
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />

          {error && <Text style={styles.error}>{error}</Text>}
          {message && <Text style={styles.success}>{message}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {isSignup ? 'Regístrate' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleAuthMode}>
            <Text style={styles.link}>
              {isSignup
                ? '¿Ya tienes una cuenta? Inicia sesión'
                : '¿No tienes una cuenta? Regístrate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = loginScreenStyles
