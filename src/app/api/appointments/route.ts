import { NextRequest, NextResponse } from 'next/server';
import { bookAppointment, mockAppointments, findDoctorById } from '../doctors/storage';

// Helper function to get appointments from request headers (localStorage data)
function getAppointmentsFromClient(request: NextRequest) {
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
      filteredAppointments = filteredAppointments.filter((apt: any) => apt.patientId === patientId);
    }

    // Filter by status if provided
    if (status) {
      filteredAppointments = filteredAppointments.filter((apt: any) => apt.status === status);
    }

    // Enhance appointments with doctor information
    const enhancedAppointments = filteredAppointments.map((appointment: any) => {
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
    const uniqueAppointments = enhancedAppointments.filter((appointment: any, index: number, self: any[]) => 
      index === self.findIndex((apt: any) => apt.id === appointment.id)
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

// POST /api/appointments - Book a new appointment
export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json();

    // Validate required fields
    const requiredFields = ['doctorId', 'patientId', 'date', 'time', 'type'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Check if doctor exists
    const doctor = findDoctorById(appointmentData.doctorId);
    if (!doctor) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Doctor not found'
      }, { status: 404 });
    }

    // Check if time slot is available
    // In a real app, this would check against the database
    const existingAppointment = mockAppointments.find(apt => 
      apt.doctorId === appointmentData.doctorId && 
      apt.date === appointmentData.date && 
      apt.time === appointmentData.time &&
      apt.status !== 'cancelled'
    );

    if (existingAppointment) {
      return NextResponse.json({
        success: false,
        error: 'Conflict',
        message: 'Time slot is already booked'
      }, { status: 409 });
    }

    // Set consultation fee based on doctor and type
    const consultationFee = appointmentData.type === 'video' 
      ? doctor.consultationFee - 100 
      : doctor.consultationFee;

    // Book the appointment
    const newAppointment = bookAppointment({
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      date: appointmentData.date,
      time: appointmentData.time,
      type: appointmentData.type,
      status: 'scheduled',
      consultationFee,
      notes: appointmentData.notes || ''
    });

    // Enhance response with doctor information
    const enhancedAppointment = {
      ...newAppointment,
      doctor: {
        name: doctor.name,
        specialization: doctor.specialization,
        location: doctor.location,
        image: doctor.image
      }
    };

    return NextResponse.json({
      success: true,
      data: enhancedAppointment,
      message: 'Appointment booked successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to book appointment'
    }, { status: 500 });
  }
}
