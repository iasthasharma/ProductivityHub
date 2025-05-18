import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash, Edit, Save, X } from 'lucide-react';
import { Todo } from '../../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTitle.trim()) {
      onEdit(todo.id, editedTitle);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-lg shadow-soft p-4 mb-3 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <button
            onClick={handleToggle}
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors duration-200 mr-3 ${
              todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-primary-500'
            }`}
          >
            {todo.completed && <Check size={14} />}
          </button>

          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 input py-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
          ) : (
            <span
              className={`flex-1 transition-all duration-200 ${
                todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
              }`}
            >
              {todo.title}
            </span>
          )}
        </div>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-green-500 hover:text-green-600 transition-colors duration-200"
              >
                <Save size={18} />
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-600 transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                <Trash size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.li>
  );
};

export default TodoItem;