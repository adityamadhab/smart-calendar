import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, BellIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function EventDetails({ event }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div 
          className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: event.color }}
        />
        <div>
          <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
          {event.description && (
            <p className="mt-1 text-sm text-gray-500">{event.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
          <span>{format(new Date(event.start), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
          <span>
            {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
          </span>
        </div>

        {event.reminder && (
          <div className="flex items-center text-sm text-gray-600">
            <BellIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span>Reminder at {format(new Date(event.reminderTime), 'PPp')}</span>
          </div>
        )}

        {event.isRecurring && (
          <div className="flex items-center text-sm text-gray-600">
            <ArrowPathIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span>
              Repeats {event.recurrence.frequency}
              {event.recurrence.interval > 1 ? ` every ${event.recurrence.interval} ${event.recurrence.frequency}s` : ''}
              {event.recurrence.endDate ? ` until ${format(new Date(event.recurrence.endDate), 'PP')}` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails; 