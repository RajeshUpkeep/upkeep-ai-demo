'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface Worker {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  email: string;
  phone: string;
  skills: string[];
  activeWorkOrders: number;
  completedWorkOrders: number;
  status: string;
}

export default function WorkersPage() {
  // State for workers
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  
  // Fetch workers on component mount
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with mock data
        setTimeout(() => {
          const mockWorkers: Worker[] = [
            {
              id: 'W001',
              name: 'John Smith',
              role: 'Technician',
              department: 'Maintenance',
              location: 'Anaheim Production',
              email: 'john.smith@upkeep.com',
              phone: '(714) 555-1234',
              skills: ['Electrical', 'HVAC', 'Plumbing'],
              activeWorkOrders: 3,
              completedWorkOrders: 45,
              status: 'Available'
            },
            {
              id: 'W002',
              name: 'Maria Rodriguez',
              role: 'Senior Technician',
              department: 'Maintenance',
              location: 'San Diego Plant',
              email: 'maria.rodriguez@upkeep.com',
              phone: '(619) 555-2345',
              skills: ['Mechanical', 'Welding', 'Hydraulics'],
              activeWorkOrders: 2,
              completedWorkOrders: 62,
              status: 'On Task'
            },
            {
              id: 'W003',
              name: 'David Johnson',
              role: 'Supervisor',
              department: 'Maintenance',
              location: 'Los Angeles Facility',
              email: 'david.johnson@upkeep.com',
              phone: '(213) 555-3456',
              skills: ['Management', 'Electrical', 'Mechanical'],
              activeWorkOrders: 1,
              completedWorkOrders: 38,
              status: 'Available'
            },
            {
              id: 'W004',
              name: 'Sarah Williams',
              role: 'Technician',
              department: 'Facilities',
              location: 'Anaheim Production',
              email: 'sarah.williams@upkeep.com',
              phone: '(714) 555-4567',
              skills: ['HVAC', 'Plumbing', 'General Repairs'],
              activeWorkOrders: 4,
              completedWorkOrders: 29,
              status: 'On Task'
            },
            {
              id: 'W010',
              name: 'Joe Technician',
              role: 'Technician',
              department: 'Maintenance',
              location: 'Anaheim Production',
              email: 'joe.tech@upkeep.com',
              phone: '(714) 555-9876',
              skills: ['Electrical', 'Mechanical', 'Automation'],
              activeWorkOrders: 2,
              completedWorkOrders: 41,
              status: 'Available'
            }
          ];
          
          setWorkers(mockWorkers);
          setFilteredWorkers(mockWorkers);
          
          // Check for URL parameters and apply filters
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const nameParam = urlParams.get('name');
            
            if (nameParam) {
              setNameFilter(nameParam);
              // The useEffect for applyFilters will handle the filtering
            }
          }
          
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError('Error fetching workers');
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchWorkers();
  }, []);
  
  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
  }, [nameFilter, roleFilter, locationFilter, workers]);
  
  // Apply filters to workers
  const applyFilters = () => {
    let filtered = [...workers];
    
    if (nameFilter) {
      filtered = filtered.filter(worker => 
        worker.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        worker.id.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    if (roleFilter) {
      filtered = filtered.filter(worker => 
        worker.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }
    
    if (locationFilter) {
      filtered = filtered.filter(worker => 
        worker.location.toLowerCase() === locationFilter.toLowerCase()
      );
    }
    
    setFilteredWorkers(filtered);
    setIsFiltered(nameFilter !== '' || roleFilter !== '' || locationFilter !== '');
  };
  
  // Clear all filters
  const clearFilters = () => {
    setNameFilter('');
    setRoleFilter('');
    setLocationFilter('');
    setFilteredWorkers(workers);
    setIsFiltered(false);
  };

  // Handle name filter change
  const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  // Handle location filter change
  const handleLocationFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocationFilter(e.target.value);
  };

  // Handle worker row click
  const handleWorkerClick = (worker: Worker) => {
    console.log('Worker clicked:', worker.id);
    // You can implement additional functionality here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab="workers" />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Workers</h1>
            <p className="text-gray-600">Manage and track maintenance personnel</p>
          </div>
          
          {/* Workers Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">All Workers</h2>
              
              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label htmlFor="name-filter" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      id="role-filter"
                      value={roleFilter}
                      onChange={handleRoleFilterChange}
                      className="w-full border rounded-md px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white bg-no-repeat bg-[position:right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[size:20px_20px]"
                    >
                      <option value="" className="text-gray-800">All Roles</option>
                      <option value="technician" className="text-gray-800">Technician</option>
                      <option value="senior technician" className="text-gray-800">Senior Technician</option>
                      <option value="supervisor" className="text-gray-800">Supervisor</option>
                    </select>
                  </div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      id="location-filter"
                      value={locationFilter}
                      onChange={handleLocationFilterChange}
                      className="w-full border rounded-md px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white bg-no-repeat bg-[position:right_12px_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[size:20px_20px]"
                    >
                      <option value="" className="text-gray-800">All Locations</option>
                      <option value="anaheim production" className="text-gray-800">Anaheim Production</option>
                      <option value="san diego plant" className="text-gray-800">San Diego Plant</option>
                      <option value="los angeles facility" className="text-gray-800">Los Angeles Facility</option>
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
                    Showing {filteredWorkers.length} of {workers.length} workers
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
                      <th className="py-3 px-4 text-left font-medium">Role</th>
                      <th className="py-3 px-4 text-left font-medium">Location</th>
                      <th className="py-3 px-4 text-left font-medium">Skills</th>
                      <th className="py-3 px-4 text-left font-medium">Active WOs</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredWorkers.map((worker) => (
                      <tr 
                        key={worker.id} 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleWorkerClick(worker)}
                      >
                        <td className="py-3 px-4 text-sm text-gray-800">{worker.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">{worker.name}</div>
                          <div className="text-xs text-gray-500">{worker.email}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">{worker.role}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{worker.location}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {worker.skills.slice(0, 3).map((skill, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {worker.skills.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                +{worker.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">{worker.activeWorkOrders}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            worker.status === 'Available' 
                              ? 'bg-green-100 text-green-800' 
                              : worker.status === 'On Task'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {worker.status}
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