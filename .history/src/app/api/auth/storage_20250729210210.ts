// Shared OTP storage for development
// In production, use Redis or database

export interface OTPData {
  otp: string;
  expires: number;
  userId: string;
}

// Global OTP storage
export const otpStorage = new Map<string, OTPData>();

// Mock user database
export const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    phone: '+919876543210',
    name: 'John Doe'
  },
  {
    id: '2',
    email: 'admin@hospital.com',
    phone: '+919876543211',
    name: 'Admin User'
  },
  {
    id: '3',
    email: 'kiran@hospital.com',
    phone: '8838041680',
    name: 'Admin User'
  }
];
