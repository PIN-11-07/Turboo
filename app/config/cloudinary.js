// Cloudinary configuration
// Remplace ces valeurs par tes propres credentials Cloudinary

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'doe9updez', // Remplace par ton cloud name
  UPLOAD_PRESET: 'profiles_upload', // Remplace par ton upload preset
  
  // URLs d'API
  UPLOAD_URL: (cloudName) => `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  
  // Configuration par défaut pour les uploads
  DEFAULT_UPLOAD_OPTIONS: {
    quality: 0.7,
    format: 'auto',
    fetch_format: 'auto',
  },
  
  // Transformations courantes
  TRANSFORMATIONS: {
    avatar: 'w_300,h_300,c_fill,g_face,r_max',
    thumbnail: 'w_150,h_150,c_fill',
    listing_image: 'w_800,h_600,c_fill,q_auto:good',
  }
};

// Helper function pour construire URLs avec transformations
export const buildCloudinaryUrl = (publicId, transformation = '') => {
  const { CLOUD_NAME } = CLOUDINARY_CONFIG;
  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
  
  if (transformation) {
    return `${baseUrl}${transformation}/${publicId}`;
  }
  
  return `${baseUrl}${publicId}`;
};

// Helper function pour upload
export const uploadToCloudinary = async (imageUri, uploadPreset = CLOUDINARY_CONFIG.UPLOAD_PRESET) => {
  const { CLOUD_NAME } = CLOUDINARY_CONFIG;
  
  const fileExtension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
  
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: mimeType,
    name: `upload_${Date.now()}.${fileExtension}`,
  });
  formData.append('upload_preset', uploadPreset);
  formData.append('cloud_name', CLOUD_NAME);

  const response = await fetch(CLOUDINARY_CONFIG.UPLOAD_URL(CLOUD_NAME), {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  
  if (!result.secure_url) {
    throw new Error('Invalid response: missing secure_url');
  }

  return result;
};