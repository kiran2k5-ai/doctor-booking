'use client';

import { useState } from 'react';
import { LocalStorageManager } from '../lib/storage';
import { initializeDemoData, clearAllData, exportData } from '../lib/demoData';

export default function DataPersistenceDemo() {
  const [dataStats, setDataStats] = useState({
    appointments: LocalStorageManager.getAppointments().length,
    profile: LocalStorageManager.getProfile() ? 'Yes' : 'No'
  });

  const refreshStats = () => {
    setDataStats({
      appointments: LocalStorageManager.getAppointments().length,
      profile: LocalStorageManager.getProfile() ? 'Yes' : 'No'
    });
  };

  const handleInitDemo = () => {
    initializeDemoData();
    refreshStats();
    alert('Demo data initialized! Now reload the page to see persistence in action.');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      clearAllData();
      refreshStats();
      alert('All data cleared!');
    }
  };

  const handleExportData = () => {
    exportData();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        📱 Data Persistence Demo
      </h2>
      
      <div className="space-y-6">
        {/* Current Data Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Current Data Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{dataStats.appointments}</div>
              <div className="text-sm text-gray-600">Appointments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{dataStats.profile}</div>
              <div className="text-sm text-gray-600">Profile Data</div>
            </div>
          </div>
          <button
            onClick={refreshStats}
            className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            🔄 Refresh Stats
          </button>
        </div>

        {/* Demo Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Demo Actions</h3>
          
          <button
            onClick={handleInitDemo}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            🎯 Initialize Demo Data
          </button>
          
          <button
            onClick={handleExportData}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            📥 Export Data (JSON)
          </button>
          
          <button
            onClick={handleClearData}
            className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            🗑️ Clear All Data
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            🧪 Test Data Persistence
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Click "Initialize Demo Data" to add sample appointments and profile</li>
            <li>Navigate to Appointments or Profile pages to see the data</li>
            <li>Make changes (book appointments, edit profile, etc.)</li>
            <li><strong>Reload the page (F5)</strong> - Data should persist!</li>
            <li>Try closing and reopening the browser - Data remains!</li>
          </ol>
        </div>

        {/* Benefits */}
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Benefits of localStorage Persistence
          </h3>
          <ul className="list-disc list-inside space-y-1 text-green-700">
            <li>Data survives page reloads</li>
            <li>Works offline (no internet required)</li>
            <li>Instant load times</li>
            <li>Better user experience</li>
            <li>Reduced server requests</li>
          </ul>
        </div>

        {/* Technical Details */}
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚙️ Technical Implementation
          </h3>
          <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
            <li><code>LocalStorageManager</code> class handles all storage operations</li>
            <li><code>useAppointments</code> hook provides reactive appointment management</li>
            <li><code>useProfile</code> hook manages user profile with persistence</li>
            <li>Optimistic updates with server sync fallback</li>
            <li>Automatic data initialization and migration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
