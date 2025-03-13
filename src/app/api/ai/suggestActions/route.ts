import { NextRequest, NextResponse } from "next/server";
import { readCSV } from "@/utils/csvUtils";
import { suggestActions } from "@/utils/openaiUtils";

// POST /api/ai/suggestActions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issue, rootCause } = body;

    if (!issue || !rootCause) {
      return NextResponse.json(
        { error: "Issue and root cause are required" },
        { status: 400 }
      );
    }

    // Get work orders and workers from CSV
    const workOrders = await readCSV("workOrders.csv");
    const workers = await readCSV("workers.csv");

    let filteredWorkOrders = workOrders;

    switch (issue) {
      case "overdue":
        // Filter for relevant work orders if needed
        filteredWorkOrders = workOrders.filter((wo) => wo.status === "Overdue");
        break;
      case "high_priority":
        // Filter for relevant work orders if needed
        filteredWorkOrders = workOrders.filter((wo) => wo.priority === "High");
        break;
      case "skill_gap":
        // Filter for relevant work orders if needed
        filteredWorkOrders = workOrders.filter(
          (wo) => wo.assignedWorkers.length < 2 && wo.status === "In Progress"
        );
        break;
      default: {
        filteredWorkOrders = workOrders;
      }
    }

    // Get action suggestions using OpenAI
    const suggestedActions = await suggestActions(
      filteredWorkOrders,
      workers,
      issue,
      rootCause
    );

    return NextResponse.json(suggestedActions);
  } catch (error) {
    console.error("Error suggesting actions:", error);
    return NextResponse.json(
      { error: "Failed to suggest actions" },
      { status: 500 }
    );
  }
}
