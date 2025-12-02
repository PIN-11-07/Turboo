import { supabase } from '../utils/supabase';

// Get user profile by ID
export const getProfileById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    // Adapter les champs selon la structure existante
    if (data) {
      return {
        ...data,
        name: data.full_name,
        avatar_url: data.profile_image_url,
        // email vient de auth.users, pas de profiles
      };
    }

    return data;
  } catch (err) {
    console.error('Error in getProfileById:', err);
    return null;
  }
};

// Update user profile
export const updateProfile = async (userId, profileData) => {
  try {
    // Adapter les champs selon la structure existante
    // profiles n'accepte que full_name et profile_image_url
    const adaptedData = {};
    
    if (profileData.name !== undefined) {
      adaptedData.full_name = profileData.name;
    }
    
    if (profileData.avatar_url !== undefined) {
      adaptedData.profile_image_url = profileData.avatar_url;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(adaptedData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    // Retourner avec les champs adaptés
    if (data) {
      return {
        ...data,
        name: data.full_name,
        avatar_url: data.profile_image_url,
      };
    }

    return data;
  } catch (err) {
    console.error('Error in updateProfile:', err);
    return null;
  }
};

// Get cars liked by user
export const getLikedCarsByUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        listing_id,
        listings (
          id,
          title,
          description,
          price,
          make,
          model,
          year,
          mileage,
          fuel_type,
          transmission,
          doors,
          color,
          images,
          created_at,
          user_id,
          is_active
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching liked cars:', error);
      return [];
    }

    // Transform the data to match expected format
    return (data || [])
      .filter(favorite => favorite.listings && favorite.listings.is_active) // Seulement les listings actifs
      .map(favorite => {
        // images est jsonb, donc déjà un array ou null
        const images = favorite.listings.images || [];
        const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
        
        return {
          car_id: favorite.listings.id,
          id: favorite.listings.id,
          brand: favorite.listings.make,
          make: favorite.listings.make,
          model: favorite.listings.model,
          year: favorite.listings.year,
          price: favorite.listings.price,
          url: firstImage,
          images: images,
          title: favorite.listings.title,
          ...favorite.listings
        };
      });
  } catch (err) {
    console.error('Error in getLikedCarsByUser:', err);
    return [];
  }
};

// Get cars published by user
export const getPublishedCarsByUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true) // Seulement les listings actifs selon les conventions du projet
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching published cars:', error);
      return [];
    }

    // Transform the data to match expected format
    return (data || []).map(listing => {
      // images est jsonb, donc déjà un array ou null
      const images = listing.images || [];
      const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
      
      return {
        car_id: listing.id,
        id: listing.id,
        brand: listing.make,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        url: firstImage,
        images: images,
        title: listing.title,
        ...listing
      };
    });
  } catch (err) {
    console.error('Error in getPublishedCarsByUser:', err);
    return [];
  }
};

// Remove like from a car
export const removeLike = async (userId, carId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', carId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (err) {
    console.error('Error in removeLike:', err);
    throw err;
  }
};
