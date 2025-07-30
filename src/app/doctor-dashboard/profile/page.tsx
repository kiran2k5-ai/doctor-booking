'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  UserIcon,
  PhoneIcon,
  AcademicCapIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface DoctorProfile {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  experience: number;
  qualification: string;
  location: string;
  consultationFee: number;
  about: string;
  availableHours: {
    start: string;
    end: string;
  };
  rating: number;
  totalPatients: number;
}

export default function DoctorProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<DoctorProfile>>({});

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      loadDoctorProfile(parsed.id);
    }
  }, []);

  const loadDoctorProfile = async (doctorId: string) => {
    try {
      const response = await fetch(`/api/doctors/${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Provide default availableHours if missing
          const safeProfile = {
            ...data.data,
            availableHours: data.data.availableHours || { start: '', end: '' }
          };
          setProfile(safeProfile);
          setFormData(safeProfile);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit - reset form data
      setFormData(profile || {});
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/doctors/${profile?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
          setEditMode(false);
          alert('Profile updated successfully!');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
          <p className="text-gray-500">Unable to load doctor profile.</p>
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
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-600">Manage your professional information</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                {editMode ? (
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-2xl font-bold bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white placeholder-white/70"
                    placeholder="Doctor Name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                )}
                <p className="text-cyan-100 mt-1">{profile.specialization}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span>⭐ {profile.rating}/5</span>
                  <span>{profile.totalPatients}+ Patients</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  {editMode ? (
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 flex-1"
                      placeholder="Phone Number"
                    />
                  ) : (
                    <span className="text-gray-900">{profile.phone}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 flex-1"
                      placeholder="Location"
                    />
                  ) : (
                    <span className="text-gray-900">{profile.location}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.qualification || ''}
                        onChange={(e) => handleInputChange('qualification', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 w-full mt-1"
                        placeholder="Qualification"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{profile.qualification}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    {editMode ? (
                      <input
                        type="number"
                        value={formData.experience || ''}
                        onChange={(e) => handleInputChange('experience', parseInt(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 w-full mt-1"
                        placeholder="Years of Experience"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{profile.experience} years</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CurrencyRupeeIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Consultation Fee</p>
                    {editMode ? (
                      <input
                        type="number"
                        value={formData.consultationFee || ''}
                        onChange={(e) => handleInputChange('consultationFee', parseInt(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 w-full mt-1"
                        placeholder="Fee in ₹"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">₹{profile.consultationFee}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Available Hours</p>
                    <p className="font-medium text-gray-900">
                      {(profile.availableHours?.start || '--')} - {(profile.availableHours?.end || '--')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              {editMode ? (
                <textarea
                  value={formData.about || ''}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  placeholder="Tell patients about yourself..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {profile.about || 'No description available.'}
                </p>
              )}
            </div>

            {/* Statistics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-cyan-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-cyan-600">{profile.totalPatients}+</p>
                  <p className="text-sm text-gray-600">Total Patients</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{profile.rating}</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{profile.experience}</p>
                  <p className="text-sm text-gray-600">Years Exp.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">₹{profile.consultationFee}</p>
                  <p className="text-sm text-gray-600">Consultation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
