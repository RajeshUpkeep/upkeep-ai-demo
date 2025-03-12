import { NextRequest, NextResponse } from 'next/server';
import { readCSV, updateCSVRecord } from '@/utils/csvUtils';

// POST /api/ai/executeAction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, workOrderIds, workerId } = body;
    
    if (!action || !workOrderIds || !workerId) {
      return NextResponse.json(
        { error: 'Action, work order IDs, and worker ID are required' },
        { status: 400 }
      );
    }
    
    // Get work orders from CSV
    const workOrders = await readCSV('workOrders.csv');
    const workers = await readCSV('workers.csv');
    
    // Verify worker exists
    const worker = workers.find(w => w.id === workerId);
    if (!worker) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      );
    }
    
    // Define headers for CSV update
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
    
    // Execute the action based on the action type
    const results = [];
    
    if (action === 'assignWorker') {
      for (const workOrderId of workOrderIds) {
        const workOrder = workOrders.find(wo => wo.id === workOrderId);
        
        if (workOrder) {
          // Add worker to assigned workers if not already assigned
          const assignedWorkers = Array.isArray(workOrder.assignedWorkers) 
            ? workOrder.assignedWorkers 
            : [];
          
          if (!assignedWorkers.includes(workerId)) {
            assignedWorkers.push(workerId);
            
            const success = await updateCSVRecord(
              'workOrders.csv',
              workOrderId,
              { assignedWorkers },
              headers
            );
            
            results.push({
              workOrderId,
              success,
              message: success 
                ? `Worker ${workerId} assigned to work order ${workOrderId}` 
                : `Failed to assign worker to work order ${workOrderId}`
            });
          } else {
            results.push({
              workOrderId,
              success: true,
              message: `Worker ${workerId} already assigned to work order ${workOrderId}`
            });
          }
        } else {
          results.push({
            workOrderId,
            success: false,
            message: `Work order ${workOrderId} not found`
          });
        }
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported action type' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error executing action:', error);
    return NextResponse.json(
      { error: 'Failed to execute action' },
      { status: 500 }
    );
  }
} 