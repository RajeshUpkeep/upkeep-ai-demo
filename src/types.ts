export interface WorkerAssignment {
  workerId: string;
  workOrderId: string;
  resource?: string;
  description?: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  dueDate: string;
  assignedWorkers: string[];
  priority: string;
  createdAt: string;
}

export interface Insight {
  id: number;
  issue: string;
  rootCause?: string;
  suggestedAction?: string;
  affectedItemsCount?: number;
  filterFunction?: () => void;
  executeAction: (changes?: WorkerAssignment[]) => void;
  suggestedChanges?: WorkerAssignment[];
  selectedChanges?: Set<string>;
} 