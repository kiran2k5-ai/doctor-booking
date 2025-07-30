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
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP temporarily (in production, use Redis or database)
    const otpData = {
      phone,
      otp,
      userType: userInfo.type,
      userData: userInfo.data,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    // In production, send SMS here
    console.log(`OTP for ${phone} (${userInfo.type}): ${otp}`);

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
