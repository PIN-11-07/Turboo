import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { loginScreenStyles } from './AuthStyles'
import { useLogin } from './useLogin'

export default function LoginScreen() {
  const {
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
  } = useLogin()

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
