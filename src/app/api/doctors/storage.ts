// Mock doctors database
// In production, this would be replaced with actual database

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  location: string;
  availability: string;
  nextSlot: string;
  image: string;
  isAvailable: boolean;
  distance: string;
  languages: string[];
  qualifications: string[];
  about: string;
  workingDays: string[];
  workingHours: string;
  hospitalId?: string;
  phoneNumber?: string;
  email?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  type: 'morning' | 'afternoon' | 'evening';
  date: string;
  doctorId: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  status: 'scheduled' | 'completed' | 'cancelled';
  consultationFee: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  cancelledAt?: string;
}

// Mock doctors data
export const mockDoctors: Doctor[] = [
  // Demo doctor always available for testing
  {
    id: 'demo',
    name: 'Dr. Demo Always',
    specialization: 'General Physician',
    experience: '5 years',
    rating: 5.0,
    reviewCount: 999,
    consultationFee: 100,
    location: 'Test Clinic, Everywhere',
    availability: 'Available today',
    nextSlot: '09:00 AM-06:00 PM',
    image: '',
    isAvailable: true,
    distance: '0 km',
    languages: ['English'],
    qualifications: ['MBBS'],
    about: 'Demo doctor for testing. Always available, all days.',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: '9:00 AM - 6:00 PM',
    hospitalId: 'demo-hospital',
    phoneNumber: '+91-9999999999',
    email: 'demo@demo.com'
  },
  {
    id: '1',
    name: 'Dr. Prakash Das',
    specialization: 'Psychologist',
    experience: '8 years',
    rating: 4.8,
    reviewCount: 127,
    consultationFee: 500,
    location: 'Apollo Hospital, Delhi',
    availability: 'Available today',
    nextSlot: '10:30 AM-07:00 PM',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    isAvailable: true,
    distance: '2.5 km',
    languages: ['English', 'Hindi'],
    qualifications: ['MBBS', 'MD Psychology', 'PhD Clinical Psychology'],
    about: 'Dr. Prakash Das is a highly experienced psychologist with over 8 years of practice. He specializes in cognitive behavioral therapy, anxiety disorders, and depression treatment. He has helped hundreds of patients overcome their mental health challenges.',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '10:00 AM - 7:00 PM',
    hospitalId: 'apollo-delhi-1',
    phoneNumber: '+91-9876543210',
    email: 'dr.prakash@apollohospital.com'
  },
  {
    id: '2',
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiologist',
    experience: '12 years',
    rating: 4.9,
    reviewCount: 234,
    consultationFee: 800,
    location: 'Max Healthcare, Mumbai',
    availability: 'Available today',
    nextSlot: '11:00 AM-06:00 PM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    isAvailable: true,
    distance: '1.8 km',
    languages: ['English', 'Hindi', 'Marathi'],
    qualifications: ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology'],
    about: 'Dr. Sarah Wilson is a renowned cardiologist with expertise in interventional cardiology and heart disease prevention. She has performed over 500 successful cardiac procedures.',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '11:00 AM - 6:00 PM',
    hospitalId: 'max-mumbai-1',
    phoneNumber: '+91-9876543211',
    email: 'dr.sarah@maxhealthcare.com'
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    specialization: 'Dermatologist',
    experience: '10 years',
    rating: 4.7,
    reviewCount: 189,
    consultationFee: 600,
    location: 'Fortis Hospital, Bangalore',
    availability: 'Available today',
    nextSlot: '09:30 AM-05:30 PM',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    isAvailable: true,
    distance: '3.2 km',
    languages: ['English', 'Hindi', 'Kannada'],
    qualifications: ['MBBS', 'MD Dermatology', 'Fellowship in Cosmetic Dermatology'],
    about: 'Dr. Michael Chen specializes in both medical and cosmetic dermatology. He has extensive experience in treating skin conditions and aesthetic procedures.',
    workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: '9:30 AM - 5:30 PM',
    hospitalId: 'fortis-bangalore-1',
    phoneNumber: '+91-9876543212',
    email: 'dr.michael@fortis.com'
  },
  {
    id: '4',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrician',
    experience: '15 years',
    rating: 4.9,
    reviewCount: 312,
    consultationFee: 450,
    location: 'AIIMS, New Delhi',
    availability: 'Available today',
    nextSlot: '08:00 AM-04:00 PM',
    image: 'https://images.unsplash.com/photo-1594824388853-c1c4ac42b5f1?w=150&h=150&fit=crop&crop=face',
    isAvailable: true,
    distance: '4.1 km',
    languages: ['English', 'Hindi', 'Spanish'],
    qualifications: ['MBBS', 'MD Pediatrics', 'Fellowship in Pediatric Cardiology'],
    about: 'Dr. Emily Rodriguez is a dedicated pediatrician with special interest in pediatric cardiology. She has been caring for children for over 15 years.',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: '8:00 AM - 4:00 PM',
    hospitalId: 'aiims-delhi-1',
    phoneNumber: '+91-9876543213',
    email: 'dr.emily@aiims.edu'
  },
  {
    id: '5',
    name: 'Dr. James Park',
    specialization: 'Orthopedic',
    experience: '18 years',
    rating: 4.8,
    reviewCount: 267,
    consultationFee: 750,
    location: 'Bone & Joint Clinic, Pune',
    availability: 'Available tomorrow',
    nextSlot: '10:00 AM-06:00 PM',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face',
    isAvailable: false,
    distance: '5.5 km',
    languages: ['English', 'Hindi', 'Marathi'],
    qualifications: ['MBBS', 'MS Orthopedics', 'Fellowship in Joint Replacement'],
    about: 'Dr. James Park is an expert orthopedic surgeon specializing in joint replacement and sports medicine. He has successfully performed over 1000 surgeries.',
    workingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '10:00 AM - 6:00 PM',
    hospitalId: 'bone-joint-pune-1',
    phoneNumber: '+91-9876543214',
    email: 'dr.james@bonejoint.com'
  },
  {
    id: '6',
    name: 'Dr. Lisa Thompson',
    specialization: 'Gynecologist',
    experience: '14 years',
    rating: 4.9,
    reviewCount: 198,
    consultationFee: 650,
    location: 'Women\'s Health Center, Chennai',
    availability: 'Available today',
    nextSlot: '09:00 AM-05:00 PM',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&h=150&fit=crop&crop=face',
    isAvailable: true,
    distance: '2.8 km',
    languages: ['English', 'Hindi', 'Tamil'],
    qualifications: ['MBBS', 'MD Gynecology & Obstetrics', 'Fellowship in Laparoscopy'],
    about: 'Dr. Lisa Thompson is a skilled gynecologist with expertise in minimally invasive procedures and women\'s reproductive health.',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: '9:00 AM - 5:00 PM',
    hospitalId: 'womens-health-chennai-1',
    phoneNumber: '+91-9876543215',
    email: 'dr.lisa@womenshealth.com'
  }
];

