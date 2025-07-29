'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserCircleIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  bloodType?: string;
  allergies?: string[];
  profileImage?: string;
}

interface ProfileMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  showChevron?: boolean;
  color?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Add mock profile data
      setUser({
        ...parsedUser,
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        address: '123 Main Street, City, State 12345',
        emergencyContact: '+919876543210',
        bloodType: 'O+',
        allergies: ['Peanuts', 'Shellfish']
      });
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems: ProfileMenuItem[] = [
    {
      id: 'personal-info',
      label: 'Personal Information',
      icon: <UserCircleIcon className="w-6 h-6" />,
      action: () => setIsEditing(true),
      showChevron: true
    },
    {
      id: 'medical-info',
      label: 'Medical Information',
      icon: <DocumentTextIcon className="w-6 h-6" />,
      action: () => console.log('Medical info'),
      showChevron: true
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <BellIcon className="w-6 h-6" />,
      action: () => console.log('Notifications'),
      showChevron: true
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      action: () => console.log('Privacy'),
      showChevron: true
    },
    {
      id: 'password',
      label: 'Change Password',
      icon: <LockClosedIcon className="w-6 h-6" />,
      action: () => console.log('Change password'),
      showChevron: true
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <QuestionMarkCircleIcon className="w-6 h-6" />,
      action: () => console.log('Help'),
      showChevron: true
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <ArrowRightOnRectangleIcon className="w-6 h-6" />,
      action: handleLogout,
      showChevron: false,
      color: 'text-red-600'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 -ml-2"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">Edit Profile</h1>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="px-4 py-6">
          {/* Profile Picture */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold text-2xl">
                  {user.name.charAt(0)}
                </span>
              </div>
              <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg border border-gray-200">
                <CameraIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                defaultValue={user.phone}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                defaultValue={user.dateOfBirth}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                defaultValue={user.gender}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                defaultValue={user.address}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
              <input
                type="tel"
                defaultValue={user.emergencyContact}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
              <select
                defaultValue={user.bloodType}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Known Allergies</label>
              <input
                type="text"
                defaultValue={user.allergies?.join(', ')}
                placeholder="Enter allergies separated by commas"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
          </div>
        </div>
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
              <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xl">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.phone}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="px-4 py-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>Date of Birth</span>
              </div>
              <p className="font-medium text-gray-900">{user.dateOfBirth || 'Not set'}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <UserCircleIcon className="w-4 h-4" />
                <span>Gender</span>
              </div>
              <p className="font-medium text-gray-900">{user.gender || 'Not set'}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <PhoneIcon className="w-4 h-4" />
                <span>Emergency Contact</span>
              </div>
              <p className="font-medium text-gray-900">{user.emergencyContact || 'Not set'}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <DocumentTextIcon className="w-4 h-4" />
                <span>Blood Type</span>
              </div>
              <p className="font-medium text-gray-900">{user.bloodType || 'Not set'}</p>
            </div>
          </div>
          
          {user.address && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <HomeIcon className="w-4 h-4" />
                <span>Address</span>
              </div>
              <p className="font-medium text-gray-900">{user.address}</p>
            </div>
          )}

          {user.allergies && user.allergies.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500 mb-2">Known Allergies</div>
              <div className="flex flex-wrap gap-2">
                {user.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 pb-20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className={`flex items-center space-x-3 ${item.color || 'text-gray-900'}`}>
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.showChevron && (
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
