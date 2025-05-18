import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, List, CheckSquare } from 'lucide-react';
import { Todo } from '../types';
import { getTodos, saveTodo, updateTodo, deleteTodo } from '../services/localStorageService';
import { useAuth } from '../context/AuthContext';
import TodoItem from '../components/todo/TodoItem';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const loadedTodos = getTodos(user.id);
      setTodos(loadedTodos);
    }
  }, [user]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTodoTitle.trim() && user) {
      const newTodo = saveTodo({
        title: newTodoTitle.trim(),
        completed: false,
        userId: user.id
      });
      
      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
    }
  };

  const handleToggleTodo = (id: string) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    
    if (todoToUpdate) {
      const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
      updateTodo(updatedTodo);
      
      setTodos(
        todos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
    }
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTodo = (id: string, title: string) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    
    if (todoToUpdate) {
      const updatedTodo = { ...todoToUpdate, title };
      updateTodo(updatedTodo);
      
      setTodos(
        todos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          To-Do List
        </h1>
        <p className="text-gray-600">
          Keep track of your tasks and stay organized.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="input flex-grow"
            autoFocus
          />
          <button
            type="submit"
            disabled={!newTodoTitle.trim()}
            className="btn btn-primary flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <List size={20} />
            <span>Tasks</span>
          </h2>
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === 'active'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === 'completed'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {filteredTodos.length > 0 ? (
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-4"
          >
            <AnimatePresence>
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                />
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="text-center py-10 text-gray-500 flex flex-col items-center">
            <CheckSquare size={32} className="mb-2 opacity-50" />
            <p>No {filter !== 'all' ? filter : ''} tasks found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TodoList;
