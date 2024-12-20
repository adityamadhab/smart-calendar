import { format, addHours, startOfDay, eachHourOfInterval } from 'date-fns';
import { Droppable } from 'react-beautiful-dnd';
import DraggableEvent from './DraggableEvent';
import { useEffect, useState } from 'react';

function WeekView({ days, events, onEventClick, onAddEvent }) {
  const hours = eachHourOfInterval({
    start: startOfDay(new Date()),
    end: addHours(startOfDay(new Date()), 23)
  });

  const [currentTimeIndicator, setCurrentTimeIndicator] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeIndicator(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getEventsForDayAndHour = (day, hour) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
             eventDate.getHours() === hour.getHours();
    });
  };

  const isCurrentHour = (day, hour) => {
    const now = currentTimeIndicator;
    return format(day, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd') &&
           hour.getHours() === now.getHours();
  };

  const getCurrentTimePosition = () => {
    const now = currentTimeIndicator;
    const minutes = now.getMinutes();
    return (minutes / 60) * 100;
  };

  return (
    <div className="flex flex-col h-[800px] overflow-auto">
      <div className="sticky top-0 z-10 flex bg-white">
        <div className="w-20 bg-white" />
        {days.map(day => (
          <div
            key={day.toString()}
            className={`flex-1 border-l border-gray-200 text-center py-2 ${
              format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                ? 'bg-indigo-50'
                : ''
            }`}
          >
            <div className="text-sm font-semibold text-gray-900">
              {format(day, 'EEE')}
            </div>
            <div className="text-sm text-gray-500">
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-1">
        <div className="w-20 flex flex-col border-r border-gray-200">
          {hours.map(hour => (
            <div
              key={hour.toString()}
              className="flex items-center justify-end pr-2 h-20 -mt-2.5 text-right text-xs text-gray-500"
            >
              {format(hour, 'h a')}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7">
          {days.map(day => (
            <div key={day.toString()} className="border-l border-gray-200">
              {hours.map(hour => {
                const dateStr = `${format(day, 'yyyy-MM-dd')}-${format(hour, 'HH')}`;
                return (
                  <Droppable droppableId={dateStr} key={dateStr}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`h-20 border-b border-gray-200 relative group hover:bg-gray-50 ${
                          snapshot.isDraggingOver ? 'bg-blue-50' : ''
                        } ${
                          isCurrentHour(day, hour) ? 'bg-yellow-50' : ''
                        }`}
                        onClick={() => {
                          const date = new Date(day);
                          date.setHours(hour.getHours());
                          onAddEvent(date);
                        }}
                      >
                        {isCurrentHour(day, hour) && (
                          <div 
                            className="absolute left-0 right-0 border-t-2 border-red-400 z-10"
                            style={{ top: `${getCurrentTimePosition()}%` }}
                          >
                            <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-400" />
                          </div>
                        )}
                        {getEventsForDayAndHour(day, hour).map((event, index) => (
                          <DraggableEvent
                            key={event._id}
                            event={event}
                            index={index}
                            onClick={onEventClick}
                          />
                        ))}
                        {provided.placeholder}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              const date = new Date(day);
                              date.setHours(hour.getHours());
                              onAddEvent(date);
                            }}
                            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 bg-white rounded-md shadow-sm border border-gray-200"
                          >
                            Add event
                          </button>
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeekView; 