/**
 * API Route: /api/swagger
 * This file serves the Swagger UI API documentation
 */

import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * GET handler function - Returns the Swagger JSON configuration
 * This endpoint is used by the Swagger UI to display the API documentation
 * 
 * @returns {NextResponse} Swagger specification as JSON
 */
export async function GET() {
  try {
    // Get the swagger spec directly from the file system to ensure we have the latest version
    const swaggerPath = join(process.cwd(), 'swagger.json');
    const swagger = JSON.parse(readFileSync(swaggerPath, 'utf-8'));
    
    console.log('Serving Swagger spec from:', swaggerPath);
    
    // Set CORS headers to allow Swagger UI to access this endpoint
    return NextResponse.json(swagger, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Error loading Swagger spec:', error);
    return NextResponse.json(
      { error: 'Failed to load API documentation: ' + error.message },
      { status: 500 }
    );
  }
}
