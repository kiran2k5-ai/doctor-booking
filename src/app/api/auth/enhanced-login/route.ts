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
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({
        success: false,
        error: 'Phone number and password are required'
      }, { status: 400 });
    }

    // Demo users (for development)
    const demoUsers = [
      { type: 'patient', phone: '9042222856', password: 'password123', userData: { phone: '9042222856' } },
      { type: 'doctor', phone: '9876543210', password: 'password123', userData: { id: '1', phone: '9876543210', name: 'Dr. Sarah Wilson', specialization: 'Psychologist', email: 'sarah.wilson@hospital.com' } },
      { type: 'doctor', phone: '9876543211', password: 'password123', userData: { id: '2', phone: '9876543211', name: 'Dr. Michael Chen', specialization: 'Cardiologist', email: 'michael.chen@hospital.com' } },
      { type: 'doctor', phone: '9876543212', password: 'password123', userData: { id: '3', phone: '9876543212', name: 'Dr. Emily Davis', specialization: 'Dermatologist', email: 'emily.davis@hospital.com' } },
      { type: 'doctor', phone: '9876543213', password: 'password123', userData: { id: '4', phone: '9876543213', name: 'Dr. James Brown', specialization: 'Pediatrician', email: 'james.brown@hospital.com' } },
      { type: 'doctor', phone: '9876543214', password: 'password123', userData: { id: '5', phone: '9876543214', name: 'Dr. Lisa Johnson', specialization: 'Orthopedic', email: 'lisa.johnson@hospital.com' } },
    ];

    const found = demoUsers.find(u => u.phone === phone && u.password === password);
    if (!found) {
      return NextResponse.json({
        success: false,
        error: 'Invalid phone or password'
      }, { status: 401 });
    }

    // Simulate auth token
    const authToken = `${found.type}-demo-token`;
    const redirectUrl = found.type === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';

    return NextResponse.json({
      success: true,
      authToken,
      userType: found.type,
      userData: found.userData,
      redirectUrl
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process login request'
    }, { status: 500 });
  }
}
