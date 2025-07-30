'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AvailabilitySlot {
  id: string;
  date: string;
  timeSlots: string[];
  isAvailable: boolean;
  notes?: string;
}

export default function DoctorAvailability() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [timeSlots] = useState([
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState<string>('');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      setDoctorId(parsed.id);
      loadAvailability(parsed.id, selectedDate);
    }
  }, [selectedDate]);

  const loadAvailability = async (docId: string, date: string) => {
    try {
      const response = await fetch(`/api/doctor/availability?doctorId=${docId}&date=${date}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSelectedSlots(data.data.timeSlots || []);
          setIsAvailable(data.data.isAvailable);
          setNotes(data.data.notes || '');
        } else {
          // Default availability for new dates
          setSelectedSlots(timeSlots.slice(0, 8)); // Default morning slots
          setIsAvailable(true);
          setNotes('');
        }
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  const handleSlotToggle = (slot: string) => {
    setSelectedSlots(prev => 
      prev.includes(slot) 
        ? prev.filter(s => s !== slot)
        : [...prev, slot].sort()
    );
  };

  const handleSaveAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/doctor/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId,
          date: selectedDate,
          timeSlots: selectedSlots,
          isAvailable,
          notes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Availability updated successfully!');
      } else {
        alert('Failed to update availability');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Error saving availability');
    } finally {
      setLoading(false);
    }
  };

  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <h1 className="text-xl font-semibold text-gray-900">Manage Availability</h1>
              <p className="text-sm text-gray-600">Set your available time slots</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Date Selection */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              Select Date
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {getNext7Days().map((day) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedDate === day.date
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xs font-medium">{day.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Availability Status</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAvailable(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isAvailable 
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CheckIcon className="w-5 h-5" />
                <span>Available</span>
              </button>
              <button
                onClick={() => setIsAvailable(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  !isAvailable 
                    ? 'bg-red-100 text-red-700 border-2 border-red-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <XMarkIcon className="w-5 h-5" />
                <span>Not Available</span>
              </button>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        {isAvailable && (
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Available Time Slots
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Select the time slots when you'll be available
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => handleSlotToggle(slot)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedSlots.includes(slot)
                        ? 'bg-cyan-100 text-cyan-700 border-2 border-cyan-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Notes (Optional)</h2>
          </div>
          <div className="p-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special notes about your availability..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              rows={3}
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveAvailability}
          disabled={loading}
          className="w-full bg-cyan-500 text-white py-4 rounded-xl font-semibold hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Availability'}
        </button>
      </div>
    </div>
  );
}
