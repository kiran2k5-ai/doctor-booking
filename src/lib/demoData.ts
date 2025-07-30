// Demo data for localStorage persistence demonstration
import { LocalStorageManager } from './storage';

export function initializeDemoData() {
  // Check if data already exists
  const existingAppointments = LocalStorageManager.getAppointments();
  const existingProfile = LocalStorageManager.getProfile();

  // Initialize demo appointments if none exist
  if (existingAppointments.length === 0) {
    const demoAppointments = [
      {
        id: 'demo-apt-1',
        patientId: 'user123',
        doctorId: '1',
        date: '2025-08-01',
        time: '10:00 AM',
        status: 'confirmed',
        notes: 'Regular checkup appointment',
        doctor: {
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiologist',
          image: '/images/doctor1.jpg'
        }
      },
      {
        id: 'demo-apt-2',
        patientId: 'user123',
        doctorId: '2',
        date: '2025-08-05',
        time: '2:30 PM',
        status: 'confirmed',
        notes: 'Follow-up consultation',
        doctor: {
          name: 'Dr. Michael Chen',
          specialization: 'Dermatologist',
          image: '/images/doctor2.jpg'
        }
      },
      {
        id: 'demo-apt-3',
        patientId: 'user123',
        doctorId: '3',
        date: '2025-07-25',
        time: '11:00 AM',
        status: 'completed',
        notes: 'Completed consultation',
        doctor: {
          name: 'Dr. Emily Davis',
          specialization: 'General Physician',
          image: '/images/doctor3.jpg'
        }
      }
    ];

    // Save demo appointments
    LocalStorageManager.saveAppointments(demoAppointments);
    console.log('Demo appointments initialized');
  }

  // Initialize demo profile if none exists
  if (!existingProfile || !existingProfile.name) {
    const demoProfile = {
      id: 'user123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9042222856',
      dateOfBirth: '1990-05-15',
      gender: 'Male',
      address: '123 Main Street, City, State 12345',
      emergencyContact: '9876543210',
      bloodType: 'O+',
      allergies: ['Peanuts', 'Shellfish'],
      profileImage: '',
      preferences: {
        notifications: true,
        language: 'en',
        theme: 'light'
      }
    };

    // Save demo profile
    LocalStorageManager.saveProfile(demoProfile);
    console.log('Demo profile initialized');
  }

  console.log('Demo data initialization complete');
}

export function clearAllData() {
  LocalStorageManager.clear();
  console.log('All localStorage data cleared');
}

export function exportData() {
  const data = {
    appointments: LocalStorageManager.getAppointments(),
    profile: LocalStorageManager.getProfile(),
    timestamp: new Date().toISOString()
  };
  
  // Create downloadable JSON file
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `doctor-booking-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  console.log('Data exported successfully');
}

export function importData(jsonString: string) {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.appointments) {
      LocalStorageManager.saveAppointments(data.appointments);
    }
    
    if (data.profile) {
      LocalStorageManager.saveProfile(data.profile);
    }
    
    console.log('Data imported successfully');
    return { success: true };
  } catch (error) {
    console.error('Error importing data:', error);
    return { success: false, error: 'Invalid JSON format' };
  }
}
