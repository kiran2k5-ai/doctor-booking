'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface Doctor {
  name: string;
  specialization: string;
  location: string;
  image?: string;
}

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  status: 'scheduled' | 'completed' | 'cancelled';
  consultationFee: number;
  notes?: string;
  createdAt: string;
  doctor?: Doctor;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  type: 'morning' | 'afternoon' | 'evening';
}

export default function RescheduleAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  useEffect(() => {
    if (appointment) {
      fetchTimeSlots();
    }
  }, [appointment, selectedDate]);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAppointment(result.data);
          setSelectedDate(new Date(result.data.date));
        }
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      setSlotsLoading(true);
      setError(null);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/doctors/${appointment?.doctorId}/slots?date=${dateStr}&excludeAppointment=${appointmentId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.slots) {
          // Flatten the grouped slots into a single array with safe checks
          const morning = Array.isArray(result.data.slots.morning) ? result.data.slots.morning : [];
          const afternoon = Array.isArray(result.data.slots.afternoon) ? result.data.slots.afternoon : [];
          const evening = Array.isArray(result.data.slots.evening) ? result.data.slots.evening : [];
          
          const allSlots = [...morning, ...afternoon, ...evening];
          setTimeSlots(allSlots);
          
          // Reset selected slot if it's not available on the new date
          if (selectedSlot && !allSlots.find(slot => slot.id === selectedSlot && slot.available)) {
            setSelectedSlot(null);
          }
        } else {
          setTimeSlots([]);
        }
      } else {
        setError('Failed to load available time slots');
        setTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setError('Failed to load available time slots');
      setTimeSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedSlot) {
      setError('Please select a new time slot');
      return;
    }

    const selectedTimeSlot = timeSlots.find(slot => slot.id === selectedSlot);
    if (!selectedTimeSlot?.available) {
      setError('Selected time slot is no longer available');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const updateData = {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTimeSlot.time,
        rescheduleReason: 'Patient requested reschedule',
        originalDate: appointment?.date,
        originalTime: appointment?.time
      };

      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      if (result.success) {
        // Show success message with details
        const successMessage = `Appointment rescheduled successfully!\nNew date: ${selectedDate.toLocaleDateString()}\nNew time: ${selectedTimeSlot.time}`;
        alert(successMessage);
        router.push('/patient-dashboard/appointments');
      } else {
        setError(result.message || 'Failed to reschedule appointment');
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setError('Failed to reschedule appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSlotsByType = (type: 'morning' | 'afternoon' | 'evening') => {
    return timeSlots.filter(slot => slot.type === type);
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading || !appointment) {
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
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-900 -ml-2"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Current Appointment Info */}
      <div className="bg-white border-b">
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Appointment</h2>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
              <span className="text-cyan-600 font-semibold text-xl">
                {appointment.doctor?.name?.split(' ')[1]?.charAt(0) || 'D'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{appointment.doctor?.name}</h3>
              <p className="text-cyan-600">{appointment.doctor?.specialization}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>{formatDate(new Date(appointment.date))}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{appointment.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white mt-2 border-b">
        <div className="px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select New Date</h3>
          <div className="grid grid-cols-7 gap-2">
            {generateDateOptions().map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  selectedDate.toDateString() === date.toDateString()
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <div className="text-xs">{formatDate(date).split(' ')[0]}</div>
                <div className="font-medium">{date.getDate()}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white mt-2">
        <div className="px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
          
          {/* Morning Slots */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Morning</h4>
            <div className="grid grid-cols-3 gap-2">
              {getSlotsByType('morning').length > 0 ? (
                getSlotsByType('morning').map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedSlot(slot.id)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors relative ${
                      selectedSlot === slot.id
                        ? 'bg-cyan-500 text-white'
                        : slot.available
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                    {selectedSlot === slot.id && (
                      <CheckIcon className="w-4 h-4 absolute top-1 right-1" />
                    )}
                  </button>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-500 text-sm">
                  No morning slots available
                </div>
              )}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Afternoon</h4>
            <div className="grid grid-cols-3 gap-2">
              {getSlotsByType('afternoon').length > 0 ? (
                getSlotsByType('afternoon').map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedSlot(slot.id)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors relative ${
                      selectedSlot === slot.id
                        ? 'bg-cyan-500 text-white'
                        : slot.available
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                    {selectedSlot === slot.id && (
                      <CheckIcon className="w-4 h-4 absolute top-1 right-1" />
                    )}
                  </button>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-500 text-sm">
                  No afternoon slots available
                </div>
              )}
            </div>
          </div>

          {/* Evening Slots */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Evening</h4>
            <div className="grid grid-cols-3 gap-2">
              {getSlotsByType('evening').length > 0 ? (
                getSlotsByType('evening').map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedSlot(slot.id)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors relative ${
                      selectedSlot === slot.id
                        ? 'bg-cyan-500 text-white'
                        : slot.available
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                    {selectedSlot === slot.id && (
                      <CheckIcon className="w-4 h-4 absolute top-1 right-1" />
                    )}
                  </button>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-500 text-sm">
                  No evening slots available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600">New Appointment</p>
            <p className="font-semibold text-gray-900">
              {formatDate(selectedDate)} {selectedSlot ? `at ${timeSlots.find(slot => slot.id === selectedSlot)?.time}` : ''}
            </p>
          </div>
        </div>
        <button
          onClick={handleReschedule}
          disabled={!selectedSlot || submitting}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            selectedSlot && !submitting
              ? 'bg-cyan-500 text-white hover:bg-cyan-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {submitting ? 'Rescheduling...' : selectedSlot ? 'Reschedule Appointment' : 'Select a time slot'}
        </button>
      </div>
    </div>
  );
}
