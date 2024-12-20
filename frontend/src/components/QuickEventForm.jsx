import { useState } from 'react';
import { format, addHours } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { eventService } from '../services/api';

function QuickEventForm({ date, onClose, onEventCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    start: format(date, "yyyy-MM-dd'T'HH:mm"),
    end: format(addHours(date, 1), "yyyy-MM-dd'T'HH:mm"),
    color: '#2196f3'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEvent = await eventService.createEvent(formData);
      onEventCreated(newEvent);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Quick Add Event</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <input
              type="text"
              name="title"
              placeholder="Event title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start</label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End</label>
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickEventForm; 