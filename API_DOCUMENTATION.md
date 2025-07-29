# Doctor Booking API Documentation

## Overview
This is a comprehensive RESTful API for the Doctor Booking System. The API provides endpoints for managing doctors, appointments, time slots, and specialties.

**Base URL:** `http://localhost:3000`

## Authentication
Currently, the API is open for development purposes. In production, implement JWT token-based authentication.

## Error Response Format
All error responses follow this format:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Human readable error message"
}
```

## Success Response Format
All success responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

---

## 🏥 Doctors API

### GET /api/doctors
Get all doctors with optional search and pagination.

**Query Parameters:**
- `q` (string, optional): Search query for doctor name, specialization, or location
- `specialty` (string, optional): Filter by specialty
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example Request:**
```bash
GET /api/doctors?q=prakash&specialty=psychologist&page=1&limit=5
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "id": "1",
        "name": "Dr. Prakash Das",
        "specialization": "Psychologist",
        "experience": "8 years",
        "rating": 4.8,
        "reviewCount": 127,
        "consultationFee": 500,
        "location": "Apollo Hospital, Delhi",
        "availability": "Available today",
        "nextSlot": "10:30 AM-07:00 PM",
        "isAvailable": true,
        "distance": "2.5 km",
        "languages": ["English", "Hindi"],
        "qualifications": ["MBBS", "MD Psychology"]
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 5,
      "total": 1,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  },
  "message": "Found 1 doctors"
}
```

### GET /api/doctors/:id
Get detailed information about a specific doctor.

**Path Parameters:**
- `id` (string): Doctor ID

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Dr. Prakash Das",
    "specialization": "Psychologist",
    "about": "Dr. Prakash Das is a highly experienced psychologist...",
    "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "workingHours": "10:00 AM - 7:00 PM",
    "phoneNumber": "+91-9876543210",
    "email": "dr.prakash@apollohospital.com"
  },
  "message": "Doctor found successfully"
}
```

### POST /api/doctors
Add a new doctor to the system.

**Request Body:**
```json
{
  "name": "Dr. John Smith",
  "specialization": "Neurologist",
  "experience": "7 years",
  "consultationFee": 700,
  "location": "City Hospital, Mumbai",
  "rating": 4.5,
  "reviewCount": 45,
  "languages": ["English", "Hindi"],
  "qualifications": ["MBBS", "MD Neurology"],
  "about": "Experienced neurologist specializing in brain disorders",
  "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "workingHours": "9:00 AM - 5:00 PM",
  "phoneNumber": "+91-9876543216",
  "email": "dr.john@cityhospital.com"
}
```

### PUT /api/doctors/:id
Update doctor information.

**Request Body (partial update):**
```json
{
  "consultationFee": 550,
  "availability": "Available tomorrow",
  "rating": 4.9
}
```

### DELETE /api/doctors/:id
Delete a doctor from the system.

---

## ⏰ Time Slots API

### GET /api/doctors/:id/slots
Get available time slots for a specific doctor.

**Path Parameters:**
- `id` (string): Doctor ID

**Query Parameters:**
- `date` (string, optional): Date in YYYY-MM-DD format (default: today)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "doctorId": "1",
    "date": "2025-07-29",
    "slots": {
      "morning": [
        {
          "id": "1",
          "time": "10:00 AM",
          "available": true,
          "type": "morning",
          "date": "2025-07-29",
          "doctorId": "1"
        }
      ],
      "afternoon": [...],
      "evening": [...]
    },
    "total_slots": 14,
    "available_slots": 12
  },
  "message": "Time slots fetched successfully"
}
```

---

## 📅 Appointments API

### GET /api/appointments
Get appointments with optional filtering.

**Query Parameters:**
- `patientId` (string, optional): Filter by patient ID
- `status` (string, optional): Filter by status (scheduled, completed, cancelled)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": "apt-1",
        "doctorId": "1",
        "patientId": "patient-1",
        "date": "2025-07-30",
        "time": "10:30 AM",
        "type": "in-person",
        "status": "scheduled",
        "consultationFee": 500,
        "notes": "Regular checkup",
        "createdAt": "2025-07-29T10:00:00Z",
        "doctor": {
          "name": "Dr. Prakash Das",
          "specialization": "Psychologist",
          "location": "Apollo Hospital, Delhi",
          "image": "/doctors/dr-prakash-1.jpg"
        }
      }
    ],
    "total": 1
  },
  "message": "Appointments fetched successfully"
}
```

