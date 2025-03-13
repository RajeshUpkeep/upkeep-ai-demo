// import OpenAI from "openai";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { WorkOrder } from "./types";

/**
 * Identify root causes for issues
 * @param workOrders - Array of work order objects
 * @param workers - Array of worker objects
 * @param issue - The identified issue
 * @returns Promise<string> - A promise that resolves to the AI's root cause analysis
 */
export async function identifyRootCause(
  workOrders: WorkOrder[],
  workers: Worker[],
  issue: string
) {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        rootCause: z.enum(["worker_assignment", "skill_gap", "high_priority"]),
        explanation: z.string(),
      }),
      system:
        "You are an AI assistant for a maintenance management system. Your task is to analyze work orders and workers data to identify the root cause of issues.",
      prompt: ` 
      Work Orders: ${JSON.stringify(workOrders)}
      Workers: ${JSON.stringify(workers)}
      Identified Issue: ${issue}

      Analyze the data and identify the root cause of the issue. 
      Focus on patterns like worker assignments, skill gaps, notifying supervisors about high priority work orders .`,
      temperature: 0.2,
    });

    return object;
  } catch (error) {
    console.error("Error identifying root cause:", error);
    return "Error identifying root cause.";
  }
}

/**
 * Suggest actions to resolve issues
 * @param workOrders - Array of work order objects
 * @param workers - Array of worker objects
 * @param issue - The identified issue
 * @param rootCause - The identified root cause
 * @returns Promise<string> - A promise that resolves to the AI's suggested actions
 */
export async function suggestActions(
  workOrders: WorkOrder[],
  workers: Worker[],
  issue: string,
  rootCause: string
) {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        explanation: z.string(),
        rootCause: z.enum(["worker_assignment", "skill_gap", "high_priority"]),
        suggestedAction: z.enum(["assign_worker", "notify_supervisor"]),
        successMessage: z.string(),
        changes: z.array(
          z.object({
            workOrderId: z.string(),
            field: z.string(),
            newValue: z.array(z.string()),
          })
        ),
      }),
      system:
        "You are an AI assistant for a maintenance management system. Your task is to analyze work orders and workers data to identify the root cause of issues.",
      prompt: ` 
      Work Orders: ${JSON.stringify(workOrders)}
      Workers: ${JSON.stringify(workers)}
      Identified Issue: ${issue}
      Root Cause: ${rootCause}

      Suggest specific actions to resolve the issue. Be specific about which work orders need attention and which workers could be assigned.
      Also, provide an explanation of changes that need to be made to the system to resolve the issue.
      And in the successMessage, provide a message that will be shown to the user after the actions are executed.`,
      temperature: 0.2,
    });

    return object;
  } catch (error) {
    console.error("Error suggesting actions:", error);
    return "Error suggesting actions.";
  }
}
