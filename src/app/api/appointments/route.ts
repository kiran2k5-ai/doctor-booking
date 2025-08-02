import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mockAppointments, findDoctorById } from '../doctors/storage';

// Interface definitions
interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: string;
  status: string;
  consultationFee?: number;
  notes?: string;
  createdAt?: string;
  doctor?: {
    name: string;
    specialization: string;
    location: string;
    image: string;
  } | null;
}

// Helper function to get appointments from request headers (localStorage data)
function getAppointmentsFromClient(request: NextRequest): Appointment[] | null {
  const clientData = request.headers.get('x-appointments-data');
  if (clientData) {
    try {
      return JSON.parse(clientData);
    } catch (error) {
      console.error('Error parsing client appointments data:', error);
    }
  }
  return null;
}

// GET /api/appointments - Get all appointments for a patient
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');
    const useLocalData = searchParams.get('useLocalData') === 'true';

    // Try to get data from client-side localStorage first
    let appointments = useLocalData ? getAppointmentsFromClient(request) : null;
    
    // Fallback to server mock data if no client data
    if (!appointments) {
      appointments = [...mockAppointments];
    }

    let filteredAppointments = appointments;

    // Filter by patient ID if provided
    if (patientId) {
      filteredAppointments = filteredAppointments.filter((apt: Appointment) => apt.patientId === patientId);
    }

    // Filter by status if provided
    if (status) {
      filteredAppointments = filteredAppointments.filter((apt: Appointment) => apt.status === status);
    }

    // Enhance appointments with doctor information
    const enhancedAppointments = filteredAppointments.map((appointment: Appointment) => {
      const doctor = findDoctorById(appointment.doctorId);
      return {
        ...appointment,
        doctor: doctor ? {
          name: doctor.name,
          specialization: doctor.specialization,
          location: doctor.location,
          image: doctor.image
        } : null
      };
    });

    // Remove any duplicate IDs before sending response
    const uniqueAppointments = enhancedAppointments.filter((appointment: Appointment, index: number, self: Appointment[]) => 
      index === self.findIndex((apt: Appointment) => apt.id === appointment.id)
    );

    console.log(`Returning ${uniqueAppointments.length} unique appointments for patient ${patientId} (filtered from ${enhancedAppointments.length})`);

    return NextResponse.json({
      success: true,
      data: uniqueAppointments,
      total: uniqueAppointments.length,
      message: 'Appointments fetched successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch appointments'
    }, { status: 500 });
  }
}

// POST /api/appointments - Book a new appointment (Supabase version)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { doctor_id, patient_id, date, time, notes } = await request.json();

    // Optional: Check for slot conflicts
    const { data: existing, error: conflictError } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctor_id)
      .eq('date', date)
      .eq('time', time);
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Slot already booked' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([{ doctor_id, patient_id, date, time, notes }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, appointment: data[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
