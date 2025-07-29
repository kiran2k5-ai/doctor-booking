import { NextRequest, NextResponse } from 'next/server';
import { mockDoctors, searchDoctors } from './storage';

// GET /api/doctors - Get all doctors or search doctors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const specialty = searchParams.get('specialty') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Search doctors based on query and specialty
    const filteredDoctors = searchDoctors(query, specialty);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        doctors: paginatedDoctors,
        pagination: {
          current_page: page,
          per_page: limit,
          total: filteredDoctors.length,
          total_pages: Math.ceil(filteredDoctors.length / limit),
          has_next: endIndex < filteredDoctors.length,
          has_prev: page > 1
        }
      },
      message: `Found ${filteredDoctors.length} doctors`
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch doctors'
    }, { status: 500 });
  }
}

// POST /api/doctors - Add a new doctor (for admin use)
export async function POST(request: NextRequest) {
  try {
    const doctorData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'specialization', 'experience', 'consultationFee', 'location'];
    const missingFields = requiredFields.filter(field => !doctorData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Generate new doctor ID
    const newId = (mockDoctors.length + 1).toString();

    // Create new doctor object
    const newDoctor = {
      id: newId,
      name: doctorData.name,
      specialization: doctorData.specialization,
      experience: doctorData.experience,
      rating: doctorData.rating || 4.5,
      reviewCount: doctorData.reviewCount || 0,
      consultationFee: doctorData.consultationFee,
      location: doctorData.location,
      availability: doctorData.availability || 'Available today',
      nextSlot: doctorData.nextSlot || '10:00 AM-06:00 PM',
      image: doctorData.image || '/doctors/default.jpg',
      isAvailable: doctorData.isAvailable !== undefined ? doctorData.isAvailable : true,
      distance: doctorData.distance || '0 km',
      languages: doctorData.languages || ['English'],
      qualifications: doctorData.qualifications || ['MBBS'],
      about: doctorData.about || 'Experienced medical professional',
      workingDays: doctorData.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: doctorData.workingHours || '10:00 AM - 6:00 PM',
      hospitalId: doctorData.hospitalId,
      phoneNumber: doctorData.phoneNumber,
      email: doctorData.email
    };

    // Add to mock database
    mockDoctors.push(newDoctor);

    return NextResponse.json({
      success: true,
      data: newDoctor,
      message: 'Doctor added successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding doctor:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to add doctor'
    }, { status: 500 });
  }
}
