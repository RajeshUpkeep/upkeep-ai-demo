# UpKeep AI Assistant POC

This is a proof of concept (POC) for an AI-powered maintenance management system built for UpKeep. The application demonstrates how AI can help maintenance managers identify issues, analyze root causes, and suggest actions to resolve problems.

## Features

- **Work Order Management**: View and manage maintenance work orders
- **AI-Powered Analysis**: Automatically identify potential issues in work orders
- **Root Cause Analysis**: AI provides insights into why issues are occurring
- **Action Recommendations**: Get suggestions for resolving identified issues
- **Action Execution**: Implement AI-suggested actions with a single click

## Technology Stack

- **Frontend**: React with Next.js
- **Backend**: Next.js API Routes
- **Database**: CSV files for data storage
- **AI Integration**: OpenAI API

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-demo-poc
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router pages and API routes
- `/src/components`: React components
- `/src/data`: CSV data files
- `/src/utils`: Utility functions for CSV handling and OpenAI integration

## Demo Flow

The application demonstrates the following flow:

1. **Step 1**: Manager opens UpKeep to view work orders. The AI assistant starts analyzing work order data.
2. **Step 2**: The AI assistant identifies potential issues (e.g., overdue work orders).
3. **Step 3**: The AI provides insights about why the issue occurred (e.g., insufficient worker assignments).
4. **Step 4**: The AI suggests actions to resolve the issue (e.g., assigning additional workers).
5. **Step 5**: The manager approves the suggested action, and the AI executes it.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
