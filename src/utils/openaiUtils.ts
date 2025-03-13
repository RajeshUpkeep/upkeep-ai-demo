// import OpenAI from "openai";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

/**
 * Analyze work orders to identify issues
 * @param workOrders - Array of work order objects
 * @returns Promise<string> - A promise that resolves to the AI's analysis
 */
export async function analyzeWorkOrders(
  workOrders: any[],
  criteria = "overdue"
): Promise<any> {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      output: "array",
      schema: z.object({
        root_cause: z.string(),
        suggested_actions: z.array(z.string()),
      }),
      prompt: `Analyze these work orders and identify the root cause of ${criteria} work orders: ${JSON.stringify(
        workOrders
      )}`,
      temperature: 0.2,
    });
    return object;
  } catch (error) {
    console.error("Error analyzing work orders:", error);
    return "Error analyzing work orders.";
  }
}

/**
 * Identify root causes for issues
 * @param workOrders - Array of work order objects
 * @param workers - Array of worker objects
 * @param issue - The identified issue
 * @returns Promise<string> - A promise that resolves to the AI's root cause analysis
 */
export async function identifyRootCause(
  workOrders: any[],
  workers: any[],
  issue: string
) {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        rootCause: z.enum([
          "worker_assignment",
          "scheduling",
          "resource_allocation",
          "skill_gap",
          // "high_priority",
        ]),
        explanation: z.string(),
      }),
      system:
        "You are an AI assistant for a maintenance management system. Your task is to analyze work orders and workers data to identify the root cause of issues.",
      prompt: ` 
      Work Orders: ${JSON.stringify(workOrders)}
      Workers: ${JSON.stringify(workers)}
      Identified Issue: ${issue}

      Analyze the data and identify the root cause of the issue. Keep it simple and concise, in 2-3 sentences.`,
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
  workOrders: any[],
  workers: any[],
  issue: string,
  rootCause: string
) {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        explanation: z.string(),
        rootCause: z.enum([
          "worker_assignment",
          "scheduling",
          "resource_allocation",
          "skill_gap",
          // "high_priority",
        ]),
        suggestedAction: z.enum([
          "assign_worker",
          "reschedule_work_order",
          "reallocate_resources",
          "notify_supervisor",
        ]),
        // successMessage: z.string(),
        changes: z.array(
          z.object({
            workerId: z.string(),
            workOrderId: z.string(),
            description: z.string(),
          })
        ),
      }),
      system:
        "You are an AI assistant for a maintenance management system. Given issue and root cause, identify a potential solution to resolve the root cause in given work orders.",
      prompt: ` 
      Work Orders: ${JSON.stringify(workOrders)}
      Workers: ${JSON.stringify(workers)}
      Identified Issue: ${issue}
      Root Cause: ${rootCause}

      If suggested action is to assign a worker, list which work orders will be assigned to which worker.
      List all the changes that will be made to the system in the changes array, and translate the changes 
      into a user-friendly message so user is aware of the exact changes that will be made.`,
      temperature: 0.2,
    });

    return object;

  } catch (error) {
    console.error("Error suggesting actions:", error);
    return "Error suggesting actions.";
  }
}
