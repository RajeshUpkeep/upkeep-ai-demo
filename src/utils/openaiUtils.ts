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
): Promise<string> {
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
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "system",
    //       content: `You are an AI assistant for a maintenance management system. Your task is to analyze work orders and identify potential issues such as ${criteria} work orders, `,
    //     },
    //     {
    //       role: "user",
    //       content: `Analyze these work orders and identify any potential issues: ${JSON.stringify(
    //         workOrders
    //       )},
    //       return the response in a json format, with root_cause and suggested_actions`,
    //     },
    //   ],
    // });

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
        root_cause: z.enum([
          "worker_assignment",
          "scheduling",
          "resource_allocation",
        ]),
        explanation: z.string(),
      }),
      system:
        "You are an AI assistant for a maintenance management system. Your task is to analyze work orders and workers data to identify the root cause of issues.",
      prompt: ` 
      Work Orders: ${JSON.stringify(workOrders)}
      Workers: ${JSON.stringify(workers)}
      Identified Issue: ${issue}

      Analyze the data and identify the root cause of the issue. Focus on patterns like worker assignments, scheduling, or resource allocation.`,
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
      output: "object",
      schema: z.object({
        explanation: z.string(),
        changes: z.array(
          z.object({
            root_cause: z.enum([
              "worker_assignment",
              "scheduling",
              "resource_allocation",
            ]),
            suggestActions: z.enum([
              "assign_worker",
              "reschedule_work_order",
              "reallocate_resources",
            ]),
            params: z.object({
              worker: z.string(),
              workOrder: z.string(),
              resource: z.string(),
            }),
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
      Also, provide an explanation of changes that need to be made to the system to resolve the issue.`,
      temperature: 0.2,
    });

    return object;

    // const response = await openai.chat.completions.create({
    //   model: "gpt-4-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are an AI assistant for a maintenance management system. Your task is to suggest actions to resolve identified issues based on their root causes.",
    //     },
    //     {
    //       role: "user",
    //       content: `
    //         Work Orders: ${JSON.stringify(workOrders)}
    //         Workers: ${JSON.stringify(workers)}
    //         Identified Issue: ${issue}
    //         Root Cause: ${rootCause}

    //         Suggest specific actions to resolve the issue. Be specific about which work orders need attention and which workers could be assigned.
    //       `,
    //     },
    //   ],
    //   temperature: 0.7,
    //   max_tokens: 500,
    // });
  } catch (error) {
    console.error("Error suggesting actions:", error);
    return "Error suggesting actions.";
  }
}
