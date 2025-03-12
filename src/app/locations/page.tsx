'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: string;
  assetCount: number;
  workOrderCount: number;
  status: string;
}

export default function LocationsPage() {
  // State for locations
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  
  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with mock data
        setTimeout(() => {
          const mockLocations: Location[] = [
            {
              id: 'LOC001',
              name: 'Anaheim Production',
              address: '123 Industrial Way',
              city: 'Anaheim',
              state: 'CA',
              zipCode: '92801',
              type: 'Manufacturing',
              assetCount: 45,
              workOrderCount: 12,
              status: 'Active'
            },
            {
              id: 'LOC002',
              name: 'San Diego Plant',
              address: '456 Tech Blvd',
              city: 'San Diego',
              state: 'CA',
              zipCode: '92101',
              type: 'Manufacturing',
              assetCount: 32,
              workOrderCount: 8,
              status: 'Active'
            },
            {
              id: 'LOC003',
              name: 'Los Angeles Facility',
              address: '789 Commerce St',
              city: 'Los Angeles',
              state: 'CA',
              zipCode: '90001',
              type: 'Warehouse',
              assetCount: 28,
              workOrderCount: 5,
              status: 'Active'
            },
            {
              id: 'LOC004',
              name: 'Sacramento Office',
              address: '101 Capitol Ave',
              city: 'Sacramento',
              state: 'CA',
              zipCode: '95814',
              type: 'Office',
              assetCount: 15,
              workOrderCount: 3,
              status: 'Active'
            },
            {
              id: 'LOC005',
              name: 'Oakland Distribution Center',
              address: '202 Port Way',
              city: 'Oakland',
              state: 'CA',
              zipCode: '94607',
              type: 'Distribution',
              assetCount: 38,
              workOrderCount: 9,
              status: 'Maintenance'
            }
          ];
          
          setLocations(mockLocations);
          setFilteredLocations(mockLocations);
          
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
        setError('Error fetching locations');
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);
  
  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
  }, [nameFilter, typeFilter, statusFilter, locations]);
  
  // Apply filters to locations
  const applyFilters = () => {
    let filtered = [...locations];
    
    if (nameFilter) {
      filtered = filtered.filter(loc => 
        loc.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    if (typeFilter) {
      filtered = filtered.filter(loc => 
        loc.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(loc => 
        loc.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    setFilteredLocations(filtered);
    setIsFiltered(nameFilter !== '' || typeFilter !== '' || statusFilter !== '');
  };
  
  // Clear all filters
  const clearFilters = () => {
    setNameFilter('');
    setTypeFilter('');
    setStatusFilter('');
    setFilteredLocations(locations);
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

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // Handle location row click
  const handleLocationClick = (location: Location) => {
    console.log('Location clicked:', location.id);
    // You can implement additional functionality here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab="locations" />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Locations</h1>
            <p className="text-gray-600">Manage and track facility locations</p>
          </div>
          
          {/* Locations Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">All Locations</h2>
              
              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label htmlFor="name-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Location Name
                    </label>
                    <input
                      id="name-filter"
                      type="text"
                      value={nameFilter}
                      onChange={handleNameFilterChange}
                      placeholder="Filter by name..."
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      id="type-filter"
                      value={typeFilter}
                      onChange={handleTypeFilterChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    >
                      <option value="" className="text-gray-800">All Types</option>
                      <option value="manufacturing" className="text-gray-800">Manufacturing</option>
                      <option value="warehouse" className="text-gray-800">Warehouse</option>
                      <option value="office" className="text-gray-800">Office</option>
                      <option value="distribution" className="text-gray-800">Distribution</option>
                    </select>
                  </div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    >
                      <option value="" className="text-gray-800">All Statuses</option>
                      <option value="active" className="text-gray-800">Active</option>
                      <option value="maintenance" className="text-gray-800">Maintenance</option>
                      <option value="inactive" className="text-gray-800">Inactive</option>
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
                    Showing {filteredLocations.length} of {locations.length} locations
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
                      <th className="py-3 px-4 text-left font-medium">Address</th>
                      <th className="py-3 px-4 text-left font-medium">Type</th>
                      <th className="py-3 px-4 text-left font-medium">Assets</th>
                      <th className="py-3 px-4 text-left font-medium">Work Orders</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLocations.map((location) => (
                      <tr 
                        key={location.id} 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleLocationClick(location)}
                      >
                        <td className="py-3 px-4 text-sm text-gray-800">{location.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">{location.name}</div>
                          <div className="text-xs text-gray-500">{location.city}, {location.state}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">{location.address}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{location.type}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{location.assetCount}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{location.workOrderCount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            location.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : location.status === 'Maintenance'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {location.status}
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