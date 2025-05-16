'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated, isAdmin } from './auth';

// HOC to protect routes that require authentication
export function withAuth(Component, adminOnly = false) {
  return function AuthProtected(props) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (!isAuthenticated()) {
            // Redirect to login if not authenticated
            router.push('/login');
            return;
          }

          // Get current user data
          const userData = await getCurrentUser();
          
          if (!userData) {
            // Token is invalid or expired
            router.push('/login');
            return;
          }

          // Check if admin access is required
          if (adminOnly && !isAdmin(userData)) {
            // Redirect to dashboard if not admin
            router.push('/dashboard');
            return;
          }

          // Set user data and stop loading
          setUser(userData);
          setLoading(false);
        } catch (error) {
          console.error('Authentication error:', error);
          router.push('/login');
        }
      };

      checkAuth();
    }, [router]);

    // Show loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-xl">Loading...</p>
          </div>
        </div>
      );
    }

    // Render the protected component with user data
    return <Component {...props} user={user} />;
  };
}
