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

    // Import OTP store from login route (correct relative path)
    const { otpStore } = await import('../enhanced-login/route');
    const stored = otpStore[otpData.phone];
    console.log('OTP VERIFY: OTP store entry for phone:', otpData.phone, stored);
    if (!stored || Date.now() > stored.expiresAt) {
      console.error('OTP VERIFY: OTP store expired or missing for phone:', otpData.phone, stored);
      return NextResponse.json({
        success: false,
        error: 'OTP has expired. Please request a new one.'
      }, { status: 400 });
    }
    if (stored.otp !== otp) {
      console.error('OTP VERIFY: Incorrect OTP for phone:', otpData.phone, 'Expected:', stored.otp, 'Received:', otp);
      return NextResponse.json({
        success: false,
        error: 'Incorrect OTP. Please try again.'
      }, { status: 400 });
    }

    // OTP is valid, remove from store
    delete otpStore[otpData.phone];

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
