'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  MagnifyingGlassIcon, 
  BellIcon,
  HeartIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [user, setUser] = useState<{ phone: string; name?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    // Handle Google OAuth session
    if (session?.user) {
      const userType = session.user.userType || 'patient';
      const redirectUrl = userType === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
      
      // Save session data to localStorage for compatibility
      localStorage.setItem('authToken', `google-${session.user.id}`);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userData', JSON.stringify({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.email, // Use email as phone for Google users
        userType: userType
      }));

      router.push(redirectUrl);
      return;
    }

    // Handle traditional login
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router, session, status]);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Prakash das',
      specialty: 'Psychologist',
      image: '/api/placeholder/100/100',
      available: true,
      rating: 4.8,
      experience: '10 years',
      consultationFee: 500,
      timeSlots: ['09:30 AM-07:00 PM']
    },
    {
      id: 2,
      name: 'Dr. Prakash das',
      specialty: 'Psychologist', 
      image: '/api/placeholder/100/100',
      available: true,
      rating: 4.7,
      experience: '8 years',
      consultationFee: 450,
      timeSlots: ['09:30 AM-07:00 PM']
    },
    {
      id: 3,
      name: 'Dr. Prakash das',
      specialty: 'Psychologist',
      image: '/api/placeholder/100/100', 
      available: true,
      rating: 4.9,
      experience: '12 years',
      consultationFee: 600,
      timeSlots: ['09:30 AM-07:00 PM']
    },
    {
      id: 4,
      name: 'Dr. Prakash das',
      specialty: 'Psychologist',
      image: '/api/placeholder/100/100',
      available: true,
      rating: 4.6,
      experience: '6 years', 
      consultationFee: 400,
      timeSlots: ['09:30 AM-07:00 PM']
    }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">P</span>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Hello, {user.name || 'Priya'}</p>
            <p className="text-gray-500 text-sm">@priyanjalisuthar</p>
          </div>
        </div>
        <div className="relative">
          <BellIcon className="w-6 h-6 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Doctors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Doctors List */}
      <div className="px-4 space-y-4 mb-20">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start space-x-4">
              {/* Doctor Image */}
              <div className="relative">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg"></div>
                </div>
                {/* Online Status */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-cyan-500 text-sm">{doctor.specialty}</p>
                    {doctor.available && (
                      <p className="text-green-500 text-sm font-medium">Available Today</p>
                    )}
                  </div>
                  <HeartIcon className="w-5 h-5 text-gray-400" />
                </div>

                {/* Rating and Experience */}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>⭐ {doctor.rating}</span>
                  <span>• {doctor.experience}</span>
                  <span>• ₹{doctor.consultationFee}</span>
                </div>

                {/* Time Slot */}
                <p className="text-gray-600 text-sm mt-1">{doctor.timeSlots[0]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-3">
          <div className="flex flex-col items-center space-y-1">
            <MagnifyingGlassIcon className="w-6 h-6 text-cyan-500" />
            <span className="text-xs text-cyan-500 font-medium">Find Doctor</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <CalendarIcon className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Appointments</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <DocumentTextIcon className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Records</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <UserIcon className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
