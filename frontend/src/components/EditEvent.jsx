import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { eventService } from '../services/api';

function EditEvent({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    color: '#2196f3',
    reminder: false,
    reminderTime: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.event) {
      const event = location.state.event;
      setFormData({
        ...event,
        start: new Date(event.start).toISOString().slice(0, 16),
        end: new Date(event.end).toISOString().slice(0, 16),
        reminderTime: event.reminderTime ? new Date(event.reminderTime).toISOString().slice(0, 16) : ''
      });
    } else {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const event = await eventService.getEvent(id);
      setFormData({
        ...event,
        start: new Date(event.start).toISOString().slice(0, 16),
        end: new Date(event.end).toISOString().slice(0, 16),
        reminderTime: event.reminderTime ? new Date(event.reminderTime).toISOString().slice(0, 16) : ''
      });
    } catch (error) {
      setError('Error fetching event');
      console.error('Error fetching event:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventService.updateEvent(id, formData);
      navigate('/');
    } catch (error) {
      setError('Error updating event');
      console.error('Error updating event:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

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
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEvent; 