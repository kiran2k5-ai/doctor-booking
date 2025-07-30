// Doctor appointments API
import { NextRequest, NextResponse } from 'next/server';
import { mockAppointments } from '../../doctors/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json({
        success: false,
        error: 'Doctor ID is required'
      }, { status: 400 });
    }

    // Filter appointments for the specific doctor
    const doctorAppointments = mockAppointments.filter(apt => apt.doctorId === doctorId);

    // Group appointments by status
    const groupedAppointments = {
      today: doctorAppointments.filter(apt => {
        const today = new Date().toISOString().split('T')[0];
        return apt.date === today && apt.status === 'scheduled';
      }),
      upcoming: doctorAppointments.filter(apt => {
        const today = new Date().toISOString().split('T')[0];
        return apt.date >= today && apt.status === 'scheduled';
      }),
      past: doctorAppointments.filter(apt => {
        const today = new Date().toISOString().split('T')[0];
        return apt.date < today || apt.status === 'completed';
      }),
      cancelled: doctorAppointments.filter(apt => apt.status === 'cancelled')
    };

    return NextResponse.json({
      success: true,
      data: doctorAppointments,
      grouped: groupedAppointments,
      total: doctorAppointments.length
    });

  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch appointments'
    }, { status: 500 });
  }
}

// Update appointment status
export async function PUT(request: NextRequest) {
  try {
    const { appointmentId, status, notes } = await request.json();

    if (!appointmentId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Appointment ID and status are required'
      }, { status: 400 });
    }

    // Find and update appointment
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Appointment not found'
      }, { status: 404 });
    }

    // Update appointment
    mockAppointments[appointmentIndex] = {
      ...mockAppointments[appointmentIndex],
      status,
      notes: notes || mockAppointments[appointmentIndex].notes,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockAppointments[appointmentIndex],
      message: 'Appointment updated successfully'
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update appointment'
    }, { status: 500 });
  }
}
