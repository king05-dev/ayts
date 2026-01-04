'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface TestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
}

export function ApiTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function runTests() {
      const tests: TestResult[] = [
        { endpoint: 'Health Check', status: 'pending' },
        { endpoint: 'Locations', status: 'pending' },
        { endpoint: 'Categories', status: 'pending' },
        { endpoint: 'Stores', status: 'pending' },
      ];

      setResults([...tests]);

      // Test 1: Health Check
      try {
        const response = await fetch('http://localhost:3001/health');
        const health = await response.json();
        tests[0] = {
          endpoint: 'Health Check',
          status: 'success',
          data: health
        };
      } catch (error) {
        tests[0] = {
          endpoint: 'Health Check',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
      setResults([...tests]);

      // Test 2: Locations
      try {
        const locations = await api.getLocations();
        tests[1] = {
          endpoint: 'Locations',
          status: 'success',
          data: locations
        };
      } catch (error) {
        tests[1] = {
          endpoint: 'Locations',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
      setResults([...tests]);

      // Test 3: Categories
      try {
        const categories = await api.getCategories();
        tests[2] = {
          endpoint: 'Categories',
          status: 'success',
          data: categories
        };
      } catch (error) {
        tests[2] = {
          endpoint: 'Categories',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
      setResults([...tests]);

      // Test 4: Stores
      try {
        const stores = await api.getStores({ limit: 5 });
        tests[3] = {
          endpoint: 'Stores',
          status: 'success',
          data: stores
        };
      } catch (error) {
        tests[3] = {
          endpoint: 'Stores',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
      setResults([...tests]);

      setIsLoading(false);
    }

    runTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          AYTS API Connection Test
        </h2>
        
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">
                  {getStatusIcon(result.status)} {result.endpoint}
                </h3>
                <span className={`font-medium ${getStatusColor(result.status)}`}>
                  {result.status.toUpperCase()}
                </span>
              </div>
              
              {result.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                  <p className="text-red-700 text-sm">
                    <strong>Error:</strong> {result.error}
                  </p>
                </div>
              )}
              
              {result.data && (
                <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Response:</strong>
                  </p>
                  <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-700">Running API tests...</span>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Test Summary:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.status === 'success').length}
                </div>
                <div className="text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {results.filter(r => r.status === 'error').length}
                </div>
                <div className="text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {results.length}
                </div>
                <div className="text-gray-600">Total</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800">Connection Info:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Frontend:</strong> http://localhost:3000</p>
            <p><strong>Backend API:</strong> http://localhost:3001</p>
            <p><strong>Database:</strong> Supabase PostgreSQL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
