import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { LinearGradient } from 'expo-linear-gradient'

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    // mueve ligeramente la tarjeta hacia arriba del centro; ajusta translateY para más/menos desplazamiento
    transform: [{ translateY: -90 }],
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4C7EFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  success: {
    color: '#0f9d58',
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: '#4C7EFF',
  },
})
