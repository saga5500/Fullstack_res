'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { updateUser, deleteUser } from '../../utils/auth';

export default function UserDashboard({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const updatedUser = await updateUser(user.id, userData);
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
      // Update localStorage data
      if (typeof window !== 'undefined') {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...storedUser, ...updatedUser }));
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserData({
      name: user.name,
      email: user.email
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <p className="text-sm text-gray-600">User ID</p>
            <p className="font-medium text-black">{user.id}</p>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
            ) : (
              <>
                <button 
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex items-center text-green-600 hover:text-green-800"
                >
                  <FaSave className="mr-1" /> Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <FaTimes className="mr-1" /> Cancel
                </button>
              </>
            )}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Full Name</p>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="text-black mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          ) : (
            <p className="font-medium text-black">{user.name}</p>
          )}
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Email Address</p>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="text-black mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          ) : (
            <p className="font-medium text-black">{user.email}</p>
          )}
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Role</p>
          <p className="font-medium capitalize text-black">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
