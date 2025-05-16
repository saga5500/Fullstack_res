'use client';

import { withAuth } from '../../../utils/withAuth';
import AdminPanel from '../../../components/dashboard/AdminPanel';
import DebugPanel from '../../../components/dashboard/DebugPanel';

function AdminDashboardPage({ user }) {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-6 text-gray-600">Welcome, Admin {user.name}!</p>
      
      <DebugPanel />
      
      <AdminPanel user={user} />
    </div>
  );
}

// Wrap with auth protection and admin requirement
export default withAuth(AdminDashboardPage, true);
