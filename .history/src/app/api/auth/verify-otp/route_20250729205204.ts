import { NextRequest, NextResponse } from 'next/server';
import { otpStorage, mockUsers } from '../storage';

export async function POST(request: NextRequest) {
  try {
    const { contact, otp } = await request.json();

    if (!contact || !otp) {
      return NextResponse.json(
        { error: 'Contact and OTP are required' },
        { status: 400 }
      );
    }

    // For development: Accept any 4-digit OTP
    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json(
        { error: 'OTP must be 4 digits' },
        { status: 400 }
      );
    }

    // Get stored OTP (if exists)
    const storedOtpData = otpStorage.get(contact);

    // For development: If no stored OTP or expired, still allow any 4-digit code
    if (!storedOtpData || Date.now() > storedOtpData.expires) {
      // Clear expired OTP
      if (storedOtpData) {
        otpStorage.delete(contact);
      }
      
      // For development: Create a temporary user for any 4-digit OTP
      const user = {
        id: `temp-${Date.now()}`,
        email: contact.includes('@') ? contact : 'temp@example.com',
        phone: contact.includes('@') ? '+919999999999' : contact,
        name: 'Test User'
      };

      const token = `mock-jwt-token-${user.id}-${Date.now()}`;

      return NextResponse.json({
        message: 'OTP verified successfully (dev mode)',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        token
      });
    }

    // If we have stored OTP, verify it normally
    if (storedOtpData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Find user
    let user = mockUsers.find(u => u.id === storedOtpData.userId);

    // If user not found, create a temporary mock user for testing
    if (!user) {
      user = {
        id: storedOtpData.userId,
        email: contact.includes('@') ? contact : 'temp@example.com',
        phone: contact.includes('@') ? '+919999999999' : contact,
        name: 'Test User'
      };
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
