import { NextRequest, NextResponse } from 'next/server';
import { readCSV } from '@/utils/csvUtils';

// GET /api/workers
export async function GET(request: NextRequest) {
  try {
    const workers = await readCSV('workers.csv');
    
    // Handle filtering by query parameters
    const { searchParams } = new URL(request.url);
    const availability = searchParams.get('availability');
    const role = searchParams.get('role');
    
    let filteredWorkers = workers;
    
    if (availability) {
      filteredWorkers = filteredWorkers.filter(
        worker => worker.availability.toLowerCase() === availability.toLowerCase()
      );
    }
    
    if (role) {
      filteredWorkers = filteredWorkers.filter(
        worker => worker.role.toLowerCase() === role.toLowerCase()
      );
    }
    
    return NextResponse.json(filteredWorkers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workers' },
      { status: 500 }
    );
  }
} 