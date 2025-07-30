'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BellIcon,
  Cog6ToothIcon,
  PowerIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface DoctorData {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
}

interface DashboardStats {
  todayAppointments: number;
  pendingAppointments: number;
  totalPatients: number;
  monthlyEarnings: number;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    monthlyEarnings: 0
  });
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem('userType');
    const userData = localStorage.getItem('userData');
    const authToken = localStorage.getItem('authToken');

    if (!authToken || userType !== 'doctor') {
      router.push('/login');
      return;
    }

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setDoctorData(parsedData);
        loadDashboardData(parsedData.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      }
    }
  }, [router]);

  const loadDashboardData = async (doctorId: string) => {
    try {
      // Load appointments and stats
      const [appointmentsRes, notificationsRes] = await Promise.all([
        fetch(`/api/doctor/appointments?doctorId=${doctorId}`),
        fetch(`/api/doctor/notifications?doctorId=${doctorId}`)
      ]);

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        // Calculate stats from appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = appointmentsData.data?.filter((apt: any) => apt.date === today) || [];
        const pendingAppts = appointmentsData.data?.filter((apt: any) => apt.status === 'confirmed') || [];
        
        setStats({
          todayAppointments: todayAppts.length,
          pendingAppointments: pendingAppts.length,
          totalPatients: appointmentsData.data?.length || 0,
          monthlyEarnings: appointmentsData.data?.reduce((sum: number, apt: any) => sum + (apt.consultationFee || 0), 0) || 0
        });
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setRecentNotifications(notificationsData.data || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    router.push('/login');
  };

  const quickActions = [
    {
      name: 'Today\'s Appointments',
      href: '/doctor-dashboard/appointments',
      icon: CalendarDaysIcon,
      color: 'bg-blue-500',
      count: stats.todayAppointments
    },
    {
      name: 'Manage Availability',
      href: '/doctor-dashboard/availability',
      icon: ClockIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Patient Records',
      href: '/doctor-dashboard/patients',
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      count: stats.totalPatients
    },
    {
      name: 'Earnings Report',
      href: '/doctor-dashboard/earnings',
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome, {doctorData?.name}
              </h1>
              <p className="text-sm text-gray-600">{doctorData?.specialization}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <BellIcon className="w-6 h-6" />
                {recentNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {recentNotifications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => router.push('/doctor-dashboard/settings')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Cog6ToothIcon className="w-6 h-6" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600"
              >
                <PowerIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-xl font-semibold text-gray-900">{stats.todayAppointments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <ClockIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-semibold text-gray-900">{stats.pendingAppointments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Patients</p>
                <p className="text-xl font-semibold text-gray-900">{stats.totalPatients}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Monthly</p>
                <p className="text-xl font-semibold text-gray-900">₹{stats.monthlyEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  onClick={() => router.push(action.href)}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{action.name}</p>
                    {action.count !== undefined && (
                      <p className="text-xs text-gray-600">{action.count} items</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        {recentNotifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {recentNotifications.slice(0, 5).map((notification, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {notification.type === 'appointment' ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <BellIcon className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => router.push('/doctor-dashboard')}
              className="flex flex-col items-center py-2 text-cyan-600"
            >
              <HomeIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => router.push('/doctor-dashboard/appointments')}
              className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600"
            >
              <CalendarDaysIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Appointments</span>
            </button>
            <button
              onClick={() => router.push('/doctor-dashboard/notifications')}
              className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600 relative"
            >
              <BellIcon className="w-5 h-5 mb-1" />
              {recentNotifications.filter(n => !n.isRead).length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {recentNotifications.filter(n => !n.isRead).length}
                  </span>
                </div>
              )}
              <span className="text-xs">Notifications</span>
            </button>
            <button
              onClick={() => router.push('/doctor-dashboard/profile')}
              className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600"
            >
              <UserIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>

        {/* Add padding to bottom to account for fixed navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
