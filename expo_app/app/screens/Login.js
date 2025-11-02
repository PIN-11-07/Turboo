import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { LinearGradient } from 'expo-linear-gradient'

export default function LoginScreen() {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = async () => {
    setError(null)
    const { error } = isSignup
      ? await signUp(email, password)
      : await signIn(email, password)
    if (error) setError(error.message)
  }

  return (
    <LinearGradient colors={['#4C7EFF', '#6AD7F2']} style={styles.container}>
      {/* Use a plain View instead of KeyboardAvoidingView so the card doesn't shift when the keyboard appears */}
      <View style={styles.innerContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {isSignup ? 'Crea un account' : 'Accedi'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {isSignup ? 'Registrati' : 'Entra'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.link}>
              {isSignup
                ? 'Hai già un account? Accedi'
                : 'Non hai un account? Registrati'}
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
    // sposta leggermente la card verso l'alto rispetto al centro; regola translateY per più/meno spostamento
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
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: '#4C7EFF',
  },
})
