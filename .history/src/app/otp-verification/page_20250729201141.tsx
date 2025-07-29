'use client';

import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(55);
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleNumberPadClick = (number: string) => {
    const currentIndex = otp.findIndex(digit => digit === '');
    if (currentIndex !== -1) {
      handleOtpChange(currentIndex, number);
    }
  };

  const handleDelete = () => {
    const lastFilledIndex = otp.map((digit, index) => digit ? index : -1)
                              .filter(index => index !== -1)
                              .pop();
    if (lastFilledIndex !== undefined) {
      handleOtpChange(lastFilledIndex, '');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Small colored circles */}
        <div className="absolute top-20 right-16 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg font-bold">$</span>
        </div>
        
        <div className="absolute top-40 left-12 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-bold">$</span>
        </div>
        
        <div className="absolute bottom-32 right-8 w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg font-bold">$</span>
        </div>
        
        <div className="absolute bottom-20 left-20 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">$</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 ml-4">OTP Code Verification</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          {/* Message */}
          <div className="text-center mb-8">
            <p className="text-gray-600 text-sm mb-6">
              Code has been send to +91 ****99
            </p>

            {/* OTP Input Display */}
            <div className="flex justify-center space-x-4 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                  maxLength={1}
                />
              ))}
            </div>

            {/* Resend Code */}
            <p className="text-sm text-gray-600 mb-8">
              Resend code in{' '}
              <span className="text-cyan-500 font-medium">{resendCountdown} s</span>
            </p>

            {/* Verify Button */}
            <button
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-medium py-3 px-4 rounded-lg transition duration-200 mb-8"
              disabled={otp.some(digit => digit === '')}
            >
              Verify
            </button>
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {/* Row 1 */}
            <button
              onClick={() => handleNumberPadClick('1')}
              className="w-16 h-16 text-xl font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              1
            </button>
            <button
              onClick={() => handleNumberPadClick('2')}
              className="w-16 h-16 text-xl font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              2
            </button>
            <button
              onClick={() => handleNumberPadClick('3')}
              className="w-16 h-16 text-xl font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              3
            </button>

            {/* Row 2 */}
            <button
              onClick={() => handleNumberPadClick('4')}
              className="w-16 h-16 text-xl font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              4
            </button>
            <button
              onClick={() => handleNumberPadClick('5')}
              className="w-16 h-16 text-xl font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              5
            </button>
            <button
              onClick={() => handleNumberPadClick('6')}
              className="w-16 h-16 text-xl font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              6
            </button>

            {/* Row 3 */}
            <button
              onClick={() => handleNumberPadClick('7')}
              className="w-16 h-16 text-xl font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              7
            </button>
            <button
              onClick={() => handleNumberPadClick('8')}
              className="w-16 h-16 text-xl font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              8
            </button>
            <button
              onClick={() => handleNumberPadClick('9')}
              className="w-16 h-16 text-xl font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              9
            </button>

            {/* Row 4 */}
            <button className="w-16 h-16 text-xl font-semibold text-gray-400">
              *
            </button>
            <button
              onClick={() => handleNumberPadClick('0')}
              className="w-16 h-16 text-xl font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="w-16 h-16 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
