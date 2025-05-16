'use client';

import { useState } from 'react';
import { debugGetAllUsers } from '../utils/debug';

export default function DebugPanel() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleTestApiCall = async () => {
    try {
      setLoading(true);
      console.log('Testing API call...');
      
      const response = await debugGetAllUsers();
      
      setResult(response);
      console.log('Test completed');
    } catch (error) {
      console.error('Test error:', error);
      setResult({ error: error.message || 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">API Debugging Panel</h2>
      
      <button
        onClick={handleTestApiCall}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
      >
        {loading ? 'Testing...' : 'Test API Call'}
      </button>
      
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Result:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-4">
        <p className="text-gray-600 text-sm">
          Check the browser console for detailed logs
        </p>
      </div>
    </div>
  );
}
