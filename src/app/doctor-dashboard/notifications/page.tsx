'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  BellIcon,
  CalendarDaysIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'update' | 'alert';
  isRead: boolean;
  createdAt: string;
  appointmentId?: string;
  patientName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

export default function DoctorNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'appointment'>('all');
  const [doctorId, setDoctorId] = useState<string>('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      setDoctorId(parsed.id);
      loadNotifications(parsed.id);
    }
  }, []);

  const loadNotifications = async (docId: string) => {
    try {
      const response = await fetch(`/api/doctor/notifications?doctorId=${docId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/doctor/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notificationId, 
          isRead: true 
        })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.isRead)
        .map(n => n.id);

      const response = await fetch('/api/doctor/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          markAllRead: true,
          doctorId 
        })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch('/api/doctor/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notif => notif.id !== notificationId)
        );
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'appointment':
        return notifications.filter(n => n.type === 'appointment');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <CalendarDaysIcon className="w-5 h-5 text-blue-500" />;
      case 'reminder':
        return <ClockIcon className="w-5 h-5 text-orange-500" />;
      case 'update':
        return <BellIcon className="w-5 h-5 text-green-500" />;
      case 'alert':
        return <BellIcon className="w-5 h-5 text-red-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'reminder':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'update':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'alert':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
                <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-cyan-600 font-medium hover:text-cyan-700"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b">
        <div className="px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'all'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'unread'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('appointment')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'appointment'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Appointments ({notifications.filter(n => n.type === 'appointment').length})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {filter !== 'all' ? filter : ''} notifications
            </h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : filter === 'appointment'
                ? "No appointment notifications to show."
                : "You don't have any notifications yet."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                  notification.isRead ? 'border-gray-100' : 'border-cyan-200 bg-cyan-50/30'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(notification.type)}`}>
                              {notification.type}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                            )}
                          </div>
                        </div>

                        {/* Appointment Details */}
                        {notification.type === 'appointment' && notification.patientName && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <UserIcon className="w-4 h-4" />
                                <span>{notification.patientName}</span>
                              </div>
                              {notification.appointmentDate && (
                                <div className="flex items-center space-x-1">
                                  <CalendarDaysIcon className="w-4 h-4" />
                                  <span>{new Date(notification.appointmentDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              {notification.appointmentTime && (
                                <div className="flex items-center space-x-1">
                                  <ClockIcon className="w-4 h-4" />
                                  <span>{notification.appointmentTime}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {formatDateTime(notification.createdAt)}
                          </span>
                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="flex items-center space-x-1 text-xs text-cyan-600 hover:text-cyan-700"
                              >
                                <CheckIcon className="w-3 h-3" />
                                <span>Mark read</span>
                              </button>
                            )}
                            <div className="relative">
                              <button
                                onClick={() => setShowActionMenu(showActionMenu === notification.id ? null : notification.id)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <EllipsisVerticalIcon className="w-4 h-4" />
                              </button>
                              {showActionMenu === notification.id && (
                                <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                                  {!notification.isRead && (
                                    <button
                                      onClick={() => {
                                        markAsRead(notification.id);
                                        setShowActionMenu(null);
                                      }}
                                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      <CheckIcon className="w-4 h-4" />
                                      <span>Mark read</span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      deleteNotification(notification.id);
                                      setShowActionMenu(null);
                                    }}
                                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
