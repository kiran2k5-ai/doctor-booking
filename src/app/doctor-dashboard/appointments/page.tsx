'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRef } from 'react';
import { parseISO } from 'date-fns';

interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  status: 'scheduled' | 'completed' | 'cancelled';
  consultationFee: number;
  notes: string;
  patient?: {
    name: string;
    phone: string;
    age?: number;
  };
}

export default function DoctorAppointments() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'today' | 'upcoming' | 'past'>('today');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string>('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);


  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      setDoctorId(parsed.id);
      loadAppointments(parsed.id);
      // Poll for new appointments every 10 seconds
      const interval = setInterval(() => {
        loadAppointments(parsed.id);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, []);

  const loadAppointments = async (docId: string) => {
    try {
      const response = await fetch(`/api/doctor/appointments?doctorId=${docId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Mock patient data for appointments
          const appointmentsWithPatients = data.data.map((apt: any) => ({
            ...apt,
            patient: {
              name: `Patient ${apt.patientId.slice(-3)}`,
              phone: '+91 98765 43210',
              age: Math.floor(Math.random() * 50) + 20
            }
          }));
          setAppointments(appointmentsWithPatients);
        }
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/doctor/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status, notes })
      });

      if (response.ok) {
        // Refresh appointments
        loadAppointments(doctorId);
        alert(`Appointment ${status} successfully`);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const getFilteredAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (selectedTab) {
      case 'today':
        return appointments.filter(apt => apt.date === today && apt.status === 'scheduled');
      case 'upcoming':
        return appointments.filter(apt => apt.date >= today && apt.status === 'scheduled');
      case 'past':
        return appointments.filter(apt => apt.date < today || apt.status !== 'scheduled');
      default:
        return appointments;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // If a date is selected in calendar, filter to that date, else use tab logic
  const filteredAppointments = selectedDate
    ? appointments.filter(a => a.date === selectedDate.toISOString().split('T')[0])
    : getFilteredAppointments();

  // Mark days with appointments
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const hasAppointment = appointments.some(a => a.date === date.toISOString().split('T')[0]);
      if (hasAppointment) {
        return <div className="flex justify-center mt-1"><span className="w-2 h-2 bg-cyan-400 rounded-full inline-block"></span></div>;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Calendar Button and Modal */}
      <div className="px-4 pt-6">
        <button
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg shadow mb-4"
          onClick={() => setShowCalendar(true)}
        >
          Show Calendar
        </button>
        {showCalendar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md mx-auto">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowCalendar(false)}
                aria-label="Close Calendar"
              >
                ×
              </button>
              <style>{`
                .react-calendar__tile {
                  color: #111 !important;
                  font-weight: 500;
                }
                .react-calendar__month-view__days__day--neighboringMonth {
                  color: #d1d5db !important;
                }
                .react-calendar__tile--active,
                .react-calendar__tile--now.react-calendar__tile--active {
                  background: #22d3ee !important;
                  color: #111 !important;
                  border-radius: 0.5rem !important;
                  box-shadow: 0 0 0 2px #06b6d4;
                }
                .react-calendar__tile--active:focus {
                  outline: 2px solid #06b6d4;
                }
                .react-calendar__month-view__weekdays__weekday,
                .react-calendar__navigation__label,
                .react-calendar__navigation button {
                  color: #111 !important;
                  font-weight: 600;
                }
              `}</style>
              <Calendar
                onChange={date => {
                  setSelectedDate(date as Date);
                }}
                value={selectedDate}
                tileContent={tileContent}
                calendarType="iso8601"
                className="rounded-lg shadow border border-gray-200 w-full"
              />
              {selectedDate && (
                <button
                  className="mt-4 text-cyan-500 underline text-sm"
                  onClick={() => setSelectedDate(null)}
                >
                  Clear Date Filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-900 -ml-2"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Appointments</h1>
              <p className="text-sm text-gray-600">Manage your patient appointments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('today')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'today'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Today ({appointments.filter(a => {
                const today = new Date().toISOString().split('T')[0];
                return a.date === today && a.status === 'scheduled';
              }).length})
            </button>
            <button
              onClick={() => setSelectedTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'upcoming'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming ({appointments.filter(a => {
                const today = new Date().toISOString().split('T')[0];
                return a.date >= today && a.status === 'scheduled';
              }).length})
            </button>
            <button
              onClick={() => setSelectedTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'past'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Past ({appointments.filter(a => {
                const today = new Date().toISOString().split('T')[0];
                return a.date < today || a.status !== 'scheduled';
              }).length})
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
            <p className="text-gray-500">
              {selectedTab === 'today' 
                ? "You don't have any appointments scheduled for today."
                : selectedTab === 'upcoming'
                ? "You don't have any upcoming appointments."
                : "You don't have any past appointments to show."
              }
            </p>
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
                        <UserIcon className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{appointment.patient?.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          {appointment.patient?.phone}
                        </p>
                        {appointment.patient?.age && (
                          <p className="text-sm text-gray-600">Age: {appointment.patient.age}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      {appointment.status === 'scheduled' && (
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === appointment.id ? null : appointment.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <EllipsisVerticalIcon className="w-5 h-5" />
                          </button>
                          {showActionMenu === appointment.id && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                              <button
                                onClick={() => {
                                  updateAppointmentStatus(appointment.id, 'completed');
                                  setShowActionMenu(null);
                                }}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                                <span>Mark Complete</span>
                              </button>
                              <button
                                onClick={() => {
                                  updateAppointmentStatus(appointment.id, 'cancelled');
                                  setShowActionMenu(null);
                                }}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <XCircleIcon className="w-4 h-4" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ClockIcon className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  {/* Consultation Type & Fee */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.type === 'video' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{appointment.consultationFee}
                      </span>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
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
