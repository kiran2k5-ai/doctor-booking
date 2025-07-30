import { NextRequest, NextResponse } from 'next/server';
import { mockAppointments, findDoctorById } from '../../doctors/storage';

// GET /api/appointments/[id] - Get specific appointment
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: appointmentId } = await context.params;
    
    const appointment = mockAppointments.find(apt => apt.id === appointmentId);
    
    if (!appointment) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Appointment not found'
      }, { status: 404 });
    }

    // Enhance with doctor information
    const doctor = findDoctorById(appointment.doctorId);
    const enhancedAppointment = {
      ...appointment,
      doctor: doctor ? {
        name: doctor.name,
        specialization: doctor.specialization,
        location: doctor.location,
        image: doctor.image
      } : null
    };

    return NextResponse.json({
      success: true,
      data: enhancedAppointment,
      message: 'Appointment fetched successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch appointment'
    }, { status: 500 });
  }
}

// PUT /api/appointments/[id] - Update appointment (reschedule)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: appointmentId } = await context.params;
    const updateData = await request.json();
    
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Appointment not found'
      }, { status: 404 });
    }

    const currentAppointment = mockAppointments[appointmentIndex];

    // Check if appointment can be modified
    if (currentAppointment.status === 'cancelled') {
      return NextResponse.json({
        success: false,
        error: 'Invalid operation',
        message: 'Cannot modify cancelled appointment'
      }, { status: 400 });
    }

    // If rescheduling (date/time change), check availability
    if (updateData.date || updateData.time) {
      const newDate = updateData.date || currentAppointment.date;
      const newTime = updateData.time || currentAppointment.time;
      
      // Check if new slot is available (exclude current appointment)
      const conflictingAppointment = mockAppointments.find(apt => 
        apt.id !== appointmentId &&
        apt.doctorId === currentAppointment.doctorId && 
        apt.date === newDate && 
        apt.time === newTime &&
        apt.status !== 'cancelled'
      );

      if (conflictingAppointment) {
        return NextResponse.json({
          success: false,
          error: 'Conflict',
          message: 'Time slot is already booked'
        }, { status: 409 });
      }
    }

    // Update appointment
    const updatedAppointment = {
      ...currentAppointment,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    mockAppointments[appointmentIndex] = updatedAppointment;

    // Enhance response with doctor information
    const doctor = findDoctorById(updatedAppointment.doctorId);
    const enhancedAppointment = {
      ...updatedAppointment,
      doctor: doctor ? {
        name: doctor.name,
        specialization: doctor.specialization,
        location: doctor.location,
        image: doctor.image
      } : null
    };

    return NextResponse.json({
      success: true,
      data: enhancedAppointment,
      message: 'Appointment updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update appointment'
    }, { status: 500 });
  }
}

// DELETE /api/appointments/[id] - Cancel appointment
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: appointmentId } = await context.params;
    
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Appointment not found'
      }, { status: 404 });
    }

    const appointment = mockAppointments[appointmentIndex];

    // Check if appointment is already cancelled
    if (appointment.status === 'cancelled') {
      return NextResponse.json({
        success: false,
        error: 'Invalid operation',
        message: 'Appointment is already cancelled'
      }, { status: 400 });
    }

    // Cancel appointment (soft delete - change status)
    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date().toISOString();
    appointment.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment cancelled successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to cancel appointment'
    }, { status: 500 });
  }
}
