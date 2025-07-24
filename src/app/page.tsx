'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to help-support page immediately
    router.replace('/help-support');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          MyDoctor Help & Support
        </h1>
        <p className="text-gray-600">Redirecting to Help and Support...</p>
      </div>
    </div>
  );
}
