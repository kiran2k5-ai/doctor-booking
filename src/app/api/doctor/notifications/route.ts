// Doctor notifications API
import { NextRequest, NextResponse } from 'next/server';

// Mock notifications data
let mockNotifications = [
  {
    id: '1',
    doctorId: '1',
    type: 'appointment',
    title: 'New Appointment Booked',
    message: 'Patient John Doe has booked an appointment for Aug 2, 2025 at 11:00 AM',
    time: '2 minutes ago',
    read: false,
    appointmentId: 'apt-1753907283933'
  },
  {
    id: '2',
    doctorId: '1',
    type: 'cancellation',
    title: 'Appointment Cancelled',
    message: 'Patient cancelled appointment for today at 2:00 PM',
    time: '1 hour ago',
    read: false
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!doctorId) {
      return NextResponse.json({
        success: false,
        error: 'Doctor ID is required'
      }, { status: 400 });
    }

    // Filter notifications for the doctor
    let doctorNotifications = mockNotifications.filter(notif => notif.doctorId === doctorId);

    if (unreadOnly) {
      doctorNotifications = doctorNotifications.filter(notif => !notif.read);
    }

    // Sort by newest first
    doctorNotifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      success: true,
      data: doctorNotifications,
      unreadCount: doctorNotifications.filter(notif => !notif.read).length
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications'
    }, { status: 500 });
  }
}

// Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const { notificationId, markAllRead, doctorId } = await request.json();

    if (markAllRead && doctorId) {
      // Mark all notifications as read for this doctor
      mockNotifications = mockNotifications.map(notif => 
        notif.doctorId === doctorId ? { ...notif, read: true } : notif
      );
    } else if (notificationId) {
      // Mark specific notification as read
      const notificationIndex = mockNotifications.findIndex(notif => notif.id === notificationId);
      if (notificationIndex !== -1) {
        mockNotifications[notificationIndex].read = true;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Notification updated successfully'
    });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update notification'
    }, { status: 500 });
  }
}

// Add new notification (for when appointments are booked)
export async function POST(request: NextRequest) {
  try {
    const { doctorId, type, title, message, appointmentId } = await request.json();

    const newNotification = {
      id: Date.now().toString(),
      doctorId,
      type,
      title,
      message,
      time: new Date().toISOString(),
      read: false,
      appointmentId
    };

    mockNotifications.unshift(newNotification);

    // Keep only last 50 notifications
    if (mockNotifications.length > 50) {
      mockNotifications = mockNotifications.slice(0, 50);
    }

    return NextResponse.json({
      success: true,
      data: newNotification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification'
    }, { status: 500 });
  }
}
