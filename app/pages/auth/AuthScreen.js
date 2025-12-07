import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { loginScreenStyles } from './AuthStyles'
import { useLogin } from './useAuth'

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
    acceptedTerms,
    setAcceptedTerms,
    handleSubmit,
    toggleAuthMode,
  } = useLogin()

  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [repeatPassword, setRepeatPassword] = useState('')

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header with gradient */}
        <LinearGradient
          colors={['#2D2D2D', '#1A1A1A', 'rgba(187, 126, 29, 0.8)', '#BB7E1D']}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.header}
        >
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.revvolText}>REVVOL</Text>
        </LinearGradient>

        {/* Social Login Buttons */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialLabel}>
            {isSignup ? 'Sign In with' : 'Or Log In with'}
          </Text>
          <View style={styles.socialButtonsRow}>
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#F7F7F0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="#F7F7F0" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.topRightButton}
              onPress={toggleAuthMode}
            >
              <Text style={styles.buttonText}>
                {isSignup ? 'Log In' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{isSignup ? 'Sign In' : 'Log In'}</Text>

          {/* Email/User Input */}
          <TextInput
            style={styles.input}
            placeholder={isSignup ? 'E-Mail' : 'User or E-mail'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#BB7E1D"
          />

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#BB7E1D"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#BB7E1D"
              />
            </TouchableOpacity>
          </View>

          {/* Repeat Password for Signup */}
          {isSignup && (
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Repeat password"
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                secureTextEntry={!showRepeatPassword}
                placeholderTextColor="#BB7E1D"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowRepeatPassword(!showRepeatPassword)}
              >
                <Ionicons
                  name={showRepeatPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#BB7E1D"
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Terms checkbox for signup */}
          {isSignup && (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={16} color="#1A1A1A" />
                )}
              </View>
              <Text style={styles.checkboxText}>
                I confirm that I accept Revvol's Terms and Conditions, that I have read the Privacy Policy, and that I am at least 18 years old.
              </Text>
            </TouchableOpacity>
          )}

          {error && <Text style={styles.error}>{error}</Text>}
          {message && <Text style={styles.success}>{message}</Text>}

          {/* Submit Button - centered below inputs */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              Next
            </Text>
          </TouchableOpacity>

          {/* Need help link */}
          <TouchableOpacity>
            <Text style={styles.needHelp}>Need help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = loginScreenStyles
