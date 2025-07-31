// Enhanced authentication API to support both doctors and patients
import { NextRequest, NextResponse } from 'next/server';

// Mock data for doctors (phone numbers that identify doctors)
const mockDoctors = [
  {
    id: '1',
    phone: '9876543210', // Dr. Prakash Das
    name: 'Dr. Prakash Das',
    specialization: 'Psychologist',
    email: 'prakash.das@hospital.com'
  },
  {
    id: '2', 
    phone: '9876543211', // Dr. Sarah Wilson
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiologist',
    email: 'sarah.wilson@hospital.com'
  },
  {
    id: '3',
    phone: '9876543212', // Dr. Michael Chen
    name: 'Dr. Michael Chen', 
    specialization: 'Dermatologist',
    email: 'michael.chen@hospital.com'
  },
  {
    id: '4',
    phone: '9876543213', // Dr. Emily Rodriguez
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrician', 
    email: 'emily.rodriguez@hospital.com'
  },
  {
    id: '5',
    phone: '9876543214', // Dr. James Park
    name: 'Dr. James Park',
    specialization: 'Orthopedic',
    email: 'james.park@hospital.com'
  }
];


// In-memory OTP store (for demo; use Redis/db in production)
export const otpStore: Record<string, { otp: string; expiresAt: number; attempts: number }> = {};

// Function to identify user type
function getUserType(phone: string) {
  const doctor = mockDoctors.find(doc => doc.phone === phone);
  if (doctor) {
    return { type: 'doctor', data: doctor };
  }
  return { type: 'patient', data: { phone } };
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({
        success: false,
        error: 'Phone number is required'
      }, { status: 400 });
    }

    // Identify user type
    const userInfo = getUserType(phone);
    


    // Demo numbers (patient and all demo doctors) always get OTP 1234 and bypass rate limit
    const demoNumbers = [
      '9042222856', // demo patient
      '9876543210', '9876543211', '9876543212', '9876543213', '9876543214' // demo doctors
    ];
    const now = Date.now();
    let otp = Math.floor(1000 + Math.random() * 9000).toString();
    if (demoNumbers.includes(phone)) {
      otp = '1234';
      // No rate limit for demo numbers
    } else {
      // Rate limit: max 5 OTPs per 10 minutes per contact
      if (otpStore[phone] && otpStore[phone].attempts >= 5 && now - otpStore[phone].expiresAt < 10 * 60 * 1000) {
        return NextResponse.json({
          success: false,
          error: 'Too many OTP requests. Please try again later.'
        }, { status: 429 });
      }
    }
    const expiresAt = now + 15 * 60 * 1000; // 15 minutes
    otpStore[phone] = {
      otp,
      expiresAt,
      attempts: (otpStore[phone]?.attempts || 0) + 1
    };

    // In production, send SMS here
    console.log(`OTP for ${phone} (${userInfo.type}): ${otp} (expires at ${new Date(expiresAt).toLocaleString()})`);

    // Only store user info in tempToken, not OTP
    const otpData = {
      phone,
      userType: userInfo.type,
      userData: userInfo.data,
      expiresAt: otpStore[phone].expiresAt
    };

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${phone}`,
      userType: userInfo.type,
      tempToken: Buffer.from(JSON.stringify(otpData)).toString('base64')
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process login request'
    }, { status: 500 });
  }
}
