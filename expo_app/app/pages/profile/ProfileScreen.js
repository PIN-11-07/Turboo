import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import {
    getProfileById,
    updateProfile,
    getLikedCarsByUser,
    getPublishedCarsByUser,
    removeLike,
} from '../../services/users';
import { profileScreenStyles } from './profileStyles';
import { palette } from '../../theme/palette';
import CarItem from '../../components/CarItem';
import FavoriteButton, { subscribeToFavoriteStatus } from '../../components/FavoriteButton';
import { CLOUDINARY_CONFIG, uploadToCloudinary } from '../../config/cloudinary';

// Default avatar
const DEFAULT_AVATAR_URI =
    'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg';

// Temporary style for avatar edit overlay
const editableAvatarStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
};

// Reusable car component
const FALLBACK_CAR_IMAGE = require('../../../assets/icon.png');

const formatPrice = (value) => {
  const numericValue = Number(value)

  if (Number.isFinite(numericValue)) {
    return `€ ${numericValue.toLocaleString('es-ES')}`
  }

  if (typeof value === 'string' && value.trim()) {
    return value
  }

  return 'Precio a petición'
}

export default function ProfileScreen({ navigation }) {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('Chargement...');
    const [email, setEmail] = useState('Chargement...');
    const [saving, setSaving] = useState(false);
    const [newAvatarUri, setNewAvatarUri] = useState(null); 
    const [publishedCars, setPublishedCars] = useState([]);
    const [likedCars, setLikedCars] = useState([]);
    const [activeTab, setActiveTab] = useState('published');
    const joiningDate = 'octubre 2025';

    // Image handling
    const pickImageFromGallery = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permiso denegado',
                    'Necesitamos acceso a la galería. Por favor, verifica los permisos en la configuración del dispositivo.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (result.assets?.length > 0) {
                setNewAvatarUri(result.assets[0].uri);
            }
        } catch (err) {
            console.error('Error ImagePicker:', err);
            Alert.alert('Error', 'Imposible abrir la galeria.');
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (result.assets?.length > 0) {
            setNewAvatarUri(result.assets[0].uri);
        }
    };

    const promptImageSelection = () => {
        Alert.alert('Cambiar Foto de Perfil', '¿Cómo te gustaría seleccionar una foto?', [
            { text: 'Tomar Foto', onPress: takePhoto },
            { text: 'Desde Galería', onPress: pickImageFromGallery },
            { text: 'Cancelar', style: 'cancel' },
        ]);
    };

    const isFocused = useIsFocused();
    const [refreshPending, setRefreshPending] = useState(false);

    const fetchUserData = async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const uid = user?.id;
            if (!uid) {
                setFetchError('Usuario no autenticado.');
                return;
            }

            const userData = await getProfileById(uid);
            if (userData) {
                setProfile(userData);
                setName(userData.name || userData.full_name || 'Usuario');
                setEmail(user?.email || ''); // L'email vient toujours de auth.users
                setNewAvatarUri(userData.avatar_url ?? null);

                const [liked, published] = await Promise.all([
                    getLikedCarsByUser(uid),
                    getPublishedCarsByUser(uid),
                ]);
                setLikedCars(liked || []);
                setPublishedCars(published || []);
            } else {
                // Create basic profile if doesn't exist
                setProfile({ 
                    id: uid, 
                    name: user?.user_metadata?.full_name || 'Usuario',
                    avatar_url: null,
                    rating: 0 
                });
                setName(user?.user_metadata?.full_name || 'Usuario');
                setEmail(user?.email || ''); // L'email vient de auth.users
                
                const [liked, published] = await Promise.all([
                    getLikedCarsByUser(uid),
                    getPublishedCarsByUser(uid),
                ]);
                setLikedCars(liked || []);
                setPublishedCars(published || []);
            }
        } catch (error) {
            console.error('Erreur de récupération du profil :', error);
            setFetchError('Erreur de connexion à la base de données.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial load: fetch full profile and lists
        if (isFocused && user) {
            if (!profile) {
                fetchUserData();
                return;
            }

            // If we already have the profile, do a lightweight refresh depending on active tab
            const uid = user?.id;
            if (activeTab === 'favorites') {
                // refresh only favorites list for snappier UX
                getLikedCarsByUser(uid)
                    .then((liked) => setLikedCars(liked || []))
                    .catch((err) => console.warn('Error al actualizar favoritos', err));
            } else {
                getPublishedCarsByUser(uid)
                    .then((published) => setPublishedCars(published || []))
                    .catch((err) => console.warn('Error al actualizar publicaciones', err));
            }

            // If an event requested a refresh while we were away, clear it
            if (refreshPending) setRefreshPending(false);
        }
    }, [user, isFocused, activeTab]);

    // Refresh favorites when tab changes or screen is focused
    useEffect(() => {
        if (isFocused && user && activeTab === 'favorites') {
            const uid = user?.id;
            getLikedCarsByUser(uid)
                .then((liked) => setLikedCars(liked || []))
                .catch((err) => console.warn('refresh favorites failed', err));
        }
    }, [user, isFocused, activeTab]);

    // Subscribe to like changes so that favorites update immediately
    useEffect(() => {
        if (!user || !isFocused || activeTab !== 'favorites') {
            return;
        }

        // Create a function to refresh liked cars when a favorite status changes
        const refreshLikedCars = (isFavorite) => {
            // Only refresh if a car was unliked (removed from favorites)
            if (!isFavorite) {
                const uid = user?.id;
                if (uid) {
                    getLikedCarsByUser(uid)
                        .then((liked) => setLikedCars(liked || []))
                        .catch((err) => console.warn('refresh favorites failed', err));
                }
            }
        };

        // Set up listeners for each car in the favorites list
        const unsubscribeFunctions = likedCars.map(car => {
            const carId = car.car_id || car.id;
            if (!carId) return () => {};
            
            return subscribeToFavoriteStatus(`listing-${carId}`, refreshLikedCars);
        });

        return () => {
            unsubscribeFunctions.forEach(unsub => unsub());
        };
    }, [user, isFocused, activeTab, likedCars]);

    // Function to handle favorite changes
    const handleFavoriteChange = (isFavorite) => {
        // Always refresh the liked cars list when any favorite changes
        const uid = user?.id;
        if (uid) {
            getLikedCarsByUser(uid)
                .then((liked) => setLikedCars(liked || []))
                .catch((err) => console.warn('refresh favorites failed', err));
        }
    };

    // Global listener for favorite changes from anywhere in the app
    useEffect(() => {
        if (!user || !isFocused) {
            return;
        }

        // Refresh favorites count when screen is focused (catches changes from other screens)
        const uid = user?.id;
        if (uid) {
            getLikedCarsByUser(uid)
                .then((liked) => setLikedCars(liked || []))
                .catch((err) => console.warn('refresh favorites from focus failed', err));
        }
    }, [user, isFocused]);

    // Save profile (with Cloudinary upload)
    const handleSaveProfile = async () => {
        setSaving(true);
        setFetchError(null);
        let avatarUri = newAvatarUri;

        try {
            // Uniquement si l'URI est local (non HTTP/HTTPS)
            if (newAvatarUri && !newAvatarUri.startsWith('http')) {
                try {
                    const uploadResult = await uploadToCloudinary(newAvatarUri);
                    avatarUri = uploadResult.secure_url;
                } catch (uploadError) {
                    console.error('Error uploading to Cloudinary:', uploadError);
                    throw new Error(`Error de subida de imagen: ${uploadError.message}`);
                }
            }

            // Mise à jour du profil dans la base de données
            const userId = user?.id;
            // Seulement name et avatar_url peuvent être mis à jour dans profiles
            const updated = await updateProfile(userId, { name, avatar_url: avatarUri });

            if (updated) {
                setProfile(updated);
                setName(updated.name);
                // L'email reste celui de auth.users (pas modifiable via profiles)
                setNewAvatarUri(updated.avatar_url ?? null);
                setEditing(false);
                Alert.alert('Éxito', 'Perfil actualizado con éxito');
            } else {
                setFetchError('No se pudo actualizar el perfil.');
            }
        } catch (err) {
            console.error('Error al actualizar perfil/subir imagen:', err);
            setFetchError(err?.message || 'Error durante la actualización.');
        } finally {
            setSaving(false);
        }
    };

    // Loading and error states
    if (loading)
        return (
            <SafeAreaView style={profileScreenStyles.safeArea}>
                <View style={profileScreenStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={palette.accent} />
                    <Text style={profileScreenStyles.loadingText}>Cargando datos...</Text>
                </View>
            </SafeAreaView>
        );

    if (fetchError)
        return (
            <SafeAreaView style={profileScreenStyles.safeArea}>
                <View style={profileScreenStyles.loadingContainer}>
                    <Text style={profileScreenStyles.errorText}>{fetchError}</Text>
                    <Text style={profileScreenStyles.errorSubtitle}>Por favor, verifica tu conexión.</Text>
                </View>
            </SafeAreaView>
        );

    if (!user) {
        return (
            <SafeAreaView style={profileScreenStyles.safeArea}>
                <View style={profileScreenStyles.centerContent}>
                    <Text style={profileScreenStyles.infoText}>Inicia sesión para ver el perfil.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const avatarSource = newAvatarUri ? { uri: newAvatarUri } : {uri: DEFAULT_AVATAR_URI};

    const TabContent = () => {
        const listData = activeTab === 'published' ? publishedCars : likedCars;
        if (listData.length === 0) {
            return (
                <View style={profileScreenStyles.emptyStateContainer}>
                    <Text style={profileScreenStyles.emptyStateText}>
                        {activeTab === 'published' ? 'No has publicado coches aún.' : 'No tienes coches favoritos aún.'}
                    </Text>
                </View>
            );
        }
        return listData.map((car, index) => {
            const key = car.car_id ?? car.id ?? `${car.brand}-${car.model}-${index}`;
            const model = car.model;
            const brand = car.brand || car.make;
            const year = car.year;
            const price = car.price;

            // Convertir les données du car en format compatible avec HomeScreen
            const carItem = {
                id: car.car_id || car.id,
                title: car.title || `${brand} ${model}`,
                make: brand,
                model: model,
                year: year,
                price: price,
                images: car.images || (car.url ? [car.url] : []),
                mileage: car.mileage,
                fuel_type: car.fuel_type,
                transmission: car.transmission,
                location: car.location,
                doors: car.doors,
                color: car.color
            };

            const handleCarPress = () => {
                if (navigation) {
                    navigation.navigate('ListingDetail', { 
                        listingId: carItem.id,
                        listing: carItem
                    });
                }
            };

            return (
                <CarItem
                    key={key}
                    item={carItem}
                    onPress={handleCarPress}
                    onFavoriteChange={handleFavoriteChange}
                />
            );
        });
    };

    return (
        <SafeAreaView style={profileScreenStyles.safeArea}>
            <View style={profileScreenStyles.container}>
                <ScrollView contentContainerStyle={profileScreenStyles.scrollContent}>
                    <View style={profileScreenStyles.header}>
                        <View style={profileScreenStyles.avatarWrapper}>
                            <Image source={avatarSource} style={profileScreenStyles.avatar} />
                            {editing && (
                                <TouchableOpacity style={editableAvatarStyle} onPress={promptImageSelection}>
                                    <Ionicons name="camera-outline" size={30} color="#fff" />
                                    <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>
                                        Cambiar
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {editing ? (
                            <>
                                <TextInput style={profileScreenStyles.input} value={name} onChangeText={setName} placeholder="Nombre" placeholderTextColor={palette.textMuted} />
                                <TextInput 
                                    style={[profileScreenStyles.input, { backgroundColor: palette.disabled, color: palette.textMuted }]} 
                                    value={email} 
                                    editable={false}
                                    placeholder="Email (no editable)" 
                                    placeholderTextColor={palette.textMuted} 
                                />

                                <TouchableOpacity
                                    style={[profileScreenStyles.saveButton, saving && { opacity: 0.7 }]}
                                    onPress={handleSaveProfile}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <ActivityIndicator color="#1a1a1a" />
                                    ) : (
                                        <Text style={profileScreenStyles.saveButtonText}>Guardar Cambios</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={profileScreenStyles.cancelButton}
                                    onPress={() => {
                                        setEditing(false);
                                        setNewAvatarUri(profile?.avatar_url ?? null);
                                        setName(profile?.name || user?.user_metadata?.full_name || 'Usuario');
                                        setEmail(user?.email || ''); // L'email vient toujours de auth.users
                                        setFetchError(null);
                                    }}
                                >
                                    <Text style={profileScreenStyles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={profileScreenStyles.name}>{name}</Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const rating = Number(profile?.rating ?? 0);
                                        const fill = Math.min(Math.max(rating - (star - 1), 0), 1); // 0 a 1

                                        return (
                                            <View key={star} style={{ marginRight: 2 }}>
                                                <Ionicons name="star-outline" size={25} color="#ccc" />
                                                <View
                                                    style={{
                                                        position: 'absolute',
                                                        width: 30 * fill,
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <Ionicons name="star" size={25} color={palette.accent} />
                                                </View>
                                            </View>
                                        );
                                    })}
                                    <Text style={{ marginLeft: 6, fontSize: 25, fontWeight: 'bold', color: palette.accent }}>
                                        {Number(profile?.rating ?? 0).toFixed(1)}
                                    </Text>
                                </View>

                                <View style={profileScreenStyles.row}>
                                    <Feather name="mail" size={15} color={palette.accent} />
                                    <Text style={profileScreenStyles.email}>{email}</Text>
                                </View>
                                <View style={profileScreenStyles.row}>
                                    <Feather name="user" size={15} color={palette.accent} />
                                    <Text style={profileScreenStyles.joiningDate}>Miembro desde {joiningDate}</Text>
                                </View>

                                <TouchableOpacity style={profileScreenStyles.button} onPress={() => setEditing(true)}>
                                    <Feather name="edit" size={20} color="white" />
                                    <Text style={profileScreenStyles.buttonText}> Editar perfil</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <View style={profileScreenStyles.separator} />

                        <View style={profileScreenStyles.statsRow}>
                            <View style={profileScreenStyles.statColumn}>
                                <View style={profileScreenStyles.iconRow}>
                                    <Feather name="truck" size={20} color={palette.accent} />
                                    <Text style={profileScreenStyles.statNumber}>{publishedCars.length}</Text>
                                </View>
                                <Text style={profileScreenStyles.statLabel}>Publicaciones</Text>
                            </View>

                            <View style={profileScreenStyles.statColumn}>
                                <View style={profileScreenStyles.iconRow}>
                                    <Feather name="heart" size={20} color={palette.accent} />
                                    <Text style={profileScreenStyles.statNumber}>{likedCars.length}</Text>
                                </View>
                                <Text style={profileScreenStyles.statLabel}>Favoritos</Text>
                            </View>
                        </View>

                        <View style={profileScreenStyles.sectionDivider} />
                    </View>

                    <View style={profileScreenStyles.activitySection}>
                        <Text style={profileScreenStyles.activityTitle}>Mi Actividad</Text>
                        <Text style={profileScreenStyles.activitySubtitle}>
                            Revisa tus publicaciones y coches favoritos
                        </Text>
                    </View>

                    <View style={profileScreenStyles.tabBar}>
                        <TouchableOpacity
                            onPress={() => setActiveTab('published')}
                            style={[profileScreenStyles.tab, activeTab === 'published' && profileScreenStyles.activeTab]}
                        >
                            <View style={profileScreenStyles.tabContent}>
                                <Feather
                                    name="truck"
                                    size={18}
                                    color={activeTab === 'published' ? 'black' : palette.accent}
                                />
                                <Text
                                    style={[
                                        profileScreenStyles.tabText,
                                        activeTab === 'published' && profileScreenStyles.tabTabTextActive,
                                    ]}
                                >
                                    {' '}
                                    Mis Coches
                                </Text>
                                <Text
                                    style={[
                                        profileScreenStyles.tabNumber,
                                        activeTab === 'published' && profileScreenStyles.tabNumberActive,
                                    ]}
                                >
                                    {' '}
                                    {publishedCars.length}{' '}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab('favorites')}
                            style={[profileScreenStyles.tab, activeTab === 'favorites' && profileScreenStyles.activeTab]}
                        >
                            <View style={profileScreenStyles.tabContent}>
                                <Feather
                                    name="heart"
                                    size={18}
                                    color={activeTab === 'favorites' ? 'black' : palette.accent}
                                />
                                <Text
                                    style={[
                                        profileScreenStyles.tabText,
                                        activeTab === 'favorites' && profileScreenStyles.tabTabTextActive,
                                    ]}
                                >
                                    {' '}
                                    Favoritos
                                </Text>
                                <Text
                                    style={[
                                        profileScreenStyles.tabNumber,
                                        activeTab === 'favorites' && profileScreenStyles.tabNumberActive,
                                    ]}
                                >
                                    {' '}
                                    {likedCars.length}{' '}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={profileScreenStyles.listWrapper}>
                        <TabContent />
                        
                        {/* Sign out button */}
                        <TouchableOpacity style={profileScreenStyles.signOutButton} onPress={signOut}>
                            <Text style={profileScreenStyles.signOutButtonText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
