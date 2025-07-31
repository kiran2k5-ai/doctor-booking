import { NextRequest, NextResponse } from 'next/server';
import { otpStorage, mockUsers } from '../storage';

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

    // Generate 6-digit OTP
    // In development, allow bypass with fixed OTP for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    const otp = isDevelopment && contact === 'test@example.com'
      ? '123456'
      : Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiry
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStorage.set(contact, { otp, expires, userId: user.id });

    console.log(`OTP for ${contact}: ${otp}`); // In production, send via SMS/Email
    
    // TODO: In production, replace with actual SMS/Email service
    // Example SMS integration:
    // if (!contact.includes('@')) {
    //   await sendSMS(contact, `Your doctor booking OTP is: ${otp}. Valid for 5 minutes.`);
    // } else {
    //   await sendEmail(contact, 'OTP Verification', `Your OTP is: ${otp}`);
    // }
    
    // For now, in development, users can see OTP in browser console or use test OTP: 1234

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
