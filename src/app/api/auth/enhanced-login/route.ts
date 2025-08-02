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

    if (!phone) {
      return NextResponse.json({
        success: false,
        error: 'Phone number is required'
      }, { status: 400 });
    }

    // Doctor phone numbers (if phone starts with 987654, it's a doctor)
    const doctorPhones = [
      '9876543210', // Dr. Sarah Wilson
      '9876543211', // Dr. Michael Chen  
      '9876543212', // Dr. Emily Davis
      '9876543213', // Dr. James Brown
      '9876543214', // Dr. Lisa Johnson
    ];

    // Check if it's a doctor phone number
    const isDoctor = doctorPhones.includes(phone);
    
    let userData;
    let userType;

    if (isDoctor) {
      // Doctor data
      const doctorData = {
        '9876543210': { id: '1', name: 'Dr. Sarah Wilson', specialization: 'Psychologist', email: 'sarah.wilson@hospital.com' },
        '9876543211': { id: '2', name: 'Dr. Michael Chen', specialization: 'Cardiologist', email: 'michael.chen@hospital.com' },
        '9876543212': { id: '3', name: 'Dr. Emily Davis', specialization: 'Dermatologist', email: 'emily.davis@hospital.com' },
        '9876543213': { id: '4', name: 'Dr. James Brown', specialization: 'Pediatrician', email: 'james.brown@hospital.com' },
        '9876543214': { id: '5', name: 'Dr. Lisa Johnson', specialization: 'Orthopedic', email: 'lisa.johnson@hospital.com' },
      };
      
      userType = 'doctor';
      userData = { phone, ...doctorData[phone as keyof typeof doctorData] };
    } else {
      // Patient (any other phone number)
      userType = 'patient';
      userData = { phone, name: 'Patient' };
    }

    // Generate auth token
    const authToken = `${userType}-demo-token-${Date.now()}`;
    const redirectUrl = userType === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';

    return NextResponse.json({
      success: true,
      authToken,
      userType,
      userData,
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
