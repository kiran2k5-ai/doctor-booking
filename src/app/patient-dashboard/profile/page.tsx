'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '../../../lib/useProfile';
import { LocalStorageManager } from '../../../lib/storage';
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
  
  // Use the new localStorage-enabled profile hook
  const {
    profile,
    loading,
    saving,
    error,
    updateProfile
  } = useProfile('user123');
  
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Update local state when profile changes
  useEffect(() => {
    if (profile) {
      setUser(profile);
      setEditForm(profile);
    }
  }, [profile]);

  // Initialize localStorage on component mount
  useEffect(() => {
    LocalStorageManager.initializeDefaultData();
  }, []);

  const saveProfile = async () => {
    try {
      const result = await updateProfile(editForm);
      
      if (result.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      LocalStorageManager.logout();
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
      action: () => setActiveModal('medical-info'),
      showChevron: true
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <BellIcon className="w-6 h-6" />,
      action: () => setActiveModal('notifications'),
      showChevron: true
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      action: () => setActiveModal('privacy'),
      showChevron: true
    },
    {
      id: 'password',
      label: 'Change Password',
      icon: <LockClosedIcon className="w-6 h-6" />,
      action: () => setActiveModal('change-password'),
      showChevron: true
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <QuestionMarkCircleIcon className="w-6 h-6" />,
      action: () => setActiveModal('help'),
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

  // Modal components
  const renderModal = () => {
    switch (activeModal) {
      case 'medical-info':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500">
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <textarea
                    placeholder="List any allergies..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="Emergency contact name and phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    alert('Medical information saved!');
                  }}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Appointment Reminders</h4>
                    <p className="text-sm text-gray-600">Get notified about upcoming appointments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive SMS for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Get email updates and newsletters</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    alert('Notification preferences saved!');
                  }}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );

      case 'change-password':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    alert('Password changed successfully!');
                  }}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Help & Support</h3>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="space-y-3">
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">📞 Contact Support</h4>
                    <p className="text-sm text-gray-600 mt-1">Call us at +1-800-DOCTOR</p>
                  </button>
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">💬 Live Chat</h4>
                    <p className="text-sm text-gray-600 mt-1">Chat with our support team</p>
                  </button>
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">📧 Email Support</h4>
                    <p className="text-sm text-gray-600 mt-1">support@doctorbooking.com</p>
                  </button>
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">❓ FAQ</h4>
                    <p className="text-sm text-gray-600 mt-1">Find answers to common questions</p>
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            onClick={() => window.location.reload()}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={editForm.dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={editForm.gender || ''}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={editForm.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Enter your address"
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
      
      {/* Render active modal */}
      {activeModal && renderModal()}
    </div>
  );
}
