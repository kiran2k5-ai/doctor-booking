import { NextRequest, NextResponse } from 'next/server';
import { findDoctorById, mockAppointments } from '../../storage';
import { getTodayString, getLocalDateString, parseLocalDate, isPastDate } from '@/lib/dateUtils';

// Helper function to generate time slots dynamically
const generateTimeSlots = (doctorId: string, date: string) => {
  const doctor = findDoctorById(doctorId);
  if (!doctor) {
    console.warn('Doctor not found for ID:', doctorId);
    return [];
  }

  const slots = [];
  const requestedDate = new Date(date);
  const today = new Date();
  const isToday = requestedDate.toDateString() === today.toDateString();
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  // Check if the requested date is a working day for the doctor
  const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });
  if (!doctor.workingDays || !doctor.workingDays.includes(dayName)) {
    console.log('No working day for doctor', doctorId, 'on', dayName);
    return []; // No slots on non-working days
  }

  // Define working hours (9 AM to 6 PM by default)
  const workingStart = 9; // 9 AM
  const workingEnd = 18; // 6 PM
  
  // Get existing appointments for this doctor on this date
  const existingAppointments = mockAppointments.filter(apt => 
    apt.doctorId === doctorId && 
    apt.date === date && 
    apt.status !== 'cancelled'
  );

  console.log('Existing appointments for doctor', doctorId, 'on', date, ':', existingAppointments);

  let slotId = 1;

  // Generate 30-minute slots
  for (let hour = workingStart; hour < workingEnd; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip past time slots for today
      if (isToday && (hour < currentHour || (hour === currentHour && minute <= currentMinute))) {
        continue;
      }

      const timeString = formatTime(hour, minute);
      
      // Check if this slot is already booked
      const isBooked = existingAppointments.some(apt => apt.time === timeString);
      
      // Determine slot type
      let type: 'morning' | 'afternoon' | 'evening';
      if (hour < 12) {
        type = 'morning';
      } else if (hour < 17) {
        type = 'afternoon';
      } else {
        type = 'evening';
      }

      slots.push({
        id: `slot-${doctorId}-${date}-${slotId++}`,
        time: timeString,
        available: !isBooked,
        type,
        date,
        doctorId
      });
    }
  }

  return slots;
};

// Helper function to format time
const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
};

// GET /api/doctors/[id]/slots - Get available time slots for a doctor
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const doctorId = awaitedParams.id;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || getTodayString();

    console.log('Slots API called for doctor:', doctorId, 'date:', date, 'today:', getTodayString());

    // Validate doctor exists
    const doctor = findDoctorById(doctorId);
    if (!doctor) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Doctor not found'
      }, { status: 404 });
    }

    // Validate date format and ensure it's not in the past
    if (isPastDate(date)) {
      console.log('Rejecting past date:', date, 'Today is:', getTodayString());
      return NextResponse.json({
        success: false,
        error: 'Invalid date',
        message: 'Cannot book appointments for past dates'
      }, { status: 400 });
    }

    // Generate dynamic time slots
    const timeSlots = generateTimeSlots(doctorId, date);

    // Group slots by type with safe defaults
    const groupedSlots = {
      morning: timeSlots.filter(slot => slot.type === 'morning'),
      afternoon: timeSlots.filter(slot => slot.type === 'afternoon'),
      evening: timeSlots.filter(slot => slot.type === 'evening')
    };

    console.log('Generated slots for doctor', doctorId, 'on', date, ':', {
      totalSlots: timeSlots.length,
      groupedSlots,
      doctor: doctor.name
    }); // Debug log

    const requestedDate = parseLocalDate(date);

    return NextResponse.json({
      success: true,
      data: {
        doctorId,
        doctorName: doctor.name,
        date,
        dayOfWeek: requestedDate.toLocaleDateString('en-US', { weekday: 'long' }),
        slots: groupedSlots,
        total_slots: timeSlots.length,
        available_slots: timeSlots.filter(slot => slot.available).length,
        working_hours: doctor.workingHours,
        is_working_day: doctor.workingDays.includes(requestedDate.toLocaleDateString('en-US', { weekday: 'long' }))
      },
      message: timeSlots.length > 0 ? 'Time slots generated successfully' : 'No slots available for this date'
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
