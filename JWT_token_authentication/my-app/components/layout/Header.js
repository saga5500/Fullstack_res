'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaSignOutAlt, FaUser, FaTachometerAlt, FaUsers, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { getCurrentUser, logoutUser, isAdmin } from '../../utils/auth';

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    router.push('/login');
  };

  // Navigation links based on authentication status
  const getNavLinks = () => {
    if (loading) {
      return null;
    }

    if (user) {
      // User is logged in
      return (
        <>
          <li>
            <Link href="/dashboard" className={`flex items-center p-2 ${pathname === '/dashboard' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}>
              <FaTachometerAlt className="mr-2" />
              Dashboard
            </Link>
          </li>
          {user.role === 'admin' && (
            <li>
              <Link href="/dashboard/admin" className={`flex items-center p-2 ${pathname === '/dashboard/admin' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}>
                <FaUsers className="mr-2" />
                User Management
              </Link>
            </li>
          )}
          <li>
            <button onClick={handleLogout} className="flex items-center p-2 hover:text-blue-600">
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </li>
        </>
      );
    }

    // User is not logged in
    return (
      <>
        <li>
          <Link href="/login" className={`flex items-center p-2 ${pathname === '/login' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}>
            <FaSignInAlt className="mr-2" />
            Login
          </Link>
        </li>
        <li>
          <Link href="/register" className={`flex items-center p-2 ${pathname === '/register' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}>
            <FaUserPlus className="mr-2" />
            Register
          </Link>
        </li>
      </>
    );
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-gray-800">
            JWT Auth System
          </Link>

          <nav>
            <ul className="flex space-x-4">
              {getNavLinks()}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
