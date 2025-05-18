import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import CalendarCell from './CalendarCell';
import { CalendarEvent } from '../../types';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  onSelectDate,
}) => {
  // Get all dates that should be displayed in the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const dateStart = startOfWeek(monthStart);
  const dateEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: dateStart, end: dateEnd });

  // Days of the week header
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-soft">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-gray-50">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-gray-500 text-sm font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((date) => (
          <CalendarCell
            key={format(date, 'yyyy-MM-dd')}
            date={date}
            currentMonth={currentDate}
            events={events}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;