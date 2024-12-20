import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, addWeeks, addMonths, startOfDay } from 'date-fns';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { eventService } from '../services/api';
import EventModal from './EventModal';
import DraggableEvent from './DraggableEvent';
import SearchAndFilter from './SearchAndFilter';
import QuickEventForm from './QuickEventForm';
import { useNavigate } from 'react-router-dom';
import CalendarHeader from './CalendarHeader';
import WeekView from './WeekView';

function Calendar({ user, currentDate: propCurrentDate, onDateChange }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(propCurrentDate);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickEventDate, setQuickEventDate] = useState(null);
  const [view, setView] = useState('month');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEvents();
  }, [user, currentDate]);

  useEffect(() => {
    setCurrentDate(propCurrentDate);
  }, [propCurrentDate]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

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

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterEvents(term);
  };

  const handleFilter = (filters) => {
    let filtered = [...events];

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(
        event => new Date(event.start) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        event => new Date(event.end) <= new Date(filters.endDate)
      );
    }

    // Filter by reminder status
    if (filters.reminder !== 'all') {
      filtered = filtered.filter(
        event => (filters.reminder === 'with') === event.reminder
      );
    }

    // Apply search term if exists
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const filterEvents = (term) => {
    if (!term) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(term.toLowerCase()) ||
      event.description?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const getEventsForDay = (date) => {
    if (!Array.isArray(filteredEvents)) return [];
    return filteredEvents.filter(event => 
      format(new Date(event.start), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleEventDelete = async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter(event => event._id !== eventId));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEventEdit = (event) => {
    navigate(`/event/edit/${event._id}`, { state: { event } });
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const event = events.find(e => e._id === draggableId);
    const targetDate = parseISO(destination.droppableId);

    // Calculate time difference between target date and event's current date
    const currentDate = new Date(event.start);
    const timeDiff = targetDate.getTime() - currentDate.setHours(0, 0, 0, 0);

    // Update event dates
    const newStart = new Date(event.start.getTime() + timeDiff);
    const newEnd = new Date(event.end.getTime() + timeDiff);

    try {
      const updatedEvent = await eventService.updateEvent(event._id, {
        ...event,
        start: newStart.toISOString(),
        end: newEnd.toISOString()
      });

      setEvents(events.map(e => 
        e._id === updatedEvent._id ? updatedEvent : e
      ));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const handleAddEvent = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm");
    navigate('/event/new', { 
      state: { 
        initialDate: formattedDate,
        endDate: format(addDays(date, 1), "yyyy-MM-dd'T'HH:mm")
      } 
    });
  };

  const handleQuickAdd = (date) => {
    setQuickEventDate(date);
  };

  const handleQuickEventCreated = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleDateNavigation = (direction) => {
    const newDate = direction === 'prev'
      ? view === 'month' ? addMonths(currentDate, -1) : addWeeks(currentDate, -1)
      : view === 'month' ? addMonths(currentDate, 1) : addWeeks(currentDate, 1);
    handleDateChange(newDate);
  };

  const handleTodayClick = () => {
    handleDateChange(startOfDay(new Date()));
  };

  return (
    <>
      <SearchAndFilter onSearch={handleSearch} onFilter={handleFilter} />
      <div className="bg-white rounded-lg shadow">
        <CalendarHeader
          currentDate={currentDate}
          onDateChange={handleDateNavigation}
          view={view}
          onViewChange={handleViewChange}
          onTodayClick={handleTodayClick}
        />

        {loading ? (
          <div className="min-h-[500px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading events...</p>
            </div>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            {view === 'month' ? (
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {weekDays.map(day => (
                  <div key={day} className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-900">
                    {day}
                  </div>
                ))}

                {days.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isCurrentMonth = format(currentDate, 'MM') === format(day, 'MM');
                  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                  return (
                    <Droppable 
                      droppableId={dateStr} 
                      key={dateStr}
                      type="event"
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[120px] bg-white p-2 relative group transition-colors ${
                            !isCurrentMonth ? 'bg-gray-50 text-gray-500' : ''
                          } ${snapshot.isDraggingOver ? 'bg-blue-50' : ''} ${
                            isToday ? 'ring-2 ring-indigo-600 ring-inset' : ''
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <time 
                              dateTime={dateStr} 
                              className={`text-sm font-semibold ${
                                format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                                  ? 'bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                                  : ''
                              }`}
                            >
                              {format(day, 'd')}
                            </time>
                            <button
                              onClick={() => handleAddEvent(day)}
                              className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <PlusIcon className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                          <div className="mt-2 space-y-1">
                            {dayEvents.map((event, index) => (
                              <DraggableEvent
                                key={event._id}
                                event={event}
                                index={index}
                                onClick={handleEventClick}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                          {dayEvents.length === 0 && !isCurrentMonth && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleAddEvent(day)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <CalendarIcon className="h-6 w-6" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            ) : (
              <WeekView
                days={eachDayOfInterval({
                  start: startOfWeek(currentDate),
                  end: addDays(startOfWeek(currentDate), 6)
                })}
                events={filteredEvents}
                onEventClick={handleEventClick}
                onAddEvent={handleAddEvent}
              />
            )}
          </DragDropContext>
        )}
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleEventDelete}
        onEdit={handleEventEdit}
      />

      {quickEventDate && (
        <QuickEventForm
          date={quickEventDate}
          onClose={() => setQuickEventDate(null)}
          onEventCreated={handleQuickEventCreated}
        />
      )}
    </>
  );
}

export default Calendar; 