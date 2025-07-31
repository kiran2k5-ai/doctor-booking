'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointments } from '../../../lib/useAppointments';
import { LocalStorageManager } from '../../../lib/storage';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  PlusIcon,
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

// Use the interface from the useAppointments hook
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  reason?: string;
  notes?: string;
  doctor?: {
    name: string;
    specialization: string;
    image?: string;
  };
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  
  // Use the new localStorage-enabled hook
  const {
    appointments,
    loading,
    error,
    cancelAppointment,
    refreshAppointments
  } = useAppointments('user123');

  // Debug logging
  useEffect(() => {
    console.log('Appointments page mounted with user123');
    console.log('Current appointments from hook:', appointments);
    console.log('Hook loading state:', loading);
    console.log('Hook error state:', error);
    
    // Check localStorage directly
    const directLocal = LocalStorageManager.getAppointments();
    console.log('Direct localStorage check:', directLocal);
  }, [appointments, loading, error]);
  
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [cancellingAppointment, setCancellingAppointment] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Initialize localStorage on component mount
  useEffect(() => {
    LocalStorageManager.initializeDefaultData();
  }, []);

  const handleCancelAppointment = async (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
    setShowActionMenu(null);
  };

  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    try {
      setCancellingAppointment(appointmentToCancel.id);
      
      const result = await cancelAppointment(appointmentToCancel.id, cancelReason || 'No reason provided');
      
      if (result.success) {
        setShowCancelModal(false);
        setAppointmentToCancel(null);
        setCancelReason('');
        // Show success message
        alert('Appointment cancelled successfully');
      } else {
        alert(result.error || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    } finally {
      setCancellingAppointment(null);
    }
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    // Navigate to reschedule page
    router.push(`/patient-dashboard/appointments/reschedule/${appointmentId}`);
    setShowActionMenu(null);
  };

  // Removed status color and label for patient dashboard as per request

  const filteredAppointments = Array.isArray(appointments) ? appointments.filter(appointment => {
    console.log('Filtering appointment:', {
      id: appointment.id,
      status: appointment.status,
      selectedTab,
      willShow: selectedTab === 'upcoming' ? appointment.status === 'confirmed' : (appointment.status === 'completed' || appointment.status === 'cancelled')
    });
    
    if (selectedTab === 'upcoming') {
      return appointment.status === 'confirmed';
    } else {
      return appointment.status === 'completed' || appointment.status === 'cancelled';
    }
  }) : [];

  console.log('All appointments:', appointments);
  console.log('Filtered appointments for', selectedTab, ':', filteredAppointments);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
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
              Upcoming ({Array.isArray(appointments) ? appointments.filter(a => a.status === 'confirmed').length : 0})
            </button>
            <button
              onClick={() => setSelectedTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'past'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Past ({Array.isArray(appointments) ? appointments.filter(a => a.status !== 'confirmed').length : 0})
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
                          {appointment.doctor?.name?.split(' ')[1]?.charAt(0) || 'D'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{appointment.doctor?.name || 'Unknown Doctor'}</h3>
                        <p className="text-sm text-gray-600">{appointment.doctor?.specialization || 'Specialist'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Status label removed as per request */}
                      {appointment.status === 'confirmed' && (
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === appointment.id ? null : appointment.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <EllipsisVerticalIcon className="w-5 h-5" />
                          </button>
                          {showActionMenu === appointment.id && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                              <button
                                onClick={() => handleRescheduleAppointment(appointment.id)}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <PencilIcon className="w-4 h-4" />
                                <span>Reschedule</span>
                              </button>
                              <button
                                onClick={() => handleCancelAppointment(appointment)}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                disabled={cancellingAppointment === appointment.id}
                              >
                                {cancellingAppointment === appointment.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                    <span>Cancelling...</span>
                                  </>
                                ) : (
                                  <>
                                    <TrashIcon className="w-4 h-4" />
                                    <span>Cancel</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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
                      <MapPinIcon className="w-4 h-4" />
                      <span>In-person consultation</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {appointment.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Click outside to close menu */}
      {showActionMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowActionMenu(null)}
        />
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && appointmentToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Appointment</h3>
            
            {/* Appointment Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src={appointmentToCancel.doctor?.image || '/api/placeholder/48/48'}
                  alt={appointmentToCancel.doctor?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{appointmentToCancel.doctor?.name}</h4>
                  <p className="text-sm text-gray-600">{appointmentToCancel.doctor?.specialization}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>{formatDate(appointmentToCancel.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{appointmentToCancel.time}</span>
                </div>
              </div>
            </div>

            {/* Cancellation Reason */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please let us know why you're cancelling..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Cancelling within 24 hours may incur charges. Please check our cancellation policy.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setAppointmentToCancel(null);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={cancellingAppointment !== null}
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancelAppointment}
                disabled={cancellingAppointment !== null}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {cancellingAppointment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Cancel Appointment</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
