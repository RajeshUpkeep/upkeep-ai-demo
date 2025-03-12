"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkOrderTable from "@/components/WorkOrderTable";
import AIInsight from "@/components/AIInsight";

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

interface Insight {
  id: number;
  issue: string;
  rootCause?: string;
  suggestedAction?: string;
  affectedItemsCount?: number;
  filterFunction?: () => void;
  executeAction?: () => void;
}

export default function Home() {
  // State for work orders
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [idFilter, setIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // State for AI analysis
  const [aiLoading, setAiLoading] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [overdueWorkOrderIds, setOverdueWorkOrderIds] = useState<string[]>([]);
  const [highPriorityWorkOrderIds, setHighPriorityWorkOrderIds] = useState<
    string[]
  >([]);
  const [maintenanceDueAssetIds, setMaintenanceDueAssetIds] = useState<
    string[]
  >([]);
  const [lowInventoryPartIds, setLowInventoryPartIds] = useState<string[]>([]);
  const [skillGapWorkOrderIds, setSkillGapWorkOrderIds] = useState<string[]>(
    []
  );

  // Fetch work orders on component mount
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/workOrders");

        if (!response.ok) {
          throw new Error("Failed to fetch work orders");
        }

        const data = await response.json();
        setWorkOrders(data);
        setFilteredWorkOrders(data);

        analyzeWorkOrders(data);
      } catch (err) {
        setError("Error fetching work orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, []);

  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
  }, [idFilter, statusFilter, locationFilter, workOrders]);

  // Apply filters to work orders
  const applyFilters = () => {
    let filtered = [...workOrders];

    if (idFilter) {
      filtered = filtered.filter((wo) =>
        wo.id.toLowerCase().includes(idFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (wo) => wo.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(
        (wo) => wo.location.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    setFilteredWorkOrders(filtered);
    setIsFiltered(
      idFilter !== "" || statusFilter !== "" || locationFilter !== ""
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setIdFilter("");
    setStatusFilter("");
    setLocationFilter("");
    setFilteredWorkOrders(workOrders);
    setIsFiltered(false);
  };

  // Filter by overdue work orders at Anaheim
  const filterOverdueWorkOrders = () => {
    setStatusFilter("overdue");
    setLocationFilter("anaheim production");
    // The useEffect will apply the filters
  };

  // Filter by high priority work orders
  const filterHighPriorityWorkOrders = () => {
    clearFilters();
    const filtered = workOrders.filter(
      (wo) => wo.priority.toLowerCase() === "high"
    );
    setFilteredWorkOrders(filtered);
    setIsFiltered(true);
  };

  // Filter by San Diego Plant work orders
  const filterSanDiegoWorkOrders = () => {
    clearFilters();
    setLocationFilter("san diego plant");
  };

  // Filter by Los Angeles Facility work orders
  const filterLosAngelesWorkOrders = () => {
    clearFilters();
    setLocationFilter("los angeles facility");
  };

  // Simulate AI analysis
  const analyzeWorkOrders = async (data: WorkOrder[]) => {
    try {
      setAiLoading(true);

      // Find overdue work orders at Anaheim Production
      const overdueAtAnaheim = data.filter(
        (wo) => wo.status === "Overdue" && wo.location === "Anaheim Production"
      );

      // Store their IDs for filtering
      const overdueIds = overdueAtAnaheim.map((wo) => wo.id);
      setOverdueWorkOrderIds(overdueIds);

      // Find high priority work orders
      const highPriorityWOs = data.filter((wo) => wo.priority === "High");
      const highPriorityIds = highPriorityWOs.map((wo) => wo.id);
      setHighPriorityWorkOrderIds(highPriorityIds);

      // Find work orders at San Diego Plant with skill gaps
      const skillGapWOs = data.filter(
        (wo) =>
          wo.location === "San Diego Plant" &&
          wo.status === "In Progress" &&
          wo.assignedWorkers.length < 2
      );
      const skillGapIds = skillGapWOs.map((wo) => wo.id);
      setSkillGapWorkOrderIds(skillGapIds);

      // Create insights
      const allInsights: Insight[] = [
        {
          id: 1,
          issue: `I noticed you have ${overdueIds.length} overdue work orders at the Anaheim Production location.`,
          // rootCause:
          //   "It appears to be due to the fact that most work orders have 2 workers assigned to them, but these three at Anaheim Production only have one worker assigned.",
          // suggestedAction:
          //   "Would you like me to assign Joe Technician (W010) to these work orders? He has the right skills for these tasks and is currently available at Anaheim Production.",
          affectedItemsCount: overdueIds.length,
          filterFunction: filterOverdueWorkOrders,
          executeAction: executeOverdueAction,
        },
        {
          id: 2,
          issue: `There are ${highPriorityIds.length} high priority work orders that require immediate attention.`,
          rootCause:
            "These work orders are critical for production equipment at San Diego Plant and Los Angeles Facility. Delays could impact production schedules.",
          suggestedAction:
            "Would you like me to notify Maria Rodriguez (W002) and David Johnson (W003) about these high priority tasks? They are the supervisors for these locations.",
          affectedItemsCount: highPriorityIds.length,
          filterFunction: filterHighPriorityWorkOrders,
          executeAction: executeHighPriorityAction,
        },
        {
          id: 3,
          issue: `I've identified ${skillGapIds.length} work orders at San Diego Plant that may require additional skills.`,
          rootCause:
            "These work orders involve complex mechanical systems that typically require specialized welding skills. Currently, they only have one worker assigned.",
          suggestedAction:
            "Would you like me to assign Sarah Williams (W004) to assist with these work orders? She has the necessary welding certification and will be available tomorrow.",
          affectedItemsCount: skillGapIds.length,
          filterFunction: filterSanDiegoWorkOrders,
          executeAction: executeSkillGapAction,
        },
        {
          id: 4,
          issue:
            "Preventive maintenance is due for 3 critical assets at Los Angeles Facility within the next 7 days.",
          rootCause:
            "These assets have a maintenance schedule that requires monthly inspection. The last maintenance was performed 23 days ago.",
          suggestedAction:
            "Would you like me to schedule preventive maintenance work orders for these assets? I can assign them to David Johnson (W003) who is the supervisor at Los Angeles Facility.",
          affectedItemsCount: 3,
          filterFunction: filterLosAngelesWorkOrders,
          executeAction: executePreventiveMaintenanceAction,
        },
        {
          id: 5,
          issue:
            "Inventory levels for 2 critical spare parts are below the minimum threshold.",
          rootCause:
            "Recent maintenance activities at Anaheim Production have consumed more parts than anticipated. The current stock is insufficient for upcoming scheduled maintenance.",
          suggestedAction:
            "Would you like me to generate purchase orders for these parts? Based on historical usage, I recommend ordering 15 units of each part.",
          affectedItemsCount: 2,
          filterFunction: filterOverdueWorkOrders, // Just as a placeholder
          executeAction: executeInventoryAction,
        },
      ];

      setInsights(allInsights);
      setCurrentInsightIndex(0);
      setAiLoading(false);
    } catch (err) {
      console.error("Error in AI analysis:", err);
      setAiLoading(false);
    }
  };

  // Handle action execution for overdue work orders
  const executeOverdueAction = async () => {
    try {
      setAiLoading(true);

      // Simulate API call to execute action
      setTimeout(() => {
        setAiLoading(false);

        // Update work orders with new worker
        const updatedWorkOrders = workOrders.map((wo) => {
          if (wo.status === "Overdue") {
            return {
              ...wo,
              assignedWorkers: [...wo.assignedWorkers, "W010"],
            };
          }
          return wo;
        });

        setWorkOrders(updatedWorkOrders);

        // If filters are applied, update filtered work orders too
        if (isFiltered) {
          applyFilters();
        } else {
          setFilteredWorkOrders(updatedWorkOrders);
        }
      }, 2000);
    } catch (err) {
      console.error("Error executing action:", err);
      setAiLoading(false);
    }
  };

  // Handle action execution for high priority work orders
  const executeHighPriorityAction = async () => {
    try {
      setAiLoading(true);

      // Simulate API call to execute action
      setTimeout(() => {
        setAiLoading(false);

        // In a real app, this would send notifications to the supervisors
        console.log(
          "Notifications sent to supervisors about high priority work orders"
        );
      }, 2000);
    } catch (err) {
      console.error("Error executing action:", err);
      setAiLoading(false);
    }
  };

  // Handle action execution for skill gap work orders
  const executeSkillGapAction = async () => {
    try {
      setAiLoading(true);

      // Simulate API call to execute action
      setTimeout(() => {
        setAiLoading(false);

        // Update work orders with new worker
        const updatedWorkOrders = workOrders.map((wo) => {
          if (
            wo.location === "San Diego Plant" &&
            wo.status === "In Progress" &&
            wo.assignedWorkers.length < 2
          ) {
            return {
              ...wo,
              assignedWorkers: [...wo.assignedWorkers, "W004"],
            };
          }
          return wo;
        });

        setWorkOrders(updatedWorkOrders);

        // If filters are applied, update filtered work orders too
        if (isFiltered) {
          applyFilters();
        } else {
          setFilteredWorkOrders(updatedWorkOrders);
        }
      }, 2000);
    } catch (err) {
      console.error("Error executing action:", err);
      setAiLoading(false);
    }
  };

  // Handle action execution for preventive maintenance
  const executePreventiveMaintenanceAction = async () => {
    try {
      setAiLoading(true);

      // Simulate API call to execute action
      setTimeout(() => {
        setAiLoading(false);

        // In a real app, this would create new preventive maintenance work orders
        console.log(
          "Preventive maintenance work orders created and assigned to W003"
        );
      }, 2000);
    } catch (err) {
      console.error("Error executing action:", err);
      setAiLoading(false);
    }
  };

  // Handle action execution for inventory
  const executeInventoryAction = async () => {
    try {
      setAiLoading(true);

      // Simulate API call to execute action
      setTimeout(() => {
        setAiLoading(false);

        // In a real app, this would create purchase orders
        console.log("Purchase orders generated for low inventory parts");
      }, 2000);
    } catch (err) {
      console.error("Error executing action:", err);
      setAiLoading(false);
    }
  };

  // Handle work order row click
  const handleWorkOrderClick = (workOrder: WorkOrder) => {
    console.log("Work order clicked:", workOrder.id);
    // You can implement additional functionality here
  };

  // Handle ID filter change
  const handleIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdFilter(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
  };

  // Handle location filter change
  const handleLocationFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLocationFilter(e.target.value);
  };

  // Handle skip to next insight
  const handleSkipInsight = () => {
    if (currentInsightIndex < insights.length - 1) {
      setCurrentInsightIndex(currentInsightIndex + 1);
    } else {
      // If we're at the last insight, loop back to the first one
      setCurrentInsightIndex(0);
    }
  };

  // Get current insight
  const currentInsight = insights[currentInsightIndex];

  const fetchRootCauseAndAction = async () => {
    const rootCauses = await fetch("/api/ai/rootCause", {
      method: "POST",
      body: JSON.stringify({
        workOrders: filteredWorkOrders.filter((wo) => wo.status === "Overdue"),
        issue: "overdue",
      }),
    });
    const rootCausesData = await rootCauses.json();

    const actions = await fetch("/api/ai/suggestActions", {
      method: "POST",
      body: JSON.stringify({
        workOrders: filteredWorkOrders.filter((wo) => wo.status === "Overdue"),
        issue: "overdue",
        rootCause: rootCausesData?.root_cause,
      }),
    });
    const actionsData = await actions.json();

    console.log(actionsData);

    const newInsights = insights.map((insight, index) => {
      if (index === 0) {
        return {
          ...insight,
          rootCause: rootCausesData?.explanation,
          suggestedAction: actionsData?.explanation,
        };
      }
      return insight;
    });

    console.log(newInsights);

    setInsights(newInsights);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab="work orders" />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Work Orders</h1>
            <p className="text-gray-600">
              Manage and track maintenance work orders
            </p>
          </div>

          {/* AI Insights Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              AI Insights
            </h2>
            {insights.length > 0 && currentInsight && (
              <AIInsight
                issue={currentInsight.issue}
                rootCause={currentInsight.rootCause}
                suggestedAction={currentInsight.suggestedAction}
                loading={aiLoading}
                onActionClick={currentInsight.executeAction}
                onViewAffectedItems={currentInsight.filterFunction}
                affectedItemsCount={currentInsight.affectedItemsCount}
                onSkip={handleSkipInsight}
                insightNumber={currentInsightIndex + 1}
                totalInsights={insights.length}
                onWhyClick={fetchRootCauseAndAction}
              />
            )}
          </div>

          {/* Work Orders Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                All Work Orders
              </h2>

              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="id-filter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Work Order ID
                    </label>
                    <input
                      id="id-filter"
                      type="text"
                      value={idFilter}
                      onChange={handleIdFilterChange}
                      placeholder="Filter by ID..."
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="status-filter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      className="w-full border rounded-md px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white bg-no-repeat bg-[position:right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[size:20px_20px]"
                    >
                      <option value="" className="text-gray-800">
                        All Statuses
                      </option>
                      <option value="completed" className="text-gray-800">
                        Completed
                      </option>
                      <option value="in progress" className="text-gray-800">
                        In Progress
                      </option>
                      <option value="overdue" className="text-gray-800">
                        Overdue
                      </option>
                      <option value="scheduled" className="text-gray-800">
                        Scheduled
                      </option>
                    </select>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="location-filter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location
                    </label>
                    <select
                      id="location-filter"
                      value={locationFilter}
                      onChange={handleLocationFilterChange}
                      className="w-full border rounded-md px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white bg-no-repeat bg-[position:right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[size:20px_20px]"
                    >
                      <option value="" className="text-gray-800">
                        All Locations
                      </option>
                      <option
                        value="anaheim production"
                        className="text-gray-800"
                      >
                        Anaheim Production
                      </option>
                      <option value="san diego plant" className="text-gray-800">
                        San Diego Plant
                      </option>
                      <option
                        value="los angeles facility"
                        className="text-gray-800"
                      >
                        Los Angeles Facility
                      </option>
                    </select>
                  </div>

                  {isFiltered && (
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {isFiltered && (
                  <div className="mt-3 text-sm text-gray-600">
                    Showing {filteredWorkOrders.length} of {workOrders.length}{" "}
                    work orders
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-800 p-4 rounded-md">
                {error}
              </div>
            ) : (
              <WorkOrderTable
                workOrders={filteredWorkOrders}
                onRowClick={handleWorkOrderClick}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
