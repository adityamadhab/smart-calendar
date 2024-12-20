import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { eventService } from '../services/api';
import RecurrenceOptions from './RecurrenceOptions';
import { format } from 'date-fns';

function EventForm({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDate = location.state?.initialDate || '';
  const initialEndDate = location.state?.endDate || '';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: initialDate,
    end: initialEndDate,
    color: '#2196f3',
    reminder: false,
    reminderTime: '',
    isRecurring: false,
    recurrence: {
      frequency: 'daily',
      interval: 1,
      endDate: '',
      daysOfWeek: []
    }
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.isRecurring && !formData.recurrence.endDate) {
      setError('End date is required for recurring events');
      return;
    }

    try {
      await eventService.createEvent(formData);
      navigate('/');
    } catch (error) {
      setError('Error creating event');
      console.error('Error creating event:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRecurrenceChange = (recurrenceData) => {
    setFormData(prev => ({
      ...prev,
      isRecurring: recurrenceData.isRecurring,
      recurrence: {
        frequency: recurrenceData.frequency || 'daily',
        interval: recurrenceData.interval || 1,
        endDate: recurrenceData.endDate || '',
        daysOfWeek: recurrenceData.daysOfWeek || []
      }
    }));
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Create New Event</h2>
        <p className="text-sm text-gray-600 mt-1">
          {initialDate ? format(new Date(initialDate), 'MMMM d, yyyy') : 'Select date and time'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-8 w-14 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                Event color
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="reminder"
            checked={formData.reminder}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 block text-sm text-gray-900">Set Reminder</label>
        </div>

        {formData.reminder && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Reminder Time</label>
            <input
              type="datetime-local"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        )}

        <div className="mt-6">
          <RecurrenceOptions
            value={{
              isRecurring: formData.isRecurring,
              ...formData.recurrence
            }}
            onChange={handleRecurrenceChange}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm; 