// Doctor availability API
import { NextRequest, NextResponse } from 'next/server';

// Interface definitions
interface AvailabilitySlot {
  id: string;
  doctorId: string;
  date: string;
  timeSlots: string[];
  isAvailable: boolean;
  notes: string;
}

// Mock availability data storage
const doctorAvailability: AvailabilitySlot[] = [
  {
    id: '1',
    doctorId: '1',
    date: '2025-07-31',
    timeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30'],
    isAvailable: true,
    notes: 'Regular consultation hours'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    if (!doctorId) {
      return NextResponse.json({
        success: false,
        error: 'Doctor ID is required'
      }, { status: 400 });
    }

    let availability = doctorAvailability.filter(avail => avail.doctorId === doctorId);

    if (date) {
      availability = availability.filter(avail => avail.date === date);
      return NextResponse.json({
        success: true,
        data: availability[0] || null
      });
    }

    return NextResponse.json({
      success: true,
      data: availability
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch availability'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { doctorId, date, timeSlots, isAvailable, notes } = await request.json();

    if (!doctorId || !date) {
      return NextResponse.json({
        success: false,
        error: 'Doctor ID and date are required'
      }, { status: 400 });
    }

    // Find existing availability for this doctor and date
    const existingIndex = doctorAvailability.findIndex(
      avail => avail.doctorId === doctorId && avail.date === date
    );

    const availabilityData = {
      id: existingIndex !== -1 ? doctorAvailability[existingIndex].id : Date.now().toString(),
      doctorId,
      date,
      timeSlots: timeSlots || [],
      isAvailable,
      notes: notes || '',
      updatedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      // Update existing availability
      doctorAvailability[existingIndex] = availabilityData;
    } else {
      // Create new availability
      doctorAvailability.push(availabilityData);
    }

    return NextResponse.json({
      success: true,
      data: availabilityData,
      message: 'Availability updated successfully'
    });

  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update availability'
    }, { status: 500 });
  }
}
