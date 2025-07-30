import { NextRequest, NextResponse } from 'next/server';

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
  profileImage?: string | null;
  medicalHistory?: Array<{
    condition: string;
    diagnosedDate: string;
    status: string;
  }>;
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  preferences?: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      appointmentReminders: boolean;
      healthTips: boolean;
    };
    language: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Mock user profile data storage
const userProfiles: Record<string, UserProfile> = {
  'user123': {
    id: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+919876543210',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    address: '123 Main Street, City, State 12345',
    emergencyContact: '+919876543211',
    bloodType: 'O+',
    allergies: ['Peanuts', 'Shellfish'],
    profileImage: null,
    medicalHistory: [
      {
        condition: 'Hypertension',
        diagnosedDate: '2020-03-15',
        status: 'Controlled'
      }
    ],
    insurance: {
      provider: 'Health Insurance Co.',
      policyNumber: 'HIC123456789',
      expiryDate: '2025-12-31'
    },
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
        appointmentReminders: true,
        healthTips: false
      },
      language: 'English',
      timezone: 'Asia/Kolkata'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
};

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user123';

    const profile = userProfiles[userId];
    if (!profile) {
      return NextResponse.json({
        success: false,
        message: 'Profile not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch profile'
    }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user123';
    const updateData = await request.json();

    const currentProfile = userProfiles[userId];
    if (!currentProfile) {
      return NextResponse.json({
        success: false,
        message: 'Profile not found'
      }, { status: 404 });
    }

    // Update profile with new data
    const updatedProfile = {
      ...currentProfile,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    userProfiles[userId] = updatedProfile;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update profile'
    }, { status: 500 });
  }
}

// POST - Update profile preferences
export async function POST(request: NextRequest) {
  try {
    const { userId, preferences } = await request.json();
    const currentProfile = userProfiles[userId || 'user123'];
    
    if (!currentProfile) {
      return NextResponse.json({
        success: false,
        message: 'Profile not found'
      }, { status: 404 });
    }

    // Update preferences
    currentProfile.preferences = {
      ...currentProfile.preferences,
      ...preferences
    };
    currentProfile.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      data: currentProfile
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update preferences'
    }, { status: 500 });
  }
}
