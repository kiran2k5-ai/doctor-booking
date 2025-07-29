import { NextRequest, NextResponse } from 'next/server';
import { getTimeSlotsByDoctor } from '../../storage';

// GET /api/doctors/[id]/slots - Get available time slots for a doctor
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const doctorId = awaitedParams.id;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const timeSlots = getTimeSlotsByDoctor(doctorId, date);

    // Group slots by type
    const groupedSlots = {
      morning: timeSlots.filter(slot => slot.type === 'morning'),
      afternoon: timeSlots.filter(slot => slot.type === 'afternoon'),
      evening: timeSlots.filter(slot => slot.type === 'evening')
    };

    return NextResponse.json({
      success: true,
      data: {
        doctorId,
        date,
        slots: groupedSlots,
        total_slots: timeSlots.length,
        available_slots: timeSlots.filter(slot => slot.available).length
      },
      message: 'Time slots fetched successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch time slots'
    }, { status: 500 });
  }
}
