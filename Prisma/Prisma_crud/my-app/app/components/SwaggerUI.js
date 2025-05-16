'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Import SwaggerUI with SSR disabled to prevent server-side rendering issues
const SwaggerUIComponent = dynamic(
  () => import('swagger-ui-react'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-600">Loading API documentation...</span>
      </div>
    )
  }
);

/**
 * Custom SwaggerUI component that addresses the React 18 strict mode warnings
 * by properly handling the component lifecycle
 */
export default function SwaggerUI({ spec }) {
  // Use a ref to track if the component is mounted
  const isMounted = useRef(false);
  
  useEffect(() => {
    // Mark as mounted after initial render
    isMounted.current = true;
    
    // Cleanup function to handle unmounting
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Safety check for SSR
  if (typeof window === 'undefined') {
    return null;
  }

  // Only render the UI when we have a spec and the component is mounted
  if (!spec || !isMounted.current) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-600">Loading API documentation...</span>
      </div>
    );
  }

  return <SwaggerUIComponent spec={spec} />;
}
