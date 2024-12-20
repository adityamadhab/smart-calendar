import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { 
  CalendarIcon, 
  ClockIcon, 
  PencilIcon, 
  TrashIcon,
  FunnelIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

function EventsPage({ user }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    searchTerm: '',
    showPast: false
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'start',
    direction: 'asc'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents();
      setEvents(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(eventId);
        setEvents(events.filter(event => event._id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEdit = (event) => {
    navigate(`/event/edit/${event._id}`, { state: { event } });
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events];
    
    // Apply filters
    if (filters.searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(event => 
        new Date(event.start) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(event => 
        new Date(event.end) <= new Date(filters.endDate)
      );
    }

    if (!filters.showPast) {
      filtered = filtered.filter(event => 
        new Date(event.end) >= new Date()
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const aValue = new Date(a[sortConfig.key]);
      const bValue = new Date(b[sortConfig.key]);
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [events, filters, sortConfig]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Events</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your events including their title, date, time, and status.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/event/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add event
            </Link>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search events..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="showPast"
                checked={filters.showPast}
                onChange={handleFilterChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="showPast" className="ml-2 block text-sm text-gray-900">
                Show past events
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button
                            onClick={() => handleSort('title')}
                            className="flex items-center space-x-1 hover:text-gray-700"
                          >
                            <span>Title</span>
                            <ArrowsUpDownIcon className="h-4 w-4" />
                          </button>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button
                            onClick={() => handleSort('start')}
                            className="flex items-center space-x-1 hover:text-gray-700"
                          >
                            <span>Start Date</span>
                            <ArrowsUpDownIcon className="h-4 w-4" />
                          </button>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedEvents.map(event => (
                        <tr key={event._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className="h-4 w-4 rounded-full mr-2"
                                style={{ backgroundColor: event.color }}
                              />
                              <div className="text-sm font-medium text-gray-900">
                                {event.title}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {format(new Date(event.start), 'PPP')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(event.start), 'p')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(event.start), 'p')} - {format(new Date(event.end), 'p')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              new Date(event.end) < new Date()
                                ? 'bg-gray-100 text-gray-800'
                                : new Date(event.start) > new Date()
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {new Date(event.end) < new Date()
                                ? 'Past'
                                : new Date(event.start) > new Date()
                                ? 'Upcoming'
                                : 'In Progress'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(event)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(event._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage; 