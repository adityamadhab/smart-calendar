import { Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { ClockIcon, BellIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function DraggableEvent({ event, index, onClick }) {
  const getEventTimeString = () => {
    return format(new Date(event.start), 'h:mm a');
  };

  const getEventDuration = () => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours < 24 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '';
  };

  return (
    <Draggable draggableId={event._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(event)}
          className={`text-sm mb-1 p-2 rounded cursor-pointer transition-all ${
            snapshot.isDragging
              ? 'shadow-lg scale-105'
              : 'hover:shadow-md hover:scale-102'
          }`}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: event.color,
            color: getContrastColor(event.color),
            borderLeft: `4px solid ${adjustColor(event.color, -20)}`
          }}
        >
          <div className="flex flex-col">
            <div className="font-medium truncate">{event.title}</div>
            <div className="flex items-center text-xs mt-1 space-x-2 opacity-90">
              <div className="flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                {getEventTimeString()}
                {getEventDuration() && (
                  <span className="ml-1">({getEventDuration()})</span>
                )}
              </div>
              {event.reminder && (
                <div className="flex items-center">
                  <BellIcon className="h-3 w-3" />
                </div>
              )}
              {event.isRecurring && (
                <div className="flex items-center">
                  <ArrowPathIcon className="h-3 w-3" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

// Helper function to determine text color based on background color
function getContrastColor(hexcolor) {
  // Convert hex to RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  const clamp = (num) => Math.min(Math.max(num, 0), 255);
  
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const adjustedR = clamp(r + amount);
  const adjustedG = clamp(g + amount);
  const adjustedB = clamp(b + amount);

  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
}

export default DraggableEvent; 