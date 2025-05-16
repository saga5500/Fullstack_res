/**
 * This file creates and exports a Prisma client instance
 * that will be used throughout the application to interact with the database.
 */

// Import the PrismaClient class from the generated Prisma client
import { PrismaClient } from '@/app/generated/prisma';

// Create a new PrismaClient instance
// This establishes a connection to the database using the connection string from .env
const prisma = new PrismaClient();

// Export the Prisma client instance as the default export
// This allows us to import it in other files using: import prisma from '@/app/lib/prisma'
export default prisma;
