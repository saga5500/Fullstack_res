'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes, FaUserPlus } from 'react-icons/fa';
import { getAllUsers, updateUser, deleteUser } from '../../utils/auth';
import Cookies from 'js-cookie';

export default function AdminPanel({ user }) {
  console.log('AdminPanel rendered with user:', user);
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError('');
        console.log('AdminPanel: Fetching all users...');
        
        // Ensure we have a token before making the request
        const token = Cookies.get('token');
        if (!token) {
          setError('No authentication token found. Please log in again.');
          setLoading(false);
          return;
        }
        
        const data = await getAllUsers();
        console.log('AdminPanel: Users data received:', data);
        
        // Check if we got an array of users
        if (Array.isArray(data)) {
          console.log(`AdminPanel: Setting ${data.length} users in state`);
          setUsers(data);
          if (data.length === 0) {
            setError('No users found in the system.');
          }
        } else {
          console.error('AdminPanel: Expected array of users but got:', data);
          setError('Invalid user data format received');
        }
      } catch (err) {
        setError('Failed to load users: ' + (err.message || 'Unknown error'));
        console.error('AdminPanel: Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser({
      ...user,
      password: '' // Don't include password when editing
    });
  };

  const handleEditChange = (e) => {
    setEditingUser({
      ...editingUser,
      [e.target.name]: e.target.value
    });
  };

  const handleNewUserChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Remove empty fields from request
      const updateData = Object.entries(editingUser)
        .filter(([_, value]) => value !== '')
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      const updatedUser = await updateUser(editingUser.id, updateData);
      
      // Update local state
      setUsers(users.map(u => 
        u.id === updatedUser.id ? updatedUser : u
      ));
      
      setSuccess(`User ${updatedUser.name} updated successfully`);
      setEditingUser(null);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Call API to add user
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add user');
      }

      const addedUser = await response.json();
      
      // Update local state
      setUsers([...users, addedUser.user]);
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
      
      setSuccess('New user added successfully');
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        
        await deleteUser(userId);
        
        // Update local state
        setUsers(users.filter(u => u.id !== userId));
        
        setSuccess('User deleted successfully');
      } catch (err) {
        setError(err.message || 'Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-xl">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <FaUserPlus className="mr-2" />
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

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

      {/* Add New User Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-3">Add New User</h3>
          <form onSubmit={handleAddUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">            {users && users.length > 0 ? (
              users.map((userItem) => (
                <tr key={userItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{userItem.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser && editingUser.id === userItem.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editingUser.name}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      userItem.name
                    )}
                  </td>                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser && editingUser.id === userItem.id ? (
                      <input
                        type="email"
                        name="email"
                        value={editingUser.email}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      userItem.email
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser && editingUser.id === userItem.id ? (
                      <select
                        name="role"
                        value={editingUser.role}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {userItem.role}
                      </span>
                    )}
                  </td>                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser && editingUser.id === userItem.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateUser}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(userItem)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(userItem.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={userItem.id === user.id} // Prevent deleting own account
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
