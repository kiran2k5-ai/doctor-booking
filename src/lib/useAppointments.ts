'use client';

import { useState, useEffect } from 'react';
import { LocalStorageManager } from './storage';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  reason?: string;
  notes?: string;
  doctor?: {
    name: string;
    specialization: string;
    image?: string;
  };
  rescheduledAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export function useAppointments(patientId: string = 'user123') {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load appointments from localStorage on component mount
  useEffect(() => {
    loadAppointments();
  }, [patientId]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clean up any duplicate appointments first
      LocalStorageManager.cleanupDuplicateAppointments();

      // First try to get from localStorage
      const localAppointments = LocalStorageManager.getAppointments();
      console.log('Raw local appointments:', localAppointments);
      
      // Ensure localAppointments is an array
      if (Array.isArray(localAppointments) && localAppointments.length > 0) {
        const filteredLocal = localAppointments.filter((apt: Appointment) => apt.patientId === patientId);
        console.log('Filtered local appointments for patient', patientId, ':', filteredLocal);
        
        // Enrich appointments with doctor information if missing
        const enrichedAppointments = await Promise.all(
          filteredLocal.map(async (appointment: Appointment) => {
            if (!appointment.doctor && appointment.doctorId) {
              try {
                const doctorResponse = await fetch(`/api/doctors/${appointment.doctorId}`);
                if (doctorResponse.ok) {
                  const doctorResult = await doctorResponse.json();
                  if (doctorResult.success && doctorResult.data) {
                    return {
                      ...appointment,
                      doctor: {
                        name: doctorResult.data.name,
                        specialization: doctorResult.data.specialization,
                        image: doctorResult.data.image
                      }
                    };
                  }
                }
              } catch (error) {
                console.log('Failed to enrich appointment with doctor info:', error);
              }
            }
            return appointment;
          })
        );
        
        // Update localStorage with enriched data
        if (enrichedAppointments.some(apt => apt.doctor && !filteredLocal.find(local => local.id === apt.id && local.doctor))) {
          const allAppointments = LocalStorageManager.getAppointments();
          const updatedAppointments = allAppointments.map(apt => {
            const enriched = enrichedAppointments.find(enr => enr.id === apt.id);
            return enriched || apt;
          });
          LocalStorageManager.saveAppointments(updatedAppointments);
        }
        
        setAppointments(enrichedAppointments);
        setLoading(false);
        
        // Try to sync with server in background
        syncWithServer(enrichedAppointments);
        return;
      }

      // If no local data, fetch from server
      const response = await fetch(`/api/appointments?patientId=${patientId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setAppointments(result.data);
          // Save to localStorage for future use - avoid duplicates
          const allAppointments = LocalStorageManager.getAppointments();
          const existingAppointments = Array.isArray(allAppointments) ? allAppointments : [];
          
          // Create a Map to track existing appointment IDs
          const existingIds = new Set(existingAppointments.map(apt => apt.id));
          
          // Only add new appointments that don't already exist
          const newAppointments = result.data.filter((apt: Appointment) => !existingIds.has(apt.id));
          
          if (newAppointments.length > 0) {
            LocalStorageManager.saveAppointments([...existingAppointments, ...newAppointments]);
          }
        } else {
          // Handle case where result.data is not an array
          setAppointments([]);
          setError(result.message || 'Invalid data format received');
        }
      } else {
        setError('Failed to load appointments');
        setAppointments([]); // Set empty array as fallback
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError('Failed to load appointments');
      setAppointments([]); // Set empty array as fallback
    } finally {
      setLoading(false);
    }
  };

  const syncWithServer = async (localData: Appointment[]) => {
    // Note: Sync endpoint not implemented yet
    // For now, we rely on localStorage and manual refresh
    console.log('Sync with server skipped - endpoint not implemented');
  };

  const bookAppointment = async (appointmentData: Partial<Appointment>) => {
    try {
      setError(null);
      
      // Generate a more unique ID to prevent collisions
      const uniqueId = `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Fetch doctor information to enrich the appointment
      let doctorInfo = null;
      if (appointmentData.doctorId) {
        try {
          const doctorResponse = await fetch(`/api/doctors/${appointmentData.doctorId}`);
          if (doctorResponse.ok) {
            const doctorResult = await doctorResponse.json();
            if (doctorResult.success && doctorResult.data) {
              doctorInfo = {
                name: doctorResult.data.name,
                specialization: doctorResult.data.specialization,
                image: doctorResult.data.image
              };
            }
          }
        } catch (error) {
          console.log('Failed to fetch doctor info, continuing without it:', error);
        }
      }
      
      const newAppointment: Appointment = {
        id: uniqueId,
        patientId,
        status: 'confirmed',
        ...appointmentData,
        doctor: doctorInfo
      } as Appointment;

      // Optimistic update
      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      
      // Save to localStorage immediately with enriched data
      LocalStorageManager.addAppointment(newAppointment);

      // Try to sync with server
      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAppointment)
        });

        if (!response.ok) {
          console.log('Server booking failed, but saved locally');
        }
      } catch (serverError) {
        console.log('Offline mode - appointment saved locally');
      }

      return { success: true, data: newAppointment };
    } catch (error) {
      setError('Failed to book appointment');
      return { success: false, error: 'Failed to book appointment' };
    }
  };

  const cancelAppointment = async (appointmentId: string, reason?: string) => {
    try {
      setError(null);
      
      // Optimistic update
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId 
          ? { 
              ...apt, 
              status: 'cancelled' as const,
              cancelledAt: new Date().toISOString(),
              cancellationReason: reason
            }
          : apt
      );
      setAppointments(updatedAppointments);
      
      // Update localStorage immediately
      LocalStorageManager.updateAppointment(appointmentId, { 
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason
      });

      // Try to sync with server
      try {
        const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason })
        });

        if (!response.ok) {
          console.log('Server cancellation failed, but saved locally');
        }
      } catch (serverError) {
        console.log('Offline mode - cancellation saved locally');
      }

      return { success: true };
    } catch (error) {
      setError('Failed to cancel appointment');
      return { success: false, error: 'Failed to cancel appointment' };
    }
  };

  const rescheduleAppointment = async (appointmentId: string, newDate: string, newTime: string) => {
    try {
      setError(null);
      
      // Optimistic update
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId 
          ? { 
              ...apt, 
              date: newDate, 
              time: newTime,
              status: 'confirmed' as const,
              rescheduledAt: new Date().toISOString()
            }
          : apt
      );
      setAppointments(updatedAppointments);
      
      // Update localStorage immediately
      LocalStorageManager.updateAppointment(appointmentId, { 
        date: newDate, 
        time: newTime,
        status: 'confirmed',
        rescheduledAt: new Date().toISOString()
      });

      // Try to sync with server
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            date: newDate, 
            time: newTime,
            status: 'confirmed',
            rescheduledAt: new Date().toISOString()
          })
        });

        if (!response.ok) {
          console.log('Server reschedule failed, but saved locally');
        }
      } catch (serverError) {
        console.log('Offline mode - reschedule saved locally');
      }

      return { success: true };
    } catch (error) {
      setError('Failed to reschedule appointment');
      return { success: false, error: 'Failed to reschedule appointment' };
    }
  };

  const refreshAppointments = () => {
    loadAppointments();
  };

  return {
    appointments,
    loading,
    error,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    refreshAppointments
  };
}
