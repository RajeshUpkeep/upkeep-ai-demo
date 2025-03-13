"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkOrderTable from "@/components/WorkOrderTable";
import AIInsight from "@/components/AIInsight";
import { Insight, WorkOrderChanges } from "@/utils/types";
import { WorkOrder } from "@/utils/types";
import { useToast } from "@/components/Toast";

export default function Home() {
  // State for work orders
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Filter states
  const [idFilter, setIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [workerCountFilter, setWorkerCountFilter] = useState<number | null>(
    null
  );

  // State for AI analysis
  const [aiLoading, setAiLoading] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [currentInsight, setCurrentInsight] = useState<Insight | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);

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
  }, [idFilter, statusFilter, locationFilter, priorityFilter, workOrders]);

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

    if (priorityFilter) {
      filtered = filtered.filter(
        (wo) => wo.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    if (workerCountFilter !== null) {
      filtered = filtered.filter(
        (wo) => wo.assignedWorkers.length < workerCountFilter
      );
    }

    setFilteredWorkOrders(filtered);
    setIsFiltered(
      idFilter !== "" ||
        statusFilter !== "" ||
        locationFilter !== "" ||
        priorityFilter !== "" ||
        workerCountFilter !== null
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setIdFilter("");
    setStatusFilter("");
    setLocationFilter("");
    setPriorityFilter("");
    setWorkerCountFilter(null);
    setFilteredWorkOrders(workOrders);
    setIsFiltered(false);
  };

  // Filter by overdue work orders at Anaheim
  const filterOverdueWorkOrders = () => {
    setStatusFilter("overdue");
    // The useEffect will apply the filters
  };

  // Filter by high priority work orders
  const filterHighPriorityWorkOrders = () => {
    setPriorityFilter("high");
  };

  // Filter by San Diego Plant work orders
  const filterSkillGapWorkOrders = () => {
    clearFilters();
    setStatusFilter("in progress");
    setWorkerCountFilter(2);
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
      const overdueWorkOrders = data.filter((wo) => wo.status === "Overdue");

      // Store their IDs for filtering
      const overdueIds = overdueWorkOrders.map((wo) => wo.id);

      // Find high priority work orders
      const highPriorityIds = data
        .filter((wo) => wo.priority === "High")
        .map((wo) => wo.id);

      // Find work orders at San Diego Plant with skill gaps
      const skillGapIds = data
        .filter(
          (wo) => wo.status === "In Progress" && wo.assignedWorkers.length < 2
        )
        .map((wo) => wo.id);

      // Create insights
      const allInsights: Insight[] = [
        {
          id: 1,
          issue: `I noticed you have ${overdueIds.length} overdue work orders`,
          affectedItemsCount: overdueIds.length,
          filterFunction: filterOverdueWorkOrders,
          executeAction: executeOverdueAction,
        },
        {
          id: 2,
          issue: `There are ${highPriorityIds.length} high priority work orders that require immediate attention.`,
          affectedItemsCount: highPriorityIds.length,
          filterFunction: filterHighPriorityWorkOrders,
          executeAction: executeHighPriorityAction,
        },
        {
          id: 3,
          issue: `I've identified ${skillGapIds.length} work orders that require additional skills.`,
          // rootCause:
          //   "These work orders involve complex mechanical systems that typically require specialized welding skills. Currently, they only have one worker assigned.",
          // suggestedAction:
          //   "Would you like me to assign Sarah Williams (W004) to assist with these work orders? She has the necessary welding certification and will be available tomorrow.",
          affectedItemsCount: skillGapIds.length,
          filterFunction: filterSkillGapWorkOrders,
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
  const executeOverdueAction = async (changes?: WorkOrderChanges[]) => {
    try {
      setAiLoading(true);

      // Simulate API call to execute action
      setTimeout(() => {
        if (!changes || changes.length === 0) {
          console.log("No changes to apply");
          setAiLoading(false);
          return;
        }

        // Create a new array of updated work orders
        const updatedWorkOrders = workOrders.map((wo) => {
          // Check if this work order needs to be updated
          const workOrderChanges = changes.filter(
            (c) => c.workOrderId === wo.id
          );

          if (workOrderChanges.length > 0) {
            // Create a new work order object with all changes applied
            const updatedWorkOrder = { ...wo };

            workOrderChanges.forEach((change) => {
              if (change.field === "assignedWorkers" && change.newValue) {
                // Handle adding workers to assignedWorkers array
                // Since newValue is now an array of strings, we can spread it directly
                updatedWorkOrder.assignedWorkers = change.newValue;
                // Show toast notification for worker assignment
                change.newValue.forEach((worker) => {
                  showToast({
                    message: `Worker ${worker} assigned to work order ${wo.id}`,
                    type: "success",
                    duration: 3000,
                  });
                });
              } else if (
                change.field === "status" &&
                change.newValue &&
                change.newValue.length > 0
              ) {
                // Handle status change - use the first value in the array
                updatedWorkOrder.status = change.newValue[0];
              } else if (
                change.field === "priority" &&
                change.newValue &&
                change.newValue.length > 0
              ) {
                // Handle priority change - use the first value in the array
                updatedWorkOrder.priority = change.newValue[0];
              }
              // Add more field handlers as needed
            });

            return updatedWorkOrder;
          }

          // Return the original work order if no changes needed
          return wo;
        });

        // Update both the main work orders and filtered work orders
        setWorkOrders(updatedWorkOrders);

        // Apply current filters to the updated work orders
        if (isFiltered) {
          applyFilters();
        } else {
          setFilteredWorkOrders(updatedWorkOrders);
        }

        console.log("Work orders updated with new changes");
        setAiLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error executing action:", err);
      setAiLoading(false);
    }
  };

  // Handle action execution for high priority work orders
  const executeHighPriorityAction = async (changes?: WorkOrderChanges[]) => {
    try {
      setAiLoading(true);

      // Simulate API call to execute action
      setTimeout(() => {
        if (changes && changes.length > 0) {
          // Process any changes to work orders if needed
          const updatedWorkOrders = workOrders.map((wo) => {
            const workOrderChanges = changes.filter(
              (c) => c.workOrderId === wo.id
            );

            if (workOrderChanges.length > 0) {
              const updatedWorkOrder = { ...wo };

              workOrderChanges.forEach((change) => {
                if (
                  change.field === "status" &&
                  change.newValue &&
                  change.newValue.length > 0
                ) {
                  updatedWorkOrder.status = change.newValue[0];
                } else if (
                  change.field === "priority" &&
                  change.newValue &&
                  change.newValue.length > 0
                ) {
                  updatedWorkOrder.priority = change.newValue[0];
                } else if (
                  change.field === "assignedWorkers" &&
                  change.newValue
                ) {
                  // Add the workers to the assigned workers array
                  updatedWorkOrder.assignedWorkers = change.newValue;
                  // Show toast notification for worker assignment
                  change.newValue.forEach((worker) => {
                    showToast({
                      message: `Worker ${worker} assigned to work order ${wo.id}`,
                      type: "success",
                      duration: 3000,
                    });
                  });
                } else if (
                  change.field === "notified" &&
                  change.newValue &&
                  change.newValue.includes("true")
                ) {
                  // Show toast notification instead of console log
                  showToast({
                    message: `Notification sent to supervisors & workers for work order ${wo.id}`,
                    type: "success",
                    duration: 3000,
                  });
                }
              });

              return updatedWorkOrder;
            }
            return wo;
          });

          // Update work orders if changes were made
          setWorkOrders(updatedWorkOrders);

          // Apply current filters
          if (isFiltered) {
            applyFilters();
          } else {
            setFilteredWorkOrders(updatedWorkOrders);
          }
        }

        // In a real app, this would send notifications to the supervisors
        console.log(
          "Notifications sent to supervisors about high priority work orders"
        );

        setAiLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Error executing action:", err);
      setAiLoading(false);
    }
  };

  // Handle action execution for skill gap work orders
  const executeSkillGapAction = async (changes?: WorkOrderChanges[]) => {
    try {
      setAiLoading(true);

      // Simulate API call to execute action
      setTimeout(() => {
        // If we have specific changes from the API, use those
        if (changes && changes.length > 0) {
          const updatedWorkOrders = workOrders.map((wo) => {
            const workOrderChanges = changes.filter(
              (c) => c.workOrderId === wo.id
            );

            if (workOrderChanges.length > 0) {
              const updatedWorkOrder = { ...wo };

              workOrderChanges.forEach((change) => {
                if (change.field === "assignedWorkers" && change.newValue) {
                  // Merge the new workers with existing ones instead of replacing
                  // Create a Set to avoid duplicates
                  const existingWorkers = new Set(
                    updatedWorkOrder.assignedWorkers
                  );
                  change.newValue.forEach((worker) =>
                    existingWorkers.add(worker)
                  );
                  updatedWorkOrder.assignedWorkers =
                    Array.from(existingWorkers);

                  // Show toast notification for worker assignment
                  change.newValue.forEach((worker) => {
                    showToast({
                      message: `Worker ${worker} assigned to work order ${wo.id}`,
                      type: "success",
                      duration: 3000,
                    });
                  });
                } else if (
                  change.field === "status" &&
                  change.newValue &&
                  change.newValue.length > 0
                ) {
                  updatedWorkOrder.status = change.newValue[0];
                }
              });

              return updatedWorkOrder;
            }
            return wo;
          });

          setWorkerCountFilter(null);

          setWorkOrders(updatedWorkOrders);

          // If filters are applied, update filtered work orders too
          if (isFiltered) {
            applyFilters();
          } else {
            setFilteredWorkOrders(updatedWorkOrders);
          }
        }

        setAiLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Error executing action:", err);
      setAiLoading(false);
    }
  };

  // Handle action execution for preventive maintenance
  const executePreventiveMaintenanceAction = async (
    changes?: WorkOrderChanges[]
  ) => {
    try {
      setAiLoading(true);

      // Simulate API call to execute action
      setTimeout(() => {
        // Process changes if provided
        if (changes && changes.length > 0) {
          const updatedWorkOrders = workOrders.map((wo) => {
            const workOrderChanges = changes.filter(
              (c) => c.workOrderId === wo.id
            );

            if (workOrderChanges.length > 0) {
              const updatedWorkOrder = { ...wo };

              workOrderChanges.forEach((change) => {
                if (change.field === "assignedWorkers" && change.newValue) {
                  // Add the workers to the assigned workers array
                  updatedWorkOrder.assignedWorkers = [
                    ...updatedWorkOrder.assignedWorkers,
                    ...change.newValue,
                  ];
                  // Show toast notification for worker assignment
                  change.newValue.forEach((worker) => {
                    showToast({
                      message: `Worker ${worker} assigned to work order ${wo.id}`,
                      type: "success",
                      duration: 3000,
                    });
                  });
                } else if (
                  change.field === "status" &&
                  change.newValue &&
                  change.newValue.length > 0
                ) {
                  updatedWorkOrder.status = change.newValue[0];
                }
              });

              return updatedWorkOrder;
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
        }

        // In a real app, this would create new preventive maintenance work orders
        console.log(
          "Preventive maintenance work orders created and assigned to W003"
        );

        // Show toast notification for preventive maintenance
        showToast({
          message:
            "Preventive maintenance work orders created and assigned to W003",
          type: "success",
          duration: 3000,
        });

        setAiLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Error executing action:", err);
      setAiLoading(false);
    }
  };

  // Handle action execution for inventory
  const executeInventoryAction = async (changes?: WorkOrderChanges[]) => {
    try {
      setAiLoading(true);

      // Simulate API call to execute action
      setTimeout(() => {
        // Process changes if provided
        if (changes && changes.length > 0) {
          const updatedWorkOrders = workOrders.map((wo) => {
            const workOrderChanges = changes.filter(
              (c) => c.workOrderId === wo.id
            );

            if (workOrderChanges.length > 0) {
              const updatedWorkOrder = { ...wo };

              workOrderChanges.forEach((change) => {
                if (change.field === "assignedWorkers" && change.newValue) {
                  // Add the workers to the assigned workers array
                  updatedWorkOrder.assignedWorkers = [
                    ...updatedWorkOrder.assignedWorkers,
                    ...change.newValue,
                  ];
                  // Show toast notification for worker assignment
                  change.newValue.forEach((worker) => {
                    showToast({
                      message: `Worker ${worker} assigned to work order ${wo.id}`,
                      type: "success",
                      duration: 3000,
                    });
                  });
                } else if (
                  change.field === "status" &&
                  change.newValue &&
                  change.newValue.length > 0
                ) {
                  updatedWorkOrder.status = change.newValue[0];
                } else if (
                  change.field === "priority" &&
                  change.newValue &&
                  change.newValue.length > 0
                ) {
                  updatedWorkOrder.priority = change.newValue[0];
                }
              });

              return updatedWorkOrder;
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
        }

        // In a real app, this would create purchase orders
        console.log("Purchase orders generated for low inventory parts");

        // Show toast notification for inventory action
        showToast({
          message: "Purchase orders generated for critical spare parts",
          type: "success",
          duration: 3000,
        });

        setAiLoading(false);
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

  // Handle priority filter change
  const handlePriorityFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriorityFilter(e.target.value);
  };

  // Handle skip to next insight
  const handleNextInsight = () => {
    if (currentInsightIndex < insights.length - 1) {
      setCurrentInsightIndex(currentInsightIndex + 1);
    } else {
      // If we're at the last insight, loop back to the first one
      setCurrentInsightIndex(0);
    }
  };

  const handlePreviousInsight = () => {
    if (currentInsightIndex > 0) {
      setCurrentInsightIndex(currentInsightIndex - 1);
    } else {
      setCurrentInsightIndex(insights.length - 1);
    }
  };

  useEffect(() => {
    setCurrentInsight(insights[currentInsightIndex]);
  }, [currentInsightIndex, insights]);

  const fetchRootCauseAndAction = async () => {
    setAiLoading(true);
    try {
      let issue = "";
      let workOrders: WorkOrder[] = [];

      switch (currentInsight?.id) {
        case 1: {
          issue = "overdue";
          workOrders = filteredWorkOrders.filter(
            (wo) => wo.status === "Overdue"
          );
          break;
        }
        case 2: {
          issue = "high_priority";
          workOrders = filteredWorkOrders.filter(
            (wo) => wo.priority === "High"
          );
          break;
        }
        case 3: {
          issue = "skill_gap";
          workOrders = filteredWorkOrders.filter(
            (wo) => wo.status === "In Progress" && wo.assignedWorkers.length < 2
          );
          break;
        }
        default: {
          break;
        }
      }

      if (!workOrders.length) {
        setAiLoading(false);
        return;
      }

      const rootCauses = await fetch("/api/ai/rootCause", {
        method: "POST",
        body: JSON.stringify({
          workOrders,
          issue,
        }),
      });
      const rootCausesData = await rootCauses.json();

      const actions = await fetch("/api/ai/suggestActions", {
        method: "POST",
        body: JSON.stringify({
          workOrders,
          issue,
          rootCause: rootCausesData?.rootCause,
        }),
      });
      const actionsData = await actions.json();

      // Only update if we have valid data
      if (rootCausesData?.explanation || actionsData?.explanation) {
        const newInsights = insights.map((insight, index) => {
          if (index === currentInsightIndex) {
            // Update the current insight instead of always updating the first one
            let executeActionFn = insight.executeAction;
            let filterFunctionFn = insight.filterFunction;

            // Set the appropriate execute action function based on the insight ID
            if (currentInsight?.id === 1 && actionsData?.changes) {
              executeActionFn = () => executeOverdueAction(actionsData.changes);
              filterFunctionFn = () => {
                clearFilters();
                filterOverdueWorkOrders();
              };
            } else if (currentInsight?.id === 2) {
              // For high priority work orders, pass the changes array if it exists
              executeActionFn = actionsData?.changes
                ? () => executeHighPriorityAction(actionsData.changes)
                : executeHighPriorityAction;
              filterFunctionFn = () => {
                clearFilters();
                filterHighPriorityWorkOrders();
              };
            } else if (currentInsight?.id === 3) {
              executeActionFn = actionsData?.changes
                ? () => executeSkillGapAction(actionsData.changes)
                : executeSkillGapAction;
              filterFunctionFn = () => {
                clearFilters();
                filterSkillGapWorkOrders();
              };
            } else if (currentInsight?.id === 4) {
              executeActionFn = actionsData?.changes
                ? () => executePreventiveMaintenanceAction(actionsData.changes)
                : executePreventiveMaintenanceAction;
              filterFunctionFn = () => {
                clearFilters();
                filterLosAngelesWorkOrders();
              };
            } else if (currentInsight?.id === 5) {
              executeActionFn = actionsData?.changes
                ? () => executeInventoryAction(actionsData.changes)
                : executeInventoryAction;
              filterFunctionFn = () => {
                clearFilters();
                filterOverdueWorkOrders();
              };
            }

            return {
              ...insight,
              rootCause: rootCausesData?.explanation || insight.rootCause,
              suggestedAction:
                actionsData?.explanation || insight.suggestedAction,
              executeAction: executeActionFn,
              filterFunction: filterFunctionFn,
              successMessage:
                actionsData?.successMessage || insight.successMessage,
            };
          }
          return insight;
        });

        // Only update state if something actually changed
        const currentInsightData = insights[currentInsightIndex] || {};
        const newInsightData = newInsights[currentInsightIndex] || {};

        const hasChanged =
          currentInsightData.rootCause !== newInsightData.rootCause ||
          currentInsightData.suggestedAction !==
            newInsightData.suggestedAction ||
          currentInsightData.successMessage !== newInsightData.successMessage;

        if (hasChanged) {
          console.log("Updating insights with new data");
          setInsights(newInsights);
        }
      }
    } catch (error) {
      console.error("Error fetching root cause and actions:", error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar activeTab="work orders" />
        <main className="flex-1 p-6 ml-64">
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
                onNext={handleNextInsight}
                onPrevious={handlePreviousInsight}
                insightNumber={currentInsightIndex + 1}
                totalInsights={insights.length}
                onWhyClick={fetchRootCauseAndAction}
                successMessage={currentInsight.successMessage}
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

                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="priority-filter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Priority
                    </label>
                    <select
                      id="priority-filter"
                      value={priorityFilter}
                      onChange={handlePriorityFilterChange}
                      className="w-full border rounded-md px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white bg-no-repeat bg-[position:right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[size:20px_20px]"
                    >
                      <option value="" className="text-gray-800">
                        All Priorities
                      </option>
                      <option value="high" className="text-gray-800">
                        High
                      </option>
                      <option value="medium" className="text-gray-800">
                        Medium
                      </option>
                      <option value="low" className="text-gray-800">
                        Low
                      </option>
                    </select>
                  </div>

                  {isFiltered && (
                    <div className="flex items-end mt-6">
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
