/**
 * API Route: /api/users/[id]
 * This file handles HTTP requests for individual user records
 * The [id] in the folder name makes this a dynamic route where the id is passed as a parameter
 */

// Import NextResponse from Next.js for sending HTTP responses
import { NextResponse } from 'next/server';
// Import the Prisma client instance to interact with the database
import prisma from '@/app/lib/prisma';

/**
 * GET handler function - Retrieves a single user by ID
 * This function is automatically called when a GET request is made to /api/users/[id]
 * 
 * @param {Request} request - The HTTP request object
 * @param {Object} params - Contains route parameters, in this case the user ID
 * @returns {NextResponse} JSON response containing the user object or an error message
 */
export async function GET(request, { params }) {
  try {
    // Convert the ID from string to integer (IDs in our schema are integers)
    const id = parseInt(params.id);
    
    // Query the database to find a specific user by ID
    const user = await prisma.user.findUnique({
      where: { id }, // Search condition: match the id
    });
    
    // If no user is found with this ID, return a 404 error
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return the found user as a JSON response
    return NextResponse.json(user);
  } catch (error) {
    // Return an error response if any exception occurs
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}

/**
 * PUT handler function - Updates an existing user
 * This function is automatically called when a PUT request is made to /api/users/[id]
 * 
 * @param {Request} request - The HTTP request object containing the updated user data
 * @param {Object} params - Contains route parameters, in this case the user ID
 * @returns {NextResponse} JSON response containing the updated user or an error message
 */
export async function PUT(request, { params }) {
  try {
    // Convert the ID from string to integer
    const id = parseInt(params.id);
    
    // Parse the JSON body from the request to get the updated user data
    const body = await request.json();
    
    // Update the user in the database using Prisma's update method
    const user = await prisma.user.update({
      where: { id },  // Which user to update
      data: {
        name: body.name,   // New name value
        email: body.email, // New email value
      },
    });
    
    // Return the updated user as a JSON response
    return NextResponse.json(user);
  } catch (error) {
    // Return an error response if the update fails
    // This could happen if the user doesn't exist or if there are validation errors
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

/**
 * DELETE handler function - Removes a user from the database
 * This function is automatically called when a DELETE request is made to /api/users/[id]
 * 
 * @param {Request} request - The HTTP request object
 * @param {Object} params - Contains route parameters, in this case the user ID
 * @returns {NextResponse} JSON response with success message or error message
 */
export async function DELETE(request, { params }) {
  try {
    // Convert the ID from string to integer
    const id = parseInt(params.id);
    
    // Delete the user from the database using Prisma's delete method
    await prisma.user.delete({
      where: { id }, // Which user to delete
    });
    
    // Return a success message as a JSON response
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    // Return an error response if the deletion fails
    // This could happen if the user doesn't exist
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}