### POST /api/appointments
Book a new appointment.

**Request Body:**
```json
{
  "doctorId": "1",
  "patientId": "patient-123",
  "date": "2025-07-30",
  "time": "10:30 AM",
  "type": "in-person",
  "notes": "Regular checkup appointment"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "apt-1690876543210",
    "doctorId": "1",
    "patientId": "patient-123",
    "date": "2025-07-30",
    "time": "10:30 AM",
    "type": "in-person",
    "status": "scheduled",
    "consultationFee": 500,
    "notes": "Regular checkup appointment",
    "createdAt": "2025-07-29T10:00:00Z",
    "doctor": {
      "name": "Dr. Prakash Das",
      "specialization": "Psychologist",
      "location": "Apollo Hospital, Delhi",
      "image": "/doctors/dr-prakash-1.jpg"
    }
  },
  "message": "Appointment booked successfully"
}
```

---

## 🏷️ Specialties API

### GET /api/specialties
Get all medical specialties with doctor counts.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "specialties": [
      {
        "name": "Psychologist",
        "count": 1,
        "available_doctors": 1
      },
      {
        "name": "Cardiologist",
        "count": 1,
        "available_doctors": 1
      }
    ],
    "total": 6
  },
  "message": "Specialties fetched successfully"
}
```

---

## 🧪 Testing with Postman

### Import Collection
1. Import the `Doctor_Booking_API.postman_collection.json` file into Postman
2. The collection includes environment variable `{{base_url}}` set to `http://localhost:3000`
3. All endpoints are pre-configured with example requests

### Test Scenarios

#### 1. Search and Filter Doctors
```bash
# Search by name
GET /api/doctors?q=prakash

# Filter by specialty
GET /api/doctors?specialty=psychologist

# Combined search and filter
GET /api/doctors?q=mumbai&specialty=cardiologist

# Pagination
GET /api/doctors?page=1&limit=3
```

#### 2. Get Doctor Details and Slots
```bash
# Get doctor details
GET /api/doctors/1

# Get available slots for today
GET /api/doctors/1/slots

# Get slots for specific date
GET /api/doctors/1/slots?date=2025-07-30
```

#### 3. Book Appointments
```bash
# Book in-person appointment
POST /api/appointments
{
  "doctorId": "1",
  "patientId": "patient-123",
  "date": "2025-07-30",
  "time": "10:30 AM",
  "type": "in-person"
}

# Book video consultation
POST /api/appointments
{
  "doctorId": "2",
  "patientId": "patient-456",
  "date": "2025-07-31",
  "time": "02:00 PM",
  "type": "video"
}
```

#### 4. Manage Appointments
```bash
# Get all appointments
GET /api/appointments

# Get patient appointments
GET /api/appointments?patientId=patient-123

# Get scheduled appointments
GET /api/appointments?status=scheduled
```

---

## 📊 HTTP Status Codes

- **200 OK**: Successful GET/PUT/DELETE requests
- **201 Created**: Successful POST requests
- **400 Bad Request**: Missing required fields or invalid data
- **404 Not Found**: Resource not found
- **409 Conflict**: Time slot already booked
- **500 Internal Server Error**: Server error

---

## 🔧 Development Notes

### Mock Data
- The API uses in-memory mock data for development
- Data resets when the server restarts
- In production, replace with actual database integration

### Future Enhancements
- JWT authentication
- Database integration (MongoDB/PostgreSQL)
- Real-time notifications
- Payment integration
- File upload for doctor images
- Email/SMS notifications
- Advanced search filters
- Appointment reminders

---

## 🚀 Getting Started

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the API:**
   ```bash
   curl http://localhost:3000/api/doctors
   ```

3. **Import Postman collection:**
   - Open Postman
   - Import `Doctor_Booking_API.postman_collection.json`
   - Start testing all endpoints

The API is now ready for testing and integration with the frontend application! 🎉
