import React, { useState } from 'react';

const TripStatusBadge = ({ status, onStatusChange, tripId, readOnly = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const statusConfig = {
    planned: {
      label: 'Planned',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Trip is being planned'
    },
    'in-progress': {
      label: 'In Progress',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      description: 'Currently on this trip'
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-800 border-green-200',
      description: 'Trip has been completed'
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800 border-red-200',
      description: 'Trip was cancelled'
    }
  };

  const config = statusConfig[status] || statusConfig.planned;

  const handleStatusChange = (newStatus) => {
    if (onStatusChange && tripId) {
      onStatusChange(tripId, newStatus);
      setShowDropdown(false);
    }
  };

  const handleToggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  if (readOnly) {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  }

  return (
    <div className="relative">
      <button 
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${config.color}`}
        onClick={handleToggleDropdown}
        title={`Current status: ${config.description}. Click to change.`}
      >
        {config.label}
        <span className="ml-1 text-xs">▼</span>
      </button>
      
      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={handleCloseDropdown}
          />
          
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48">
            <div className="p-2">
              <div className="text-xs text-gray-500 mb-2 px-2">Change trip status:</div>
              {Object.entries(statusConfig).map(([statusKey, statusData]) => (
                <button
                  key={statusKey}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(statusKey);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center justify-between ${
                    status === statusKey ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  disabled={status === statusKey}
                >
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium">{statusData.label}</div>
                      <div className="text-xs text-gray-500">{statusData.description}</div>
                    </div>
                  </div>
                  {status === statusKey && (
                    <span className="text-blue-600 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const TripStatusFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All Trips', count: 0 },
    { key: 'planned', label: 'Planned', count: 0 },
    { key: 'in-progress', label: 'In Progress', count: 0 },
    { key: 'completed', label: 'Completed', count: 0 },
    { key: 'cancelled', label: 'Cancelled', count: 0 }
  ];

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">Filter by status:</div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentFilter === filter.key
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
            }`}
          >
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const TripStatusStats = ({ trips }) => {
  const stats = {
    total: trips.length,
    planned: trips.filter(trip => (trip.status || 'planned') === 'planned').length,
    'in-progress': trips.filter(trip => trip.status === 'in-progress').length,
    completed: trips.filter(trip => trip.status === 'completed').length,
    cancelled: trips.filter(trip => trip.status === 'cancelled').length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-lg font-bold text-gray-800">{stats.total}</div>
        <div className="text-xs text-gray-600">Total</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-blue-600">{stats.planned}</div>
        <div className="text-xs text-gray-600">Planned</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-yellow-600">{stats['in-progress']}</div>
        <div className="text-xs text-gray-600">Active</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-green-600">{stats.completed}</div>
        <div className="text-xs text-gray-600">Completed</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-red-600">{stats.cancelled}</div>
        <div className="text-xs text-gray-600">Cancelled</div>
      </div>
    </div>
  );
};

export { TripStatusBadge, TripStatusFilter, TripStatusStats };
