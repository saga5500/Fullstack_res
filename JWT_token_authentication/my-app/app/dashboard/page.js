'use client';

import { withAuth } from '../../utils/withAuth';
import UserDashboard from '../../components/dashboard/UserDashboard';

function DashboardPage({ user }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      <p className="mb-6 text-gray-600">Welcome back, {user.name}!</p>
      
      <UserDashboard user={user} />
    </div>
  );
}

// Wrap with auth protection
export default withAuth(DashboardPage);
