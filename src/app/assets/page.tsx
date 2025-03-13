"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  department: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  status: string;
  healthScore: number;
}

export default function AssetsPage() {
  // State for assets
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // Fetch assets on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);

        // Simulate API call with mock data
        setTimeout(() => {
          const mockAssets: Asset[] = [
            {
              id: "AST001",
              name: "HVAC Unit 1",
              type: "HVAC",
              location: "Anaheim Production",
              department: "Facilities",
              manufacturer: "Carrier",
              model: "XC95m",
              serialNumber: "CAR-12345-XC",
              installDate: "2020-03-15",
              lastMaintenanceDate: "2023-06-10",
              nextMaintenanceDate: "2023-12-10",
              status: "Operational",
              healthScore: 92,
            },
            {
              id: "AST002",
              name: "Production Line A",
              type: "Manufacturing Equipment",
              location: "Anaheim Production",
              department: "Production",
              manufacturer: "Siemens",
              model: "PL-2000",
              serialNumber: "SIE-67890-PL",
              installDate: "2019-05-22",
              lastMaintenanceDate: "2023-07-05",
              nextMaintenanceDate: "2023-10-05",
              status: "Operational",
              healthScore: 88,
            },
            {
              id: "AST003",
              name: "Forklift 3",
              type: "Material Handling",
              location: "San Diego Plant",
              department: "Logistics",
              manufacturer: "Toyota",
              model: "FL-8500",
              serialNumber: "TOY-54321-FL",
              installDate: "2021-01-10",
              lastMaintenanceDate: "2023-08-15",
              nextMaintenanceDate: "2023-11-15",
              status: "Needs Attention",
              healthScore: 76,
            },
            {
              id: "AST004",
              name: "Boiler System",
              type: "Utility",
              location: "Los Angeles Facility",
              department: "Facilities",
              manufacturer: "Cleaver-Brooks",
              model: "CB-700",
              serialNumber: "CB-13579-BS",
              installDate: "2018-11-30",
              lastMaintenanceDate: "2023-05-20",
              nextMaintenanceDate: "2023-11-20",
              status: "Operational",
              healthScore: 85,
            },
            {
              id: "AST005",
              name: "CNC Machine 2",
              type: "Manufacturing Equipment",
              location: "San Diego Plant",
              department: "Production",
              manufacturer: "Haas",
              model: "VF-2",
              serialNumber: "HAAS-24680-CNC",
              installDate: "2020-09-05",
              lastMaintenanceDate: "2023-04-12",
              nextMaintenanceDate: "2023-10-12",
              status: "Down for Maintenance",
              healthScore: 65,
            },
          ];

          setAssets(mockAssets);
          setFilteredAssets(mockAssets);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Error fetching assets");
        console.error(err);
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
  }, [nameFilter, typeFilter, locationFilter, statusFilter, assets]);

  // Apply filters to assets
  const applyFilters = () => {
    let filtered = [...assets];

    if (nameFilter) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
          asset.id.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(
        (asset) => asset.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(
        (asset) => asset.location.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (asset) => asset.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredAssets(filtered);
    setIsFiltered(
      nameFilter !== "" ||
        typeFilter !== "" ||
        locationFilter !== "" ||
        statusFilter !== ""
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setNameFilter("");
    setTypeFilter("");
    setLocationFilter("");
    setStatusFilter("");
    setFilteredAssets(assets);
    setIsFiltered(false);
  };

  // Handle name filter change
  const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
  };

  // Handle type filter change
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };

  // Handle location filter change
  const handleLocationFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLocationFilter(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
  };

  // Handle asset row click
  const handleAssetClick = (asset: Asset) => {
    console.log("Asset clicked:", asset.id);
    // You can implement additional functionality here
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get health score color
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 75) return "bg-blue-100 text-blue-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational":
        return "bg-green-100 text-green-800";
      case "needs attention":
        return "bg-yellow-100 text-yellow-800";
      case "down for maintenance":
        return "bg-blue-100 text-blue-800";
      case "out of service":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 pt-16">
        <Sidebar activeTab="assets" />
        <main className="flex-1 p-6 ml-64">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Assets</h1>
            <p className="text-gray-600">
              Manage and track equipment and assets
            </p>
          </div>

          {/* Assets Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                All Assets
              </h2>

              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="name-filter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name or ID
                    </label>
                    <input
                      id="name-filter"
                      type="text"
                      value={nameFilter}
                      onChange={handleNameFilterChange}
                      placeholder="Filter by name or ID..."
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label
                      htmlFor="type-filter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Type
                    </label>
                    <select
                      id="type-filter"
                      value={typeFilter}
                      onChange={handleTypeFilterChange}
                      className="w-full border rounded-md px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white bg-no-repeat bg-[position:right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[size:20px_20px]"
                    >
                      <option value="" className="text-gray-800">
                        All Types
                      </option>
                      <option value="hvac" className="text-gray-800">
                        HVAC
                      </option>
                      <option
                        value="manufacturing equipment"
                        className="text-gray-800"
                      >
                        Manufacturing Equipment
                      </option>
                      <option
                        value="material handling"
                        className="text-gray-800"
                      >
                        Material Handling
                      </option>
                      <option value="utility" className="text-gray-800">
                        Utility
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
                      <option value="operational" className="text-gray-800">
                        Operational
                      </option>
                      <option value="needs attention" className="text-gray-800">
                        Needs Attention
                      </option>
                      <option
                        value="down for maintenance"
                        className="text-gray-800"
                      >
                        Down for Maintenance
                      </option>
                      <option value="out of service" className="text-gray-800">
                        Out of Service
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
                    Showing {filteredAssets.length} of {assets.length} assets
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
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">ID</th>
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Type</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Location
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Health Score
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Next Maintenance
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleAssetClick(asset)}
                      >
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {asset.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">
                            {asset.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {asset.manufacturer} {asset.model}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {asset.type}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {asset.location}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthScoreColor(
                                asset.healthScore
                              )}`}
                            >
                              {asset.healthScore}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {formatDate(asset.nextMaintenanceDate)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              asset.status
                            )}`}
                          >
                            {asset.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
