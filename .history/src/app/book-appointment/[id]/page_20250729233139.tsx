'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<'in-person' | 'video'>('in-person');

  useEffect(() => {
    // Fetch doctor data from API
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        if (response.ok) {
          const doctorData = await response.json();
          setDoctor(doctorData);
        } else {
          console.error('Failed to fetch doctor data');
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };
    
    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  // Mock time slots
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '10:00 AM', available: true, type: 'morning' },
    { id: '2', time: '10:30 AM', available: true, type: 'morning' },
    { id: '3', time: '11:00 AM', available: false, type: 'morning' },
    { id: '4', time: '11:30 AM', available: true, type: 'morning' },
    { id: '5', time: '12:00 PM', available: true, type: 'morning' },
    { id: '6', time: '02:00 PM', available: true, type: 'afternoon' },
    { id: '7', time: '02:30 PM', available: true, type: 'afternoon' },
    { id: '8', time: '03:00 PM', available: false, type: 'afternoon' },
    { id: '9', time: '03:30 PM', available: true, type: 'afternoon' },
    { id: '10', time: '04:00 PM', available: true, type: 'afternoon' },
    { id: '11', time: '05:00 PM', available: true, type: 'evening' },
    { id: '12', time: '05:30 PM', available: true, type: 'evening' },
    { id: '13', time: '06:00 PM', available: true, type: 'evening' },
    { id: '14', time: '06:30 PM', available: false, type: 'evening' },
  ];

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

  const handleBookAppointment = () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    // In real app, make API call to book appointment
    const appointmentData = {
      doctorId: doctor?.id,
      doctorName: doctor?.name,
      date: selectedDate.toISOString().split('T')[0],
      time: timeSlots.find(slot => slot.id === selectedSlot)?.time,
      type: consultationType,
      fee: doctor?.consultationFee
    };

    console.log('Booking appointment:', appointmentData);
    
    // Show success message and redirect
    alert('Appointment booked successfully!');
    router.push('/patient-dashboard/appointments');
  };

  if (!doctor) {
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
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-semibold text-xl">
                {doctor.name.split(' ')[1]?.charAt(0) || 'D'}
              </span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{doctor.name}</h2>
              <p className="text-cyan-600 font-medium">{doctor.specialization}</p>
              <p className="text-gray-600 text-sm">{doctor.experience} experience</p>
              
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex space-x-1">
                  {renderStars(doctor.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {doctor.rating} ({doctor.reviewCount} reviews)
                </span>
              </div>
              
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{doctor.distance}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{doctor.workingHours}</span>
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
          <p className="text-gray-700 text-sm leading-relaxed">{doctor.about}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <AcademicCapIcon className="w-4 h-4" />
                <span>Qualifications</span>
              </div>
              <div className="space-y-1">
                {doctor.qualifications.map((qual, index) => (
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
                {doctor.languages.map((lang, index) => (
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
              <p className="text-sm text-gray-600">₹{doctor.consultationFee}</p>
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
              <p className="text-sm text-gray-600">₹{doctor.consultationFee - 100}</p>
            </button>
          </div>
        </div>
      </div>

      {/* Available Slots */}
      <div className="bg-white mt-2">
        <div className="px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
          
          {/* Date Selection */}
          <div className="flex items-center space-x-2 mb-4">
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
          
          {/* Morning Slots */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Morning</h4>
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
          </div>

          {/* Afternoon Slots */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Afternoon</h4>
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
          </div>

          {/* Evening Slots */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Evening</h4>
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
          </div>
        </div>
      </div>

      {/* Book Appointment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600">Consultation Fee</p>
            <p className="font-semibold text-gray-900">
              ₹{consultationType === 'video' ? doctor.consultationFee - 100 : doctor.consultationFee}
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
