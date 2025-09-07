import React from 'react';

const TripDuration = ({ startDate, endDate, date, compact = false }) => {
  // Use startDate/endDate if available, otherwise fall back to single date
  const start = startDate ? new Date(startDate) : (date ? new Date(date) : null);
  const end = endDate ? new Date(endDate) : null;

  if (!start) return null;

  const calculateDuration = () => {
    if (!end) return null;
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '1 day';
    if (diffDays === 1) return '2 days';
    return `${diffDays + 1} days`;
  };

  const formatDateRange = () => {
    const formatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: start.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    };

    if (!end) {
      return start.toLocaleDateString(undefined, formatOptions);
    }

    const startStr = start.toLocaleDateString(undefined, formatOptions);
    const endStr = end.toLocaleDateString(undefined, formatOptions);
    
    // If same month and year, show "Mar 15-20, 2024"
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      const startDay = start.getDate();
      const endDay = end.getDate();
      const monthYear = start.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
      return `${monthYear.split(' ')[0]} ${startDay}-${endDay}, ${monthYear.split(' ')[1]}`;
    }
    
    return `${startStr} - ${endStr}`;
  };

  const duration = calculateDuration();
  const dateRange = formatDateRange();

  if (compact) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>📅</span>
        <span>{dateRange}</span>
        {duration && (
          <>
            <span>•</span>
            <span className="text-blue-600 font-medium">{duration}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3 border">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-800 mb-1">Trip Duration</h4>
          <p className="text-sm text-gray-600">{dateRange}</p>
        </div>
        {duration && (
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{duration.split(' ')[0]}</div>
            <div className="text-xs text-gray-500">{duration.split(' ')[1]}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for date range input
const DateRangeInput = ({ startDate, endDate, onStartDateChange, onEndDateChange, single = false }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`grid gap-3 ${single ? 'grid-cols-1' : 'grid-cols-2'}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {single ? 'Date' : 'Start Date'}
        </label>
        <input
          type="date"
          value={startDate || ''}
          onChange={(e) => onStartDateChange(e.target.value)}
          min={today}
          className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      {!single && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate || today}
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export { TripDuration, DateRangeInput };
