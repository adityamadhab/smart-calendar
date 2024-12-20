import { format } from 'date-fns';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarDaysIcon, 
  ViewColumnsIcon 
} from '@heroicons/react/24/outline';

function CalendarHeader({ 
  currentDate, 
  onDateChange, 
  view, 
  onViewChange,
  onTodayClick 
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={onTodayClick}
          className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Today
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={() => onViewChange('month')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
              view === 'month'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <CalendarDaysIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
              view === 'week'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ViewColumnsIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => onDateChange('prev')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDateChange('next')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarHeader; 