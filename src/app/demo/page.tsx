'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import DataPersistenceDemo from '../../components/DataPersistenceDemo';

export default function DemoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">Data Persistence Demo</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <DataPersistenceDemo />
      </div>
    </div>
  );
}
