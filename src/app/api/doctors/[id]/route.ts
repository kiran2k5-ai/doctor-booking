import { NextRequest, NextResponse } from 'next/server';
import { findDoctorById, mockDoctors } from '../storage';

// GET /api/doctors/[id] - Get doctor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const doctorId = awaitedParams.id;

    const doctor = findDoctorById(doctorId);

    if (!doctor) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `Doctor with ID ${doctorId} not found`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: doctor,
      message: 'Doctor found successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch doctor'
    }, { status: 500 });
  }
}

// PUT /api/doctors/[id] - Update doctor by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const doctorId = awaitedParams.id;
    const updateData = await request.json();

    const doctorIndex = mockDoctors.findIndex(doctor => doctor.id === doctorId);

    if (doctorIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `Doctor with ID ${doctorId} not found`
      }, { status: 404 });
    }

    // Update doctor data
    mockDoctors[doctorIndex] = {
      ...mockDoctors[doctorIndex],
      ...updateData,
      id: doctorId // Ensure ID cannot be changed
    };

    return NextResponse.json({
      success: true,
      data: mockDoctors[doctorIndex],
      message: 'Doctor updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update doctor'
    }, { status: 500 });
  }
}

// DELETE /api/doctors/[id] - Delete doctor by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const doctorId = awaitedParams.id;

    const doctorIndex = mockDoctors.findIndex(doctor => doctor.id === doctorId);

    if (doctorIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `Doctor with ID ${doctorId} not found`
      }, { status: 404 });
    }

    // Remove doctor from array
    const deletedDoctor = mockDoctors.splice(doctorIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedDoctor,
      message: 'Doctor deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete doctor'
    }, { status: 500 });
  }
}
