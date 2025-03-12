import { NextRequest, NextResponse } from 'next/server';
import { readCSV, updateCSVRecord } from '@/utils/csvUtils';

// GET /api/workOrders
export async function GET(request: NextRequest) {
  try {
    const workOrders = await readCSV('workOrders.csv');
    
    // Handle filtering by query parameters
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const status = searchParams.get('status');
    
    let filteredWorkOrders = workOrders;
    
    if (location) {
      filteredWorkOrders = filteredWorkOrders.filter(
        wo => wo.location.toLowerCase() === location.toLowerCase()
      );
    }
    
    if (status) {
      filteredWorkOrders = filteredWorkOrders.filter(
        wo => wo.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    return NextResponse.json(filteredWorkOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work orders' },
      { status: 500 }
    );
  }
}

// PATCH /api/workOrders
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Work order ID is required' },
        { status: 400 }
      );
    }
    
    const headers = [
      { id: 'id', title: 'id' },
      { id: 'title', title: 'title' },
      { id: 'description', title: 'description' },
      { id: 'location', title: 'location' },
      { id: 'status', title: 'status' },
      { id: 'dueDate', title: 'dueDate' },
      { id: 'assignedWorkers', title: 'assignedWorkers' },
      { id: 'priority', title: 'priority' },
      { id: 'createdAt', title: 'createdAt' }
    ];
    
    const success = await updateCSVRecord(
      'workOrders.csv',
      id,
      updateData,
      headers
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'Work order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating work order:', error);
    return NextResponse.json(
      { error: 'Failed to update work order' },
      { status: 500 }
    );
  }
} 