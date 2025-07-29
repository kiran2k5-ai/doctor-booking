import { NextRequest, NextResponse } from 'next/server';
import { mockDoctors } from '../doctors/storage';

// GET /api/specialties - Get all available specialties
export async function GET(request: NextRequest) {
  try {
    // Extract unique specialties from doctors
    const specialties = [...new Set(mockDoctors.map(doctor => doctor.specialization))];
    
    // Count doctors for each specialty
    const specialtiesWithCount = specialties.map(specialty => ({
      name: specialty,
      count: mockDoctors.filter(doctor => doctor.specialization === specialty).length,
      available_doctors: mockDoctors.filter(doctor => 
        doctor.specialization === specialty && doctor.isAvailable
      ).length
    }));

    // Sort by count (most popular first)
    specialtiesWithCount.sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      data: {
        specialties: specialtiesWithCount,
        total: specialties.length
      },
      message: 'Specialties fetched successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching specialties:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch specialties'
    }, { status: 500 });
  }
}
