import React from 'react';
import { format, isSameMonth, isToday, isSameDay } from 'date-fns';
import { CalendarEvent } from '../../types';

interface CalendarCellProps {
  date: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
}

const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  currentMonth,
  events,
  onSelectDate,
}) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isCurrentDate = isToday(date);
  const dayEvents = events.filter((event) =>
    isSameDay(new Date(event.date), date)
  );

  return (
    <div
      className={`min-h-24 border border-gray-200 p-1 ${
        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
      }`}
      onClick={() => onSelectDate(date)}
    >
      <div className="flex justify-between items-start">
        <span
          className={`text-sm leading-loose h-6 w-6 flex items-center justify-center rounded-full ${
            isCurrentDate
              ? 'bg-primary-500 text-white font-medium'
              : isCurrentMonth
              ? 'text-gray-900'
              : 'text-gray-400'
          }`}
        >
          {format(date, 'd')}
        </span>
      </div>
      <div className="mt-1 text-xs space-y-1">
        {dayEvents.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className="bg-primary-100 text-primary-800 px-2 py-1 rounded truncate"
          >
            {event.title}
          </div>
        ))}
        {dayEvents.length > 3 && (
          <div className="text-xs text-gray-500 text-right">
            +{dayEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarCell;