import { NextRequest, NextResponse } from 'next/server';
import { readCSV } from '@/utils/csvUtils';
import { analyzeWorkOrders } from '@/utils/openaiUtils';

// POST /api/ai/analyze
export async function POST(request: NextRequest) {
  try {
    // Get work orders from CSV
    const workOrders = await readCSV('workOrders.csv');
    
    // Filter for overdue work orders if needed
    const overdueWorkOrders = workOrders.filter(wo => wo.status === 'Overdue');
    
    // Analyze work orders using OpenAI
    const analysis = await analyzeWorkOrders(workOrders);
    
    return NextResponse.json({
      analysis,
      overdueCount: overdueWorkOrders.length,
      totalCount: workOrders.length
    });
  } catch (error) {
    console.error('Error analyzing work orders:', error);
    return NextResponse.json(
      { error: 'Failed to analyze work orders' },
      { status: 500 }
    );
  }
} 