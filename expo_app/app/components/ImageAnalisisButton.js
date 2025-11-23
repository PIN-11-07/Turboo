import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert, View } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { CarAnalysisService } from '../services/CarAnalysisService';

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
        encoding: 'base64', // Safe cross-version encoding string
      });

      const analysisResult = await CarAnalysisService.analyzeCarImage(base64Image, mimeType);
      const description = await CarAnalysisService.generateCarDescription(analysisResult);

      onAnalysisComplete?.(analysisResult);
      onDescriptionGenerated?.(description);

      // Simple alert
      const make = analysisResult?.make;
      const model = analysisResult?.model;
      const message = make || model ? `${make || ''} ${model || ''}`.trim() : 'Car not identified';
      
      Alert.alert('Analysis complete', message);
      
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
    <View style={{ width: '100%' }}>
      <TouchableOpacity
        style={[
          {
            backgroundColor: isAnalyzing ? '#059669' : '#10B981',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            opacity: isAnalyzing ? 0.8 : 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          style,
        ]}
        onPress={handlePress}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <ActivityIndicator color="#FFFFFF" style={{ marginRight: 10 }} />
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Analyzing...</Text>
          </>
        ) : (
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>
            Auto-fill with AI
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImageAnalysisButton;