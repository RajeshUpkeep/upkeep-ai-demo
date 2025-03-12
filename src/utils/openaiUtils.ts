import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze work orders to identify issues
 * @param workOrders - Array of work order objects
 * @returns Promise<string> - A promise that resolves to the AI's analysis
 */
export async function analyzeWorkOrders(workOrders: any[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant for a maintenance management system. Your task is to analyze work orders and identify potential issues such as overdue work orders, resource allocation problems, or maintenance patterns."
        },
        {
          role: "user",
          content: `Analyze these work orders and identify any potential issues: ${JSON.stringify(workOrders)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "No issues identified.";
  } catch (error) {
    console.error('Error analyzing work orders:', error);
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
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant for a maintenance management system. Your task is to analyze work orders and workers data to identify the root cause of issues."
        },
        {
          role: "user",
          content: `
            Work Orders: ${JSON.stringify(workOrders)}
            Workers: ${JSON.stringify(workers)}
            Identified Issue: ${issue}
            
            Analyze the data and identify the root cause of the issue. Focus on patterns like worker assignments, scheduling, or resource allocation.
          `
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "Could not identify root cause.";
  } catch (error) {
    console.error('Error identifying root cause:', error);
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
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant for a maintenance management system. Your task is to suggest actions to resolve identified issues based on their root causes."
        },
        {
          role: "user",
          content: `
            Work Orders: ${JSON.stringify(workOrders)}
            Workers: ${JSON.stringify(workers)}
            Identified Issue: ${issue}
            Root Cause: ${rootCause}
            
            Suggest specific actions to resolve the issue. Be specific about which work orders need attention and which workers could be assigned.
          `
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "No actions suggested.";
  } catch (error) {
    console.error('Error suggesting actions:', error);
    return "Error suggesting actions.";
  }
} 