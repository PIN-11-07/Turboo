import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { palette } from '../theme/palette'

const DEFAULT_CAR_IMAGE = 'https://via.placeholder.com/80x60/333333/DDDDDD?text=Car'

const TransactionItem = ({ transaction, onPress, style }) => {
  const isOwnerPurchase = transaction.transaction_type === 'purchase'
  const listing = transaction.listing || {}
  const counterpart = transaction.counterpart || {}
  
  // Obtener la primera imagen del listing
  const getFirstImage = () => {
    if (!listing.images) return DEFAULT_CAR_IMAGE
    
    let images = listing.images
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images)
      } catch (e) {
        return DEFAULT_CAR_IMAGE
      }
    }
    
    if (Array.isArray(images) && images.length > 0) {
      return images[0]
    }
    
    return DEFAULT_CAR_IMAGE
  }

  const formatTitle = () => {
    // Priorité au titre du listing s'il existe
    if (listing.title && listing.title.trim()) {
      return listing.title
    }
    // Sinon, construire à partir de make/model/year si disponibles
    if (listing.make && listing.model && listing.year) {
      return `${listing.make} ${listing.model} (${listing.year})`
    }
    return 'Vehículo'
  }

  const getBadgeStyle = () => {
    if (isOwnerPurchase) {
      return {
        backgroundColor: palette.accent + '20', // Dorado con transparencia
        borderColor: palette.accent,
      }
    } else {
      return {
        backgroundColor: '#059669' + '20', // Verde con transparencia
        borderColor: '#059669',
      }
    }
  }

  const getBadgeTextColor = () => {
    return isOwnerPurchase ? palette.accent : '#059669'
  }

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: palette.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: palette.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
      onPress={() => onPress?.(transaction)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: getFirstImage() }}
        style={{
          width: 80,
          height: 60,
          borderRadius: 8,
          marginRight: 12,
          backgroundColor: palette.overlay,
        }}
        resizeMode="cover"
      />
      
      <View style={{ flex: 1 }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: 6 
        }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: palette.textPrimary,
              flex: 1,
              marginRight: 8,
            }}
            numberOfLines={1}
          >
            {formatTitle()}
          </Text>
          
          <View
            style={[
              {
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 16,
                borderWidth: 1,
                alignSelf: 'flex-start',
              },
              getBadgeStyle(),
            ]}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: getBadgeTextColor(),
                textAlign: 'center',
              }}
            >
              {isOwnerPurchase ? 'Comprado' : 'Vendido'}
            </Text>
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Feather 
            name={isOwnerPurchase ? "user" : "user-check"} 
            size={14} 
            color={palette.textMuted} 
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontSize: 14,
              color: palette.textMuted,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {isOwnerPurchase 
              ? `Comprado a ${counterpart.full_name || 'Usuario'}` 
              : `Vendido a ${counterpart.full_name || 'Usuario'}`
            }
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: palette.accent,
            }}
          >
            {transaction.formattedPrice}
          </Text>
          
          <Text
            style={{
              fontSize: 12,
              color: palette.textMuted,
            }}
          >
            {transaction.formattedDate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default TransactionItem