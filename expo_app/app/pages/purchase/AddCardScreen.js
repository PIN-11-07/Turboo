import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { addCardStyles as styles } from './AddCardStyles'
import { palette } from '../../theme/palette'

export default function AddCardScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const { onSave } = route.params || {}

    const [cardNumber, setCardNumber] = useState('')
    const [cardHolder, setCardHolder] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')

    const handleSave = () => {
        // Basic validation
        if (!cardNumber || !cardHolder || !expiry || !cvc) {
            // In a real app, show error
            return
        }

        const newCard = {
            id: Date.now().toString(),
            number: cardNumber,
            holder: cardHolder,
            expiry,
            cvc,
            brand: 'VISA', // Mock brand
            last4: cardNumber.slice(-4),
        }

        if (onSave) {
            onSave(newCard)
        }
        navigation.goBack()
    }

    const formatCardNumber = (text) => {
        const cleaned = text.replace(/\D/g, '')
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
        setCardNumber(formatted.slice(0, 19))
    }

    const formatExpiry = (text) => {
        const cleaned = text.replace(/\D/g, '')
        if (cleaned.length >= 2) {
            setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`)
        } else {
            setExpiry(cleaned)
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color={palette.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>ADD CREDIT CARD</Text>
                    </View>

                    {/* Card Preview */}
                    <View style={styles.cardPreviewContainer}>
                        <LinearGradient
                            colors={['#463310', '#2A200A']} // Dark gold/brown gradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardGradient}
                        >
                            <View style={styles.cardTopRow}>
                                <Ionicons name="card-outline" size={32} color={palette.textPrimary} />
                                <Text style={styles.cardBrand}>CARD</Text>
                            </View>

                            <Text style={styles.cardNumberPreview}>
                                {cardNumber || '.... .... .... ....'}
                            </Text>

                            <View style={styles.cardBottomRow}>
                                <View>
                                    <Text style={styles.cardLabel}>Cardholder</Text>
                                    <Text style={styles.cardValue}>
                                        {cardHolder || 'NAME SURNAME'}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.cardLabel}>Valid until</Text>
                                    <Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <Text style={styles.sectionTitle}>Add a new Credit Card</Text>

                    {/* Scan Button */}
                    <TouchableOpacity style={styles.scanButton}>
                        <Ionicons name="scan-outline" size={24} color={palette.mustard} />
                        <Text style={styles.scanButtonText}>Scan Card</Text>
                    </TouchableOpacity>

                    {/* Form */}
                    <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>Card number*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="1234 5678 9012 3456"
                            placeholderTextColor={palette.textMuted}
                            keyboardType="number-pad"
                            value={cardNumber}
                            onChangeText={formatCardNumber}
                            maxLength={19}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>Cardholder*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full name"
                            placeholderTextColor={palette.textMuted}
                            value={cardHolder}
                            onChangeText={setCardHolder}
                            autoCapitalize="characters"
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.rowItem}>
                            <Text style={styles.inputLabel}>Valid until*</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="MM/YY"
                                placeholderTextColor={palette.textMuted}
                                keyboardType="number-pad"
                                value={expiry}
                                onChangeText={formatExpiry}
                                maxLength={5}
                            />
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={styles.inputLabel}>CVV*</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="123"
                                placeholderTextColor={palette.textMuted}
                                keyboardType="number-pad"
                                value={cvc}
                                onChangeText={setCvc}
                                maxLength={4}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save card</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
