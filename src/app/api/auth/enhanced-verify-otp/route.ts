// Enhanced OTP verification for both doctors and patients
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tempToken, otp } = await request.json();

    if (!tempToken || !otp) {
      return NextResponse.json({
        success: false,
        error: 'Token and OTP are required'
      }, { status: 400 });
    }

    // Decode the temporary token
    let otpData;
    try {
      otpData = JSON.parse(Buffer.from(tempToken, 'base64').toString());
    } catch {
      console.error('OTP VERIFY: Invalid tempToken received:', tempToken);
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 400 });
    }

    // Debug log for OTP expiry
    console.log('OTP VERIFY: Checking OTP for phone:', otpData.phone, 'Expires at:', new Date(otpData.expiresAt).toLocaleString(), 'Current time:', new Date().toLocaleString());

    // Check if OTP is expired (from tempToken)
    if (Date.now() > otpData.expiresAt) {
      console.error('OTP VERIFY: TempToken expired for phone:', otpData.phone);
      return NextResponse.json({
        success: false,
        error: 'OTP has expired'
      }, { status: 400 });
    }

    // For demo purposes, accept any 4-digit OTP
    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json({
        success: false,
        error: 'OTP must be 4 digits'
      }, { status: 400 });
    }

    // For demo, any 4-digit OTP is considered valid

    // Generate auth token
    const authToken = Buffer.from(JSON.stringify({
      userId: otpData.userData.id || `user_${Date.now()}`,
      userType: otpData.userType,
      phone: otpData.phone,
      userData: otpData.userData,
      loginTime: Date.now()
    })).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      userType: otpData.userType,
      authToken,
      userData: otpData.userData,
      redirectUrl: otpData.userType === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to verify OTP'
    }, { status: 500 });
  }
}
