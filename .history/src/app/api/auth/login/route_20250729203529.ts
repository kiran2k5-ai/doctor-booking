import { NextRequest, NextResponse } from 'next/server';

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

// Mock OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { otp: string; expires: number; userId: string }>();

export async function POST(request: NextRequest) {
  try {
    const { contact } = await request.json();

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact (email or phone) is required' },
        { status: 400 }
      );
    }

    // For development: Accept any contact and create a mock user
    let user = mockUsers.find(
      u => u.email.toLowerCase() === contact.toLowerCase() || u.phone === contact
    );

    // If user not found, create a temporary mock user for testing
    if (!user) {
      user = {
        id: `temp-${Date.now()}`,
        email: contact.includes('@') ? contact : 'temp@example.com',
        phone: contact.includes('@') ? '+919999999999' : contact,
        name: 'Test User'
      };
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store OTP with 5-minute expiry
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStorage.set(contact, { otp, expires, userId: user.id });

    console.log(`OTP for ${contact}: ${otp}`); // In production, send via SMS/Email

    return NextResponse.json({
      message: 'OTP sent successfully',
      maskedContact: contact.includes('@') 
        ? contact.replace(/(.{2})(.*)(@.*)/, '$1****$3')
        : contact.replace(/(\+\d{2})(\d*)(\d{2})/, '$1****$3')
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
