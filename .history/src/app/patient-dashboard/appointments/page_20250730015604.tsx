'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  VideoCameraIcon,
  XMarkIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  type: 'in-person' | 'video';
  doctorImage?: string;
  notes?: string;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Wilson',
      specialty: 'Cardiologist',
      date: '2025-07-30',
      time: '10:00 AM',
      status: 'upcoming',
      location: 'City Hospital, Room 201',
      type: 'in-person',
      notes: 'Regular checkup and ECG'
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      date: '2025-08-02',
      time: '2:30 PM',
      status: 'upcoming',
      location: 'Video Consultation',
      type: 'video',
      notes: 'Follow-up consultation'
    },
    {
      id: '3',
      doctorName: 'Dr. Emily Rodriguez',
      specialty: 'General Physician',
      date: '2025-07-25',
      time: '9:00 AM',
      status: 'completed',
      location: 'General Hospital',
      type: 'in-person',
      notes: 'Annual health checkup completed'
    },
    {
      id: '4',
      doctorName: 'Dr. James Park',
      specialty: 'Orthopedic',
      date: '2025-07-20',
      time: '3:00 PM',
      status: 'completed',
      location: 'Bone & Joint Clinic',
      type: 'in-person',
      notes: 'Knee pain consultation completed'
    },
    {
      id: '5',
      doctorName: 'Dr. Lisa Thompson',
      specialty: 'Psychiatrist',
      date: '2025-07-15',
      time: '11:00 AM',
      status: 'cancelled',
      location: 'Mental Health Center',
      type: 'video',
      notes: 'Cancelled due to emergency'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedTab === 'upcoming') {
      return appointment.status === 'upcoming';
    } else {
      return appointment.status === 'completed' || appointment.status === 'cancelled';
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 -ml-2"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Appointments</h1>
            </div>
            <button
              onClick={() => router.push('/book-appointment')}
              className="bg-cyan-500 text-white p-2 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'upcoming'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming ({appointments.filter(a => a.status === 'upcoming').length})
            </button>
            <button
              onClick={() => setSelectedTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'past'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Past ({appointments.filter(a => a.status !== 'upcoming').length})
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="px-4 py-6">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {selectedTab} appointments
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedTab === 'upcoming' 
                ? "You don't have any upcoming appointments scheduled."
                : "You don't have any past appointments to show."
              }
            </p>
            {selectedTab === 'upcoming' && (
              <button
                onClick={() => router.push('/book-appointment')}
                className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Book Your First Appointment
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-cyan-600 font-semibold text-lg">
                          {appointment.doctorName.split(' ')[1]?.charAt(0) || 'D'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>{formatDate(appointment.date)}</span>
                      <ClockIcon className="w-4 h-4 ml-4" />
                      <span>{appointment.time}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {appointment.type === 'video' ? (
                        <VideoCameraIcon className="w-4 h-4" />
                      ) : (
                        <MapPinIcon className="w-4 h-4" />
                      )}
                      <span>{appointment.location}</span>
                    </div>

                    {appointment.notes && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    {appointment.status === 'upcoming' && (
                      <>
                        {appointment.type === 'video' ? (
                          <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
                            <VideoCameraIcon className="w-4 h-4" />
                            <span>Join Video Call</span>
                          </button>
                        ) : (
                          <button className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors flex items-center justify-center space-x-2">
                            <MapPinIcon className="w-4 h-4" />
                            <span>Get Directions</span>
                          </button>
                        )}
                        <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg">
                          <PhoneIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    {appointment.status === 'completed' && (
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        View Report
                      </button>
                    )}
                    
                    {appointment.status === 'cancelled' && (
                      <button className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors">
                        Rebook Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