// Mock time slots data
export const mockTimeSlots: TimeSlot[] = [
  // Today's slots for Dr. Prakash Das
  { id: '1', time: '10:00 AM', available: true, type: 'morning', date: '2025-07-29', doctorId: '1' },
  { id: '2', time: '10:30 AM', available: true, type: 'morning', date: '2025-07-29', doctorId: '1' },
  { id: '3', time: '11:00 AM', available: false, type: 'morning', date: '2025-07-29', doctorId: '1' },
  { id: '4', time: '11:30 AM', available: true, type: 'morning', date: '2025-07-29', doctorId: '1' },
  { id: '5', time: '12:00 PM', available: true, type: 'morning', date: '2025-07-29', doctorId: '1' },
  { id: '6', time: '02:00 PM', available: true, type: 'afternoon', date: '2025-07-29', doctorId: '1' },
  { id: '7', time: '02:30 PM', available: true, type: 'afternoon', date: '2025-07-29', doctorId: '1' },
  { id: '8', time: '03:00 PM', available: false, type: 'afternoon', date: '2025-07-29', doctorId: '1' },
  { id: '9', time: '03:30 PM', available: true, type: 'afternoon', date: '2025-07-29', doctorId: '1' },
  { id: '10', time: '04:00 PM', available: true, type: 'afternoon', date: '2025-07-29', doctorId: '1' },
  { id: '11', time: '05:00 PM', available: true, type: 'evening', date: '2025-07-29', doctorId: '1' },
  { id: '12', time: '05:30 PM', available: true, type: 'evening', date: '2025-07-29', doctorId: '1' },
  { id: '13', time: '06:00 PM', available: true, type: 'evening', date: '2025-07-29', doctorId: '1' },
  { id: '14', time: '06:30 PM', available: false, type: 'evening', date: '2025-07-29', doctorId: '1' },
];

