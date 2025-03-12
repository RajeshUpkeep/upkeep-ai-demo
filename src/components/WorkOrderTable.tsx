import React from 'react';

interface WorkOrder {
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

interface WorkOrderTableProps {
  workOrders: WorkOrder[];
  onRowClick: (workOrder: WorkOrder) => void;
}

const WorkOrderTable: React.FC<WorkOrderTableProps> = ({ workOrders, onRowClick }) => {
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left font-medium">ID</th>
            <th className="py-3 px-4 text-left font-medium">Title</th>
            <th className="py-3 px-4 text-left font-medium">Location</th>
            <th className="py-3 px-4 text-left font-medium">Status</th>
            <th className="py-3 px-4 text-left font-medium">Priority</th>
            <th className="py-3 px-4 text-left font-medium">Due Date</th>
            <th className="py-3 px-4 text-left font-medium">Assigned Workers</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {workOrders.map((workOrder) => (
            <tr 
              key={workOrder.id} 
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onRowClick(workOrder)}
            >
              <td className="py-3 px-4 text-sm text-gray-800">{workOrder.id}</td>
              <td className="py-3 px-4">
                <div className="font-medium text-gray-800">{workOrder.title}</div>
                <div className="text-xs text-gray-500 truncate max-w-xs">{workOrder.description}</div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-800">{workOrder.location}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workOrder.status)}`}>
                  {workOrder.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(workOrder.priority)}`}>
                  {workOrder.priority}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-800">{formatDate(workOrder.dueDate)}</td>
              <td className="py-3 px-4">
                <div className="flex -space-x-2">
                  {workOrder.assignedWorkers.slice(0, 3).map((worker, index) => (
                    <div 
                      key={index} 
                      className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium"
                      title={`Worker ${worker}`}
                    >
                      {worker.substring(1, 3)}
                    </div>
                  ))}
                  {workOrder.assignedWorkers.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                      +{workOrder.assignedWorkers.length - 3}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkOrderTable; 