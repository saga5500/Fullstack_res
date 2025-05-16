/**
 * Main Page Component
 * This is the homepage of our application that displays a user management interface
 * It includes a form to add/edit users and a table to display all users
 */

// 'use client' directive tells Next.js that this is a Client Component, not a Server Component
// This allows us to use React hooks and browser APIs
'use client';

// Import React hooks for state management and side effects
import { useState, useEffect } from 'react';

export default function Home() {
  // State for storing the list of users fetched from the API
  const [users, setUsers] = useState([]);
  
  // State for managing the form input data (for both creating and editing users)
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  // State to track which user is currently being edited (null means we're creating a new user)
  const [editingId, setEditingId] = useState(null);

  /**
   * Function to fetch all users from the API
   * This is called when the component mounts and after any create/update/delete operation
   */
  const fetchUsers = async () => {
    try {
      // Make a GET request to our users API endpoint
      const response = await fetch('/api/users');
      // Parse the JSON response
      const data = await response.json();
      // Update the users state, ensuring we always have an array even if the API returns null
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      // Log any errors and set users to an empty array to prevent rendering issues
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  // useEffect hook to fetch users when the component first mounts
  // The empty dependency array [] means this effect runs only once after the initial render
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Function to handle form submission for creating or updating a user
   * 
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior (page refresh)
    e.preventDefault();
    
    if (editingId) {
      // If editingId is set, we're updating an existing user
      await fetch(`/api/users/${editingId}`, {
        method: 'PUT', // HTTP PUT method for updates
        headers: { 'Content-Type': 'application/json' }, // Specify JSON content type
        body: JSON.stringify(formData), // Convert form data to JSON string
      });
    } else {
      // If editingId is null, we're creating a new user
      await fetch('/api/users', {
        method: 'POST', // HTTP POST method for creation
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }

    // Reset the form data and editing state after submission
    setFormData({ name: '', email: '' });
    setEditingId(null);
    
    // Refresh the user list to show the new/updated user
    fetchUsers();
  };

  /**
   * Function to handle user deletion
   * 
   * @param {number} id - The ID of the user to delete
   */
  const handleDelete = async (id) => {
    // Make a DELETE request to our API with the user ID
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    
    // Refresh the user list to remove the deleted user
    fetchUsers();
  };

  /**
   * Function to handle editing a user
   * This prepares the form for editing by populating it with the user's data
   * 
   * @param {Object} user - The user object to edit
   */
  const handleEdit = (user) => {
    // Set the form data to the selected user's data
    setFormData({ name: user.name, email: user.email });
    
    // Set the editingId to track that we're editing this user
    setEditingId(user.id);
  };

  // The JSX returned by the component
  return (
    // Main container for the page with padding and minimum height
    <main className="min-h-screen p-8 bg-gradient-to-br from-green-100 to-green-200">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      
      {/* Center container with maximum width */}
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Page title and navigation */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 drop-shadow-md flex items-center gap-3">
            <span className="bg-purple-100 text-purple-800 p-3 rounded-full shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </span>
            User Management
          </h1>
          
          <a href="/api-docs" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            API Documentation
          </a>
        </div>
        
        {/* Form for creating and editing users */}
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-xl shadow-lg text-black border border-gray-200">
          {/* Form title that changes based on whether we're editing or adding */}
          <h2 className="text-xl font-bold mb-5 text-gray-800 border-b border-gray-200 pb-2">
            {editingId ? '✏️ Edit User' : '➕ Add New User'}
          </h2>
          
          {/* Form inputs container */}
          <div className="flex gap-4 mb-4">
            {/* Name input field */}
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            
            {/* Email input field */}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            
            {/* Submit button that changes text based on editing state */}
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>

        {/* User List Table */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transform transition-all duration-300 hover:shadow-2xl">
          <table className="min-w-full">
            {/* Table header */}
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            
            {/* Table body - iterates over the users array */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {/* Map function creates a table row for each user */}
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-500 italic">No users found. Add a new user above.</td>
                </tr>
              ) : users.map((user, index) => (
                <tr key={user.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transform hover:scale-[1.01] transition-all duration-200 shadow-sm hover:shadow`}>
                  <td className="px-6 py-5 whitespace-nowrap font-medium text-gray-800">{user.name}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-gray-600">{user.email}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEdit(user)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-md shadow-sm hover:bg-blue-200 hover:text-blue-800 transition-all duration-200 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 font-medium rounded-md shadow-sm hover:bg-red-200 hover:text-red-800 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
