import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert, View, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CarAnalysisService } from '../services/CarAnalysisService';
import { palette } from '../theme/palette';

const ImageAnalysisButton = ({
  imageUri,
  onAnalysisComplete,
  onDescriptionGenerated,
  style,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getMimeType = (uri) => {
    const extension = uri.split('.').pop().toLowerCase();
    if (extension === 'png') return 'image/png';
    if (extension === 'heic') return 'image/heic';
    if (extension === 'webp') return 'image/webp';
    return 'image/jpeg';
  };

  const handlePress = async () => {
    if (!imageUri) {
      Alert.alert('Missing Image', 'Please add a car photo first.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const mimeType = getMimeType(imageUri);

      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      const analysisResult = await CarAnalysisService.analyzeCarImage(base64Image, mimeType);
      const description = await CarAnalysisService.generateCarDescription(analysisResult);

      onAnalysisComplete?.(analysisResult);
      onDescriptionGenerated?.(description);

      // Simple alert
      const make = analysisResult?.make;
      const model = analysisResult?.model;
      const message = make || model ? `${make || ''} ${model || ''}`.trim() : 'Car not identified';

    } catch (error) {
      console.error('Error in button component:', error);

      let userMessage = 'An error occurred during analysis.';
      if (error?.message?.includes('400')) {
        userMessage = 'The image could not be processed (unsupported format or image too large).';
      } else if (error?.message?.includes('Clé API') || error?.message?.includes('API Key')) {
        userMessage = 'API configuration issue.';
      } else if (error?.message?.includes('Network')) {
        userMessage = 'Internet connection error.';
      }

      Alert.alert('Oops!', userMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={isAnalyzing}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <LinearGradient
          colors={isAnalyzing ? [palette.disabled, palette.disabled] : [palette.accent, palette.mustard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {isAnalyzing ? (
            <>
              <ActivityIndicator color={palette.textPrimary} size="small" style={{ marginRight: 8 }} />
              <Text style={styles.text}>Analyzing...</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color={palette.background} style={{ marginRight: 6 }} />
              <Text style={styles.text}>AI Scan</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  touchable: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    color: palette.background,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

export default ImageAnalysisButton;