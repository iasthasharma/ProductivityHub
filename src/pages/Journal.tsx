import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { BookOpen, Edit, Save, Trash, X, Plus } from 'lucide-react';
import { JournalEntry } from '../types';
import { useAuth } from '../context/AuthContext';
import { getJournalEntries, saveJournalEntry, updateJournalEntry, deleteJournalEntry } from '../services/localStorageService';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntryMode, setNewEntryMode] = useState(false);
  const [newEntryContent, setNewEntryContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userEntries = getJournalEntries(user.id);
      // Sort entries by date, newest first
      const sortedEntries = [...userEntries].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEntries(sortedEntries);
    }
  }, [user]);

  const handleAddEntry = () => {
    if (!newEntryContent.trim() || !user) return;
    
    const newEntry = saveJournalEntry({
      content: newEntryContent,
      date: new Date().toISOString(),
      userId: user.id
    });
    
    setEntries([newEntry, ...entries]);
    setNewEntryContent('');
    setNewEntryMode(false);
  };

  const handleStartEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEditContent(entry.content);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editContent.trim()) return;
    
    const entryToUpdate = entries.find(entry => entry.id === editingId);
    
    if (entryToUpdate) {
      const updatedEntry = updateJournalEntry({
        ...entryToUpdate,
        content: editContent
      });
      
      setEntries(
        entries.map(entry => (entry.id === editingId ? updatedEntry : entry))
      );
      
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteEntry = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this journal entry?');
    
    if (confirmed) {
      deleteJournalEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Journal
        </h1>
        <p className="text-gray-600">
          Capture your thoughts, ideas, and experiences.
        </p>
      </div>

      {newEntryMode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-soft p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={20} />
            <span>New Journal Entry</span>
          </h2>
          
          <textarea
            value={newEntryContent}
            onChange={(e) => setNewEntryContent(e.target.value)}
            placeholder="What's on your mind today?"
            className="input min-h-32 mb-4"
            autoFocus
          />
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setNewEntryMode(false)}
              className="btn btn-outline flex items-center gap-1"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleAddEntry}
              disabled={!newEntryContent.trim()}
              className="btn btn-primary flex items-center gap-1"
            >
              <Save size={18} />
              <span>Save</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl shadow-soft p-6 mb-6 border-2 border-dashed border-gray-300 text-center cursor-pointer"
          onClick={() => setNewEntryMode(true)}
        >
          <div className="flex flex-col items-center text-gray-500">
            <Plus size={24} className="mb-2" />
            <span className="font-medium">Write New Entry</span>
          </div>
        </motion.div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <AnimatePresence>
          {entries.length > 0 ? (
            entries.map(entry => (
              <motion.div
                key={entry.id}
                variants={item}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    {format(new Date(entry.date), 'MMMM d, yyyy - h:mm a')}
                  </h3>
                  <div className="flex space-x-2">
                    {editingId !== entry.id ? (
                      <>
                        <button
                          onClick={() => handleStartEdit(entry)}
                          className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-500 hover:text-green-600 transition-colors duration-200"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-600 transition-colors duration-200"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {editingId === entry.id ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="input min-h-24 w-full"
                    autoFocus
                  />
                ) : (
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {entry.content}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              className="bg-white rounded-xl shadow-soft p-10 text-center"
              variants={item}
            >
              <BookOpen size={40} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No journal entries yet</h3>
              <p className="text-gray-500">Start writing your thoughts and experiences.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Journal;
