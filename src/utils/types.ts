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

export interface WorkOrderChanges {
  workOrderId: string;
  field: string;
  newValue: string[];
}

export interface Insight {
  id: number;
  issue: string;
  rootCause?: string;
  suggestedAction?: string;
  affectedItemsCount?: number;
  successMessage?: string;
  filterFunction?: () => void;
  executeAction?: (changes?: WorkOrderChanges[]) => void;
}
