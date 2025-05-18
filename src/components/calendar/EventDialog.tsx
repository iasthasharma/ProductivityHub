import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { CalendarEvent } from '../../types';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  onSaveEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  selectedEvent?: CalendarEvent;
  onDeleteEvent?: (id: string) => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onClose,
  date,
  onSaveEvent,
  selectedEvent,
  onDeleteEvent,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
    } else {
      setTitle('');
    }
  }, [selectedEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      onSaveEvent({
        title: title.trim(),
        date: date.toISOString(),
        userId: selectedEvent?.userId || '',
      });
      
      onClose();
    }
  };

  const handleDelete = () => {
    if (selectedEvent && onDeleteEvent) {
      onDeleteEvent(selectedEvent.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {selectedEvent ? 'Edit Event' : 'Add New Event'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              id="eventTitle"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              autoFocus
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="input flex items-center">
              <Calendar size={18} className="text-gray-500 mr-2" />
              <span>{format(date, 'MMMM d, yyyy')}</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            {selectedEvent && onDeleteEvent && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim()}
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EventDialog;