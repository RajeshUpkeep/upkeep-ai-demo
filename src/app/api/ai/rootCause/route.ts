import { NextRequest, NextResponse } from "next/server";
import { readCSV } from "@/utils/csvUtils";
import { identifyRootCause } from "@/utils/openaiUtils";

// POST /api/ai/rootCause
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issue } = body;

    if (!issue) {
      return NextResponse.json(
        { error: "Issue description is required" },
        { status: 400 }
      );
    }

    // Get work orders and workers from CSV
    const workOrders = await readCSV("workOrders.csv");
    const workers = await readCSV("workers.csv");

    // Filter for relevant work orders if needed
    const overdueWorkOrders = workOrders.filter(
      (wo) => wo.status === "Overdue"
    );

    // Identify root cause using OpenAI
    const rootCause = await identifyRootCause(
      overdueWorkOrders.length > 0 ? overdueWorkOrders : workOrders,
      workers,
      issue
    );

    return NextResponse.json(rootCause);
  } catch (error) {
    console.error("Error identifying root cause:", error);
    return NextResponse.json(
      { error: "Failed to identify root cause" },
      { status: 500 }
    );
  }
}