// Mock appointments data
export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    doctorId: '1',
    patientId: 'user123',
    date: '2025-07-30',
    time: '10:30 AM',
    type: 'in-person',
    status: 'scheduled',
    consultationFee: 500,
    notes: 'Regular checkup',
    createdAt: '2025-07-29T10:00:00Z'
  },
  {
    id: 'apt-2',
    doctorId: '2',
    patientId: 'user123',
    date: '2025-08-02',
    time: '2:30 PM',
    type: 'video',
    status: 'scheduled',
    consultationFee: 400,
    notes: 'Follow-up consultation',
    createdAt: '2025-07-29T14:00:00Z'
  },
  {
    id: 'apt-3',
    doctorId: '3',
    patientId: 'user123',
    date: '2025-07-25',
    time: '9:00 AM',
    type: 'in-person',
    status: 'completed',
    consultationFee: 450,
    notes: 'Annual health checkup completed',
    createdAt: '2025-07-24T09:00:00Z'
  },
  {
    id: 'apt-4',
    doctorId: '5',
    patientId: 'user123',
    date: '2025-07-20',
    time: '3:00 PM',
    type: 'in-person',
    status: 'completed',
    consultationFee: 600,
    notes: 'Knee pain consultation completed',
    createdAt: '2025-07-19T10:00:00Z'
  },
  {
    id: 'apt-5',
    doctorId: '4',
    patientId: 'user123',
    date: '2025-07-15',
    time: '11:00 AM',
    type: 'video',
    status: 'cancelled',
    consultationFee: 550,
    notes: 'Cancelled due to emergency',
    createdAt: '2025-07-14T08:00:00Z',
    cancelledAt: '2025-07-15T09:00:00Z'
  }
];

// Helper functions
export const findDoctorById = (id: string): Doctor | undefined => {
  return mockDoctors.find(doctor => doctor.id === id);
};

export const searchDoctors = (query: string, specialty?: string): Doctor[] => {
  return mockDoctors.filter(doctor => {
    const matchesQuery = !query || 
      doctor.name.toLowerCase().includes(query.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(query.toLowerCase()) ||
      doctor.location.toLowerCase().includes(query.toLowerCase());
    
    const matchesSpecialty = !specialty || specialty === 'all' ||
      doctor.specialization.toLowerCase() === specialty.toLowerCase();
    
    return matchesQuery && matchesSpecialty;
  });
};

export const getTimeSlotsByDoctor = (doctorId: string, date: string): TimeSlot[] => {
  return mockTimeSlots.filter(slot => 
    slot.doctorId === doctorId && slot.date === date
  );
};

export const bookAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
  const newAppointment: Appointment = {
    ...appointmentData,
    id: `apt-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  mockAppointments.push(newAppointment);
  
  // Mark the time slot as unavailable
  const timeSlot = mockTimeSlots.find(slot => 
    slot.doctorId === appointmentData.doctorId && 
    slot.date === appointmentData.date && 
    slot.time === appointmentData.time
  );
  
  if (timeSlot) {
    timeSlot.available = false;
  }
  
  return newAppointment;
};
