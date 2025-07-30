'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointments } from '../../../lib/useAppointments';
import { useParams } from 'next/navigation';
import {
  ChevronLeftIcon,
  HeartIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  PhoneIcon,
  VideoCameraIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolid,
  HeartIcon as HeartSolid
} from '@heroicons/react/24/solid';
import { getTodayString, getLocalDateString, parseLocalDate, getDateOptions } from '@/lib/dateUtils';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  location: string;
  availability: string;
  nextSlot: string;
  image: string;
  isAvailable: boolean;
  isFavorite: boolean;
  distance: string;
  languages: string[];
  qualifications: string[];
  about: string;
  workingDays: string[];
  workingHours: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  type: 'morning' | 'afternoon' | 'evening';
}

export default function DoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;
  
  // Add the localStorage-enabled appointments hook
  const { bookAppointment } = useAppointments('user123');
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [availability, setAvailability] = useState<{ isAvailable: boolean; notes?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Use utility function to get today's date without timezone issues
    const today = new Date();
    console.log('Initial date set to:', getTodayString(), 'Local date object:', today);
    return today;
  });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<'in-person' | 'video'>('in-person');

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

  useEffect(() => {
    // Fetch doctor data from API
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setDoctor(result.data);
          } else {
            console.error('Failed to fetch doctor data:', result.message);
          }
        } else {
          console.error('Failed to fetch doctor data');
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };

    // Fetch doctor availability for selected date
    const fetchAvailability = async () => {
      try {
        const dateStr = getLocalDateString(selectedDate);
        const response = await fetch(`/api/doctor/availability?doctorId=${doctorId}&date=${dateStr}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setAvailability({ isAvailable: result.data.isAvailable, notes: result.data.notes });
          } else {
            setAvailability(null); // No record, treat as available
          }
        } else {
          setAvailability(null); // No record, treat as available
        }
      } catch (error) {
        setAvailability(null); // No record, treat as available
      }
    };

    if (doctorId) {
      setLoading(true);
      Promise.all([fetchDoctor(), fetchAvailability()]).finally(() => setLoading(false));
    }
  }, [doctorId, selectedDate]);

  // Separate useEffect for time slots to allow independent loading
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!doctorId) return;
      if (availability && availability.isAvailable === false) {
        setTimeSlots([]);
        return;
      }
      try {
        setSlotsLoading(true);
        setSelectedSlot(null); // Clear selected slot when date changes
        const dateStr = getLocalDateString(selectedDate);
        const response = await fetch(`/api/doctors/${doctorId}/slots?date=${dateStr}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.slots) {
            const morning = Array.isArray(result.data.slots.morning) ? result.data.slots.morning : [];
            const afternoon = Array.isArray(result.data.slots.afternoon) ? result.data.slots.afternoon : [];
            const evening = Array.isArray(result.data.slots.evening) ? result.data.slots.evening : [];
            const allSlots = [...morning, ...afternoon, ...evening];
            setTimeSlots(allSlots);
          } else {
            setTimeSlots([]);
          }
        } else {
          setTimeSlots([]);
        }
      } catch (error) {
        setTimeSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchTimeSlots();
  }, [doctorId, selectedDate, availability]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarSolid key={i} className="w-4 h-4 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="w-4 h-4 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const getSlotsByType = (type: 'morning' | 'afternoon' | 'evening') => {
    return timeSlots.filter(slot => slot.type === type);
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare appointment data
      const appointmentData = {
        doctorId: doctor?.id,
        patientId: 'user123', // In real app, get from authentication context
        date: getLocalDateString(selectedDate),
        time: timeSlots.find(slot => slot.id === selectedSlot)?.time,
        type: consultationType,
        notes: ''
      };

      console.log('Booking appointment with data:', appointmentData);

      // Use the localStorage-enabled booking function
      const result = await bookAppointment(appointmentData);

      if (result.success) {
        // Show success message and redirect
        alert('Appointment booked successfully!');
        router.push('/patient-dashboard/appointments');
      } else {
        // Handle error
        alert(result.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !doctor) {
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
            <h1 className="text-lg font-semibold text-gray-900">Doctor Details</h1>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <HeartIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="bg-white border-b">
        <div className="px-4 py-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500">
              {doctor?.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initial with gradient background
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-initial') as HTMLDivElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div className="fallback-initial w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center" style={{ display: doctor?.image ? 'none' : 'flex' }}>
                <span className="text-white font-semibold text-xl">
                  {doctor?.name?.split(' ')[1]?.charAt(0) || 'D'}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{doctor?.name}</h2>
              <p className="text-cyan-600 font-medium">{doctor?.specialization}</p>
              <p className="text-gray-600 text-sm">{doctor?.experience} experience</p>
              
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex space-x-1">
                  {renderStars(doctor?.rating || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  {doctor?.rating} ({doctor?.reviewCount} reviews)
                </span>
              </div>
              
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{doctor?.distance}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{doctor?.workingHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Doctor */}
      <div className="bg-white mt-2 border-b">
        <div className="px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{doctor?.about}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <AcademicCapIcon className="w-4 h-4" />
                <span>Qualifications</span>
              </div>
              <div className="space-y-1">
                {doctor?.qualifications?.map((qual, index) => (
                  <span key={index} className="block text-sm text-gray-900">{qual}</span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <UserGroupIcon className="w-4 h-4" />
                <span>Languages</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {doctor?.languages?.map((lang, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Type */}
      <div className="bg-white mt-2 border-b">
        <div className="px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Type</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConsultationType('in-person')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                consultationType === 'in-person'
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <MapPinIcon className="w-6 h-6 mx-auto mb-2 text-cyan-600" />
              <p className="font-medium text-gray-900">In-Person</p>
              <p className="text-sm text-gray-600">₹{doctor?.consultationFee}</p>
            </button>
            
            <button
              onClick={() => setConsultationType('video')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                consultationType === 'video'
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <VideoCameraIcon className="w-6 h-6 mx-auto mb-2 text-cyan-600" />
              <p className="font-medium text-gray-900">Video Call</p>
              <p className="text-sm text-gray-600">₹{(doctor?.consultationFee || 0) - 100}</p>
            </button>
          </div>
        </div>
      </div>

      {/* Available Slots */}
      <div className="bg-white mt-2">
        <div className="px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
          {/* Date Selection */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Select Date</h4>
            <div className="grid grid-cols-7 gap-2">
              {generateDateOptions().map((date, index) => {
                const isSelected = selectedDate.toDateString() === date.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    disabled={slotsLoading}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 text-white'
                        : slotsLoading
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } ${isToday ? 'ring-2 ring-cyan-200' : ''}`}
                  >
                    <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="font-medium">{date.getDate()}</div>
                    {isToday && <div className="text-xs text-cyan-600">Today</div>}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Current Date Display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            {slotsLoading && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div>
                <span>Loading slots...</span>
              </div>
            )}
          </div>
          {/* Doctor Unavailable Message */}
          {availability && availability.isAvailable === false ? (
            <div className="text-center py-8 text-red-500">
              <CalendarDaysIcon className="w-12 h-12 mx-auto mb-3 text-red-300" />
              <p className="text-lg font-medium mb-2">Doctor is unavailable on this date</p>
              {availability.notes && <p className="text-sm text-red-400">{availability.notes}</p>}
              <p className="text-xs text-gray-400 mt-1">Please try selecting a different date</p>
            </div>
          ) : (
            <>
              {/* Morning Slots */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Morning</h4>
                {slotsLoading ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : getSlotsByType('morning').length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {getSlotsByType('morning').map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && setSelectedSlot(slot.id)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedSlot === slot.id
                            ? 'bg-cyan-500 text-white'
                            : slot.available
                            ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No morning slots available</p>
                  </div>
                )}
              </div>
              {/* Afternoon Slots */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Afternoon</h4>
                {slotsLoading ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : getSlotsByType('afternoon').length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {getSlotsByType('afternoon').map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && setSelectedSlot(slot.id)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedSlot === slot.id
                            ? 'bg-cyan-500 text-white'
                            : slot.available
                            ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No afternoon slots available</p>
                  </div>
                )}
              </div>
              {/* Evening Slots */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Evening</h4>
                {slotsLoading ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : getSlotsByType('evening').length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {getSlotsByType('evening').map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && setSelectedSlot(slot.id)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedSlot === slot.id
                            ? 'bg-cyan-500 text-white'
                            : slot.available
                            ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No evening slots available</p>
                  </div>
                )}
              </div>
              {/* No slots available message */}
              {!slotsLoading && timeSlots.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDaysIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No appointments available</p>
                  <p className="text-sm text-gray-400">
                    Doctor may not be available on this date or all slots are booked
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Please try selecting a different date
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Book Appointment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600">Consultation Fee</p>
            <p className="font-semibold text-gray-900">
              ₹{consultationType === 'video' ? (doctor?.consultationFee || 0) - 100 : doctor?.consultationFee}
            </p>
          </div>
          {selectedSlot && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Selected Slot</p>
              <p className="font-semibold text-gray-900">
                {timeSlots.find(slot => slot.id === selectedSlot)?.time}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleBookAppointment}
          disabled={!selectedSlot}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            selectedSlot
              ? 'bg-cyan-500 text-white hover:bg-cyan-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedSlot ? 'Book Appointment' : 'Select a time slot'}
        </button>
      </div>
    </div>
  );
}
