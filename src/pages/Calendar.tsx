import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarEvent } from '../types';
import { useAuth } from '../context/AuthContext';
import { getEvents, saveEvent, updateEvent, deleteEvent } from '../services/localStorageService';
import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarGrid from '../components/calendar/CalendarGrid';
import EventDialog from '../components/calendar/EventDialog';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userEvents = getEvents(user.id);
      setEvents(userEvents);
    }
  }, [user]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSelectDate = (date: Date) => {
    const existingEvent = events.find(event => 
      isSameDay(new Date(event.date), date)
    );
    
    setSelectedDate(date);
    setSelectedEvent(existingEvent);
    setIsDialogOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (!user) return;
    
    const eventWithUser = {
      ...eventData,
      userId: user.id,
    };
    
    if (selectedEvent) {
      // Update existing event
      const updatedEvent = updateEvent({
        ...eventWithUser,
        id: selectedEvent.id,
      });
      
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      ));
    } else {
      // Create new event
      const newEvent = saveEvent(eventWithUser);
      setEvents([...events, newEvent]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Calendar
        </h1>
        <p className="text-gray-600">
          Plan your schedule and keep track of important events.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />

        <CalendarGrid
          currentDate={currentDate}
          events={events}
          onSelectDate={handleSelectDate}
        />
      </div>

      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEvent(undefined);
        }}
        date={selectedDate || new Date()}
        onSaveEvent={handleSaveEvent}
        selectedEvent={selectedEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </motion.div>
  );
};

export default Calendar;
