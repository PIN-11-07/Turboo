import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert, View, StyleSheet, Animated } from 'react-native';
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
  const [isSuccess, setIsSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const getMimeType = (uri) => {
    const extension = uri.split('.').pop().toLowerCase();
    if (extension === 'png') return 'image/png';
    if (extension === 'heic') return 'image/heic';
    if (extension === 'webp') return 'image/webp';
    return 'image/jpeg';
  };

  const [isPressedDown, setIsPressedDown] = useState(false);

  const handlePress = async () => {
    if (!imageUri) {
      Alert.alert('Missing Image', 'Please add a car photo first.');
      return;
    }

    setIsAnalyzing(true);
    setIsSuccess(false);

    try {
      const mimeType = getMimeType(imageUri);

      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      const analysisResult = await CarAnalysisService.analyzeCarImage(base64Image, mimeType);
      const description = await CarAnalysisService.generateCarDescription(analysisResult);

      onAnalysisComplete?.(analysisResult);
      onDescriptionGenerated?.(description);

      // Trigger success animation
      setIsSuccess(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

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
        onPressIn={() => setIsPressedDown(true)}
        onPressOut={() => setIsPressedDown(false)}
        disabled={isAnalyzing || isSuccess}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        {isSuccess ? (
          <LinearGradient
            colors={['#4CAF50', '#45a049']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.text}>Identified!</Text>
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.outlineButton,
              {
                borderColor: isPressedDown ? palette.champagne : palette.mustard,
                backgroundColor: isPressedDown ? 'rgba(225, 207, 170, 0.1)' : 'transparent',
              },
            ]}
          >
            {isAnalyzing ? (
              <>
                <ActivityIndicator
                  color={isPressedDown ? palette.champagne : palette.mustard}
                  size="small"
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.outlineText, { color: isPressedDown ? palette.champagne : palette.mustard }]}>
                  Analyzing...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="sparkles"
                  size={16}
                  color={isPressedDown ? palette.champagne : palette.mustard}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.outlineText, { color: isPressedDown ? palette.champagne : palette.mustard }]}>
                  AI Scan
                </Text>
              </>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: palette.darkGrey,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
  outlineButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 5,
  },
  text: {
    color: palette.darkGrey,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
    fontFamily: 'Baijamjuri-Regular',
  },
  outlineText: {
    fontWeight: '400',
    fontSize: 16,
    fontFamily: 'Baijamjuri-Regular',
  },
});

export default ImageAnalysisButton;