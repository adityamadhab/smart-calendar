import { useState } from 'react';

function RecurrenceOptions({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field, newValue) => {
    onChange({
      ...value,
      [field]: newValue
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isRecurring"
          checked={value.isRecurring}
          onChange={(e) => {
            handleChange('isRecurring', e.target.checked);
            setIsOpen(e.target.checked);
          }}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">
          Recurring Event
        </label>
      </div>

      {isOpen && (
        <div className="pl-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select
              value={value.frequency}
              onChange={(e) => handleChange('frequency', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Interval
            </label>
            <input
              type="number"
              min="1"
              value={value.interval}
              onChange={(e) => handleChange('interval', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={value.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {value.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days of Week
              </label>
              <div className="flex gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const daysOfWeek = value.daysOfWeek || [];
                      const newDays = daysOfWeek.includes(index)
                        ? daysOfWeek.filter(d => d !== index)
                        : [...daysOfWeek, index];
                      handleChange('daysOfWeek', newDays);
                    }}
                    className={`px-2 py-1 rounded-full text-sm ${
                      value.daysOfWeek?.includes(index)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecurrenceOptions; 