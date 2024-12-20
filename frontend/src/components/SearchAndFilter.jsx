import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

function SearchAndFilter({ onSearch, onFilter }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    reminder: 'all', // 'all', 'with', 'without'
  });

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={handleSearchChange}
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`px-4 py-2 rounded-md border flex items-center gap-2 ${
            isFilterOpen ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300'
          }`}
        >
          <FunnelIcon className="h-5 w-5" />
          Filters
        </button>
      </div>

      {isFilterOpen && (
        <div className="p-4 bg-white rounded-md border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reminders
            </label>
            <select
              value={filters.reminder}
              onChange={(e) => handleFilterChange('reminder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Events</option>
              <option value="with">With Reminders</option>
              <option value="without">Without Reminders</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchAndFilter; 