'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

/**
 * SwaggerDoc component that renders the Swagger UI documentation using swagger-ui-dist
 * directly to avoid React 18 Strict Mode warnings
 */
export default function SwaggerDoc() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Only execute this on the client
    if (typeof window === 'undefined') return;
    
    // Dynamic import to ensure this only runs on the client
    const initSwaggerUI = async () => {
      try {
        // Import SwaggerUI and CSS
        const SwaggerUIBundle = (await import('swagger-ui-dist/swagger-ui-bundle')).default;
        await import('swagger-ui-dist/swagger-ui.css');
        
        // Remove any existing Swagger UI instances
        const container = containerRef.current;
        while (container && container.firstChild) {
          container.removeChild(container.firstChild);
        }
        
        // Initialize Swagger UI
        const ui = SwaggerUIBundle({
          url: '/api/swagger',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.SwaggerUIStandalonePreset
          ],
          layout: "BaseLayout",
          supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
          onComplete: () => {
            console.log('Swagger UI initialized successfully');
          }
        });
        
        window.ui = ui;
      } catch (error) {
        console.error('Failed to load Swagger UI:', error);
        
        // Display error message in the container
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <h4 class="font-bold">Failed to load API documentation</h4>
              <p>${error.message || 'Unknown error'}</p>
            </div>
          `;
        }
      }
    };
    
    initSwaggerUI();
    
    // Cleanup function
    return () => {
      const container = containerRef.current;
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, []);
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">API Documentation</h1>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        {/* Swagger UI container */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div id="swagger-ui" ref={containerRef} className="min-h-[500px]">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-lg text-gray-600">Loading API documentation...</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

