'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  ChevronLeftIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  UserIcon,
  HeartIcon,
  BeakerIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

interface MedicalRecord {
  id: string;
  type: 'prescription' | 'lab-report' | 'scan' | 'consultation' | 'vaccination';
  title: string;
  doctorName: string;
  date: string;
  description: string;
  fileUrl?: string;
  status: 'normal' | 'attention' | 'urgent';
  tags: string[];
}

export default function MedicalRecordsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock medical records data
  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      type: 'lab-report',
      title: 'Complete Blood Count (CBC)',
      doctorName: 'Dr. Sarah Wilson',
      date: '2025-07-28',
      description: 'Routine blood work showing normal values across all parameters.',
      status: 'normal',
      tags: ['Blood Test', 'Routine', 'CBC'],
      fileUrl: '/reports/cbc-report.pdf'
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Hypertension Medication',
      doctorName: 'Dr. Sarah Wilson',
      date: '2025-07-25',
      description: 'Prescribed Lisinopril 10mg daily for blood pressure management.',
      status: 'normal',
      tags: ['Medication', 'Hypertension', 'Daily'],
      fileUrl: '/prescriptions/bp-medication.pdf'
    },
    {
      id: '3',
      type: 'scan',
      title: 'Chest X-Ray',
      doctorName: 'Dr. Michael Chen',
      date: '2025-07-20',
      description: 'Chest X-ray results showing clear lungs with no abnormalities.',
      status: 'normal',
      tags: ['X-Ray', 'Chest', 'Clear'],
      fileUrl: '/scans/chest-xray.pdf'
    },
    {
      id: '4',
      type: 'consultation',
      title: 'Cardiology Consultation',
      doctorName: 'Dr. Sarah Wilson',
      date: '2025-07-15',
      description: 'Follow-up consultation for heart health. EKG shows normal rhythm.',
      status: 'normal',
      tags: ['Cardiology', 'EKG', 'Follow-up'],
      fileUrl: '/consultations/cardio-consult.pdf'
    },
    {
      id: '5',
      type: 'lab-report',
      title: 'Lipid Profile',
      doctorName: 'Dr. Emily Rodriguez',
      date: '2025-07-10',
      description: 'Cholesterol levels slightly elevated. Dietary modifications recommended.',
      status: 'attention',
      tags: ['Cholesterol', 'Lipids', 'Diet'],
      fileUrl: '/reports/lipid-profile.pdf'
    },
    {
      id: '6',
      type: 'vaccination',
      title: 'COVID-19 Booster',
      doctorName: 'Dr. James Park',
      date: '2025-07-05',
      description: 'COVID-19 booster vaccination administered. No adverse reactions.',
      status: 'normal',
      tags: ['Vaccination', 'COVID-19', 'Booster'],
      fileUrl: '/vaccines/covid-booster.pdf'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prescription': return <HeartIcon className="w-5 h-5" />;
      case 'lab-report': return <BeakerIcon className="w-5 h-5" />;
      case 'scan': return <CameraIcon className="w-5 h-5" />;
      case 'consultation': return <UserIcon className="w-5 h-5" />;
      case 'vaccination': return <HeartIcon className="w-5 h-5" />;
      default: return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prescription': return 'text-blue-600 bg-blue-50';
      case 'lab-report': return 'text-green-600 bg-green-50';
      case 'scan': return 'text-purple-600 bg-purple-50';
      case 'consultation': return 'text-orange-600 bg-orange-50';
      case 'vaccination': return 'text-pink-600 bg-pink-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'attention': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || record.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const recordTypes = [
    { value: 'all', label: 'All Records', count: medicalRecords.length },
    { value: 'prescription', label: 'Prescriptions', count: medicalRecords.filter(r => r.type === 'prescription').length },
    { value: 'lab-report', label: 'Lab Reports', count: medicalRecords.filter(r => r.type === 'lab-report').length },
    { value: 'scan', label: 'Scans', count: medicalRecords.filter(r => r.type === 'scan').length },
    { value: 'consultation', label: 'Consultations', count: medicalRecords.filter(r => r.type === 'consultation').length },
    { value: 'vaccination', label: 'Vaccinations', count: medicalRecords.filter(r => r.type === 'vaccination').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 -ml-2"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Medical Records</h1>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <FunnelIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search records, doctors, or conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Filter Tabs */}
          {showFilters && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {recordTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedFilter(type.value)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
                    selectedFilter === type.value
                      ? 'bg-cyan-500 text-white border-cyan-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type.label} ({type.count})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Records List */}
      <div className="px-4 py-6">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No records found
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 
                `No records match "${searchQuery}"` : 
                'No medical records available for the selected filter.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(record.type)}`}>
                        {getTypeIcon(record.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{record.title}</h3>
                        <p className="text-sm text-gray-600">{record.doctorName}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-3">{record.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span>{formatDate(record.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="capitalize">{record.type.replace('-', ' ')}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {record.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors flex items-center justify-center space-x-2">
                      <EyeIcon className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg">
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
