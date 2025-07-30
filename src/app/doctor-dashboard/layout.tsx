'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  HomeIcon,
  CalendarDaysIcon,
  BellIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [pathname, setPathname] = useState<string>('');

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType');
    if (!authToken || userType !== 'doctor') {
      router.push('/login');
      return;
    }
    // Load notifications count
    loadNotifications();
    // Set pathname for active tab highlight (client only)
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, [router]);

  const loadNotifications = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        const response = await fetch(`/api/doctor/notifications?doctorId=${parsed.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setNotifications(data.data);
          }
        }
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => router.push('/doctor-dashboard')}
            className={`flex flex-col items-center py-2 ${
              pathname === '/doctor-dashboard'
                ? 'text-cyan-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <HomeIcon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => router.push('/doctor-dashboard/appointments')}
            className={`flex flex-col items-center py-2 ${
              pathname.includes('/appointments')
                ? 'text-cyan-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <CalendarDaysIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Appointments</span>
          </button>
          <button
            onClick={() => router.push('/doctor-dashboard/notifications')}
            className={`flex flex-col items-center py-2 relative ${
              pathname.includes('/notifications')
                ? 'text-cyan-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <BellIcon className="w-5 h-5 mb-1" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
            <span className="text-xs">Notifications</span>
          </button>
          <button
            onClick={() => router.push('/doctor-dashboard/profile')}
            className={`flex flex-col items-center py-2 ${
              pathname.includes('/profile')
                ? 'text-cyan-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <UserIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
