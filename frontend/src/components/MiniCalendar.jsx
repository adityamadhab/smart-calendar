import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function MiniCalendar({ currentDate, onDateChange }) {
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-1">
          <button
            onClick={() => onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {weekDays.map(day => (
          <div key={day} className="font-medium text-gray-500">
            {day}
          </div>
        ))}

        {days.map(day => (
          <button
            key={day.toString()}
            onClick={() => onDateChange(day)}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              !isSameMonth(day, currentDate) ? 'text-gray-400' : ''
            } ${
              isToday(day) ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''
            }`}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MiniCalendar; 