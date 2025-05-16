/**
 * API Route: /api/users
 * This file handles HTTP requests for the users collection endpoint
 */

// Import NextResponse from Next.js for sending HTTP responses
import { NextResponse } from 'next/server';
// Import the Prisma client instance to interact with the database
import prisma from '@/app/lib/prisma';

/**
 * GET handler function - Retrieves all users from the database
 * This function is automatically called when a GET request is made to /api/users
 * 
 * @returns {NextResponse} JSON response containing an array of user objects
 */
export async function GET() {
  try {
    // Query the database to get all users using Prisma's findMany method
    const users = await prisma.user.findMany();
    
    // Return the users as a JSON response
    // The '|| []' ensures we always return an array, even if findMany returns null
    return NextResponse.json(users || []);
  } catch (error) {
    // Log any errors that occur during the database query
    console.error('Error fetching users:', error);
    
    // Return an empty array with status 200 to prevent frontend errors
    // We use status 200 (OK) instead of an error status to make the frontend handling simpler
    return NextResponse.json([], { status: 200 });
  }
}

/**
 * POST handler function - Creates a new user in the database
 * This function is automatically called when a POST request is made to /api/users
 * 
 * @param {Request} request - The HTTP request object containing the user data in the body
 * @returns {NextResponse} JSON response containing the newly created user or an error message
 */
export async function POST(request) {
  try {
    // Parse the JSON body from the incoming request to get user data
    const body = await request.json();
    
    // Create a new user in the database using Prisma's create method
    const user = await prisma.user.create({
      data: {
        name: body.name,   // Use the name from the request body
        email: body.email, // Use the email from the request body
      },
    });
    
    // Return the newly created user as a JSON response
    return NextResponse.json(user);
  } catch (error) {
    // Return an error response with status 500 if the user creation fails
    // This could happen due to validation errors like duplicate email
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
