'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  HeartIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  BellIcon,
  PlusIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
}

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Wilson',
      specialty: 'Cardiologist',
      date: '2025-07-30',
      time: '10:00 AM',
      status: 'upcoming',
      location: 'City Hospital, Room 201'
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      date: '2025-08-02',
      time: '2:30 PM',
      status: 'upcoming',
      location: 'Skin Care Clinic'
    },
    {
      id: '3',
      doctorName: 'Dr. Emily Rodriguez',
      specialty: 'General Physician',
      date: '2025-07-25',
      time: '9:00 AM',
      status: 'completed',
      location: 'General Hospital'
    }
  ];

  const healthMetrics: HealthMetric[] = [
    {
      id: '1',
      name: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      lastUpdated: '2025-07-28'
    },
    {
      id: '2',
      name: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'normal',
      lastUpdated: '2025-07-28'
    },
    {
      id: '3',
      name: 'Blood Sugar',
      value: '95',
      unit: 'mg/dL',
      status: 'normal',
      lastUpdated: '2025-07-27'
    },
    {
      id: '4',
      name: 'Weight',
      value: '68.5',
      unit: 'kg',
      status: 'normal',
      lastUpdated: '2025-07-26'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!user) {
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
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Hello, {user.name.split(' ')[0]}
                </h1>
                <p className="text-sm text-gray-500">How are you feeling today?</p>
              </div>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <BellIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/book-appointment')}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <PlusIcon className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Book Appointment</p>
              <p className="text-sm text-gray-500">Find a doctor</p>
            </div>
          </button>
          
          <button
            onClick={() => router.push('/patient-dashboard/records')}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Medical Records</p>
              <p className="text-sm text-gray-500">View history</p>
            </div>
          </button>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
          <button
            onClick={() => router.push('/patient-dashboard/appointments')}
            className="text-cyan-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {appointments.filter(apt => apt.status === 'upcoming').map((appointment) => (
            <div key={appointment.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{appointment.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  <button className="text-cyan-600 text-sm">
                    <PhoneIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Overview */}
      <div className="px-4 pb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          {healthMetrics.map((metric) => (
            <div key={metric.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 text-sm">{metric.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-500">{metric.unit}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Updated {metric.lastUpdated}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Records */}
      <div className="px-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Records</h2>
          <button
            onClick={() => router.push('/patient-dashboard/records')}
            className="text-cyan-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {appointments.filter(apt => apt.status === 'completed').slice(0, 2).map((appointment) => (
            <div key={appointment.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  <p className="text-sm text-gray-500 mt-1">{appointment.date} at {appointment.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
