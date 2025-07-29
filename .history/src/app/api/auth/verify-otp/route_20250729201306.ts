import { NextRequest, NextResponse } from 'next/server';

// Mock OTP storage (same as in login route)
const otpStorage = new Map<string, { otp: string; expires: number; userId: string }>();

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    phone: '+919876543210',
    name: 'John Doe'
  },
  {
    id: '2',
    email: 'admin@hospital.com',
    phone: '+919876543211',
    name: 'Admin User'
  }
];

export async function POST(request: NextRequest) {
  try {
    const { contact, otp } = await request.json();

    if (!contact || !otp) {
      return NextResponse.json(
        { error: 'Contact and OTP are required' },
        { status: 400 }
      );
    }

    // Get stored OTP
    const storedOtpData = otpStorage.get(contact);

    if (!storedOtpData) {
      return NextResponse.json(
        { error: 'OTP not found or expired' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expires) {
      otpStorage.delete(contact);
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Find user
    const user = mockUsers.find(u => u.id === storedOtpData.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Clear OTP after successful verification
    otpStorage.delete(contact);

    // In production, generate JWT token here
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    return NextResponse.json({
      message: 'OTP verified successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
