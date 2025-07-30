import { useState } from 'react';

// Local Storage utility for data persistence
export class LocalStorageManager {
  private static readonly KEYS = {
    APPOINTMENTS: 'doctor_booking_appointments',
    USERS: 'doctor_booking_users',
    DOCTORS: 'doctor_booking_doctors',
    PROFILE: 'doctor_booking_profile',
    AUTH_TOKEN: 'doctor_booking_auth_token',
    CURRENT_USER: 'doctor_booking_current_user'
  };

  // Generic storage methods
  static setItem<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Appointments management
  static saveAppointments(appointments: any[]): void {
    // Remove duplicates before saving
    const uniqueAppointments = this.removeDuplicateAppointments(appointments);
    this.setItem(this.KEYS.APPOINTMENTS, uniqueAppointments);
  }

  static getAppointments(): any[] {
    const appointments = this.getItem(this.KEYS.APPOINTMENTS);
    const appointmentsArray = Array.isArray(appointments) ? appointments : [];
    // Ensure we return clean data without duplicates
    return this.removeDuplicateAppointments(appointmentsArray);
  }

  static addAppointment(appointment: any): void {
    const appointments = this.getAppointments();
    
    // Check if appointment already exists
    const exists = appointments.some(apt => apt.id === appointment.id);
    if (!exists) {
      console.log('Adding appointment to localStorage:', appointment);
      console.log('Current appointments before adding:', appointments);
      appointments.push(appointment);
      this.saveAppointments(appointments);
      console.log('Appointments after adding:', this.getAppointments());
    } else {
      console.log('Appointment already exists, skipping:', appointment.id);
    }
  }

  private static removeDuplicateAppointments(appointments: any[]): any[] {
    if (!Array.isArray(appointments)) return [];
    
    const seen = new Set();
    return appointments.filter(apt => {
      if (seen.has(apt.id)) {
        console.log('Removing duplicate appointment:', apt.id);
        return false;
      }
      seen.add(apt.id);
      return true;
    });
  }

  static updateAppointment(appointmentId: string, updates: any): void {
    const appointments = this.getAppointments();
    const index = appointments.findIndex(apt => apt.id === appointmentId);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates };
      this.saveAppointments(appointments);
    }
  }

  static deleteAppointment(appointmentId: string): void {
    const appointments = this.getAppointments();
    const filtered = appointments.filter(apt => apt.id !== appointmentId);
    this.saveAppointments(filtered);
  }

  // User profile management
  static saveProfile(profile: any): void {
    this.setItem(this.KEYS.PROFILE, profile);
  }

  static getProfile(): any | null {
    return this.getItem(this.KEYS.PROFILE);
  }

  // Authentication management
  static saveAuthToken(token: string): void {
    this.setItem(this.KEYS.AUTH_TOKEN, token);
  }

  static getAuthToken(): string | null {
    return this.getItem(this.KEYS.AUTH_TOKEN);
  }

  static saveCurrentUser(user: any): void {
    this.setItem(this.KEYS.CURRENT_USER, user);
  }

  static getCurrentUser(): any | null {
    return this.getItem(this.KEYS.CURRENT_USER);
  }

  static logout(): void {
    this.removeItem(this.KEYS.AUTH_TOKEN);
    this.removeItem(this.KEYS.CURRENT_USER);
  }

  // Data synchronization helper
  static syncWithServer = async (endpoint: string, localData: any[]) => {
    try {
      // Try to sync with server
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: localData })
      });
      
      if (response.ok) {
        console.log('Data synced with server successfully');
        return true;
      }
    } catch (error) {
      console.log('Offline mode - using local storage');
    }
    return false;
  };

  // Initialize default data if empty
  static initializeDefaultData(): void {
    // Clean up any duplicate appointments first
    this.cleanupDuplicateAppointments();
    
    // Initialize appointments if empty
    if (!this.getAppointments().length) {
      this.saveAppointments([]);
    }

    // Initialize profile if empty
    if (!this.getProfile()) {
      this.saveProfile({
        id: 'user123',
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '9042222856',
        dateOfBirth: '',
        gender: '',
        address: '',
        emergencyContact: '',
        bloodType: '',
        allergies: [],
        preferences: {
          notifications: true,
          language: 'en',
          theme: 'light'
        }
      });
    }
  }

  // Clean up existing duplicate appointments
  static cleanupDuplicateAppointments(): void {
    const appointments = this.getItem(this.KEYS.APPOINTMENTS);
    if (Array.isArray(appointments)) {
      const cleaned = this.removeDuplicateAppointments(appointments);
      if (cleaned.length !== appointments.length) {
        console.log(`Cleaned up ${appointments.length - cleaned.length} duplicate appointments`);
        this.setItem(this.KEYS.APPOINTMENTS, cleaned);
      }
    }
  }
}

// Hook for React components
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = LocalStorageManager.getItem<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      LocalStorageManager.setItem(key, valueToStore);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};
