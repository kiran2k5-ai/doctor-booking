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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile?userId=user123');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUser(result.data);
          setEditForm(result.data);
        } else {
          setError('Failed to load profile');
        }
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch('/api/profile?userId=user123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.data);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
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

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                onClick={saveProfile}
                disabled={saving}
                className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
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

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={editForm.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <PencilIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white px-4 py-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-semibold text-2xl">
              {user.name.charAt(0)}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
          <p className="text-gray-600 mt-1">{user.email}</p>
        </div>
      </div>

      <div className="bg-white mt-2 px-4 py-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <PhoneIcon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{user.phone}</p>
            </div>
          </div>
          {user.dateOfBirth && (
            <div className="flex items-center space-x-3">
              <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium text-gray-900">
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white mt-2">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              index === menuItems.length - 1 ? 'border-b-0' : ''
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
  );
}
