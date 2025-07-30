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
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 400 });
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expiresAt) {
      return NextResponse.json({
        success: false,
        error: 'OTP has expired'
      }, { status: 400 });
    }

    // Verify OTP (in demo, accept any 6-digit number)
    if (otp.length !== 6) {
      return NextResponse.json({
        success: false,
        error: 'Invalid OTP'
      }, { status: 400 });
    }

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
