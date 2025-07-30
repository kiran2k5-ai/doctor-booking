'use client';

import { useState, useEffect } from 'react';
import { LocalStorageManager } from './storage';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  bloodType?: string;
  allergies?: string[];
  profileImage?: string;
  preferences?: {
    notifications: boolean;
    language: string;
    theme: string;
  };
}

export function useProfile(userId: string = 'user123') {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile from localStorage on component mount
  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to get from localStorage
      const localProfile = LocalStorageManager.getProfile();
      
      if (localProfile && localProfile.id === userId) {
        setProfile(localProfile);
        setLoading(false);
        
        // Try to sync with server in background
        syncWithServer(localProfile);
        return;
      }

      // If no local data, fetch from server
      const response = await fetch(`/api/profile?userId=${userId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProfile(result.data);
          // Save to localStorage for future use
          LocalStorageManager.saveProfile(result.data);
        } else {
          // Create default profile if none exists
          const defaultProfile: UserProfile = {
            id: userId,
            name: '',
            email: '',
            phone: '',
            preferences: {
              notifications: true,
              language: 'en',
              theme: 'light'
            }
          };
          setProfile(defaultProfile);
          LocalStorageManager.saveProfile(defaultProfile);
        }
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      // Use default profile if fetch fails
      const defaultProfile: UserProfile = {
        id: userId,
        name: '',
        email: '',
        phone: '',
        preferences: {
          notifications: true,
          language: 'en',
          theme: 'light'
        }
      };
      setProfile(defaultProfile);
      LocalStorageManager.saveProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  const syncWithServer = async (localData: UserProfile) => {
    try {
      // Attempt to sync local data with server
      const response = await fetch('/api/profile/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localData)
      });
      
      if (response.ok) {
        console.log('Profile synced with server');
      }
    } catch (error) {
      console.log('Sync failed, continuing with local data');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setSaving(true);
      setError(null);
      
      if (!profile) return { success: false, error: 'No profile to update' };

      const updatedProfile = { ...profile, ...updates };
      
      // Optimistic update
      setProfile(updatedProfile);
      
      // Save to localStorage immediately
      LocalStorageManager.saveProfile(updatedProfile);

      // Try to sync with server
      try {
        const response = await fetch(`/api/profile?userId=${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProfile)
        });

        if (!response.ok) {
          console.log('Server update failed, but saved locally');
        }
      } catch (serverError) {
        console.log('Offline mode - profile saved locally');
      }

      return { success: true, data: updatedProfile };
    } catch (error) {
      setError('Failed to update profile');
      return { success: false, error: 'Failed to update profile' };
    } finally {
      setSaving(false);
    }
  };

  const uploadProfileImage = async (imageFile: File) => {
    try {
      setSaving(true);
      
      // For demo purposes, we'll convert to base64 and store locally
      // In production, you'd upload to a cloud service
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64Image = reader.result as string;
            const result = await updateProfile({ profileImage: base64Image });
            resolve(result);
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(imageFile);
      });
    } catch (error) {
      setError('Failed to upload image');
      return { success: false, error: 'Failed to upload image' };
    } finally {
      setSaving(false);
    }
  };

  const refreshProfile = () => {
    loadProfile();
  };

  return {
    profile,
    loading,
    saving,
    error,
    updateProfile,
    uploadProfileImage,
    refreshProfile,
    loadProfile
  };
}
