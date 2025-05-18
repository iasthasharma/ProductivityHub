import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Calendar, BookOpen, Image, Quote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDailyQuote } from '../services/localStorageService';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const quote = getDailyQuote();

  const features = [
    { 
      title: 'To-Do List', 
      icon: <CheckSquare size={24} className="text-primary-500" />, 
      description: 'Organize tasks and track your progress with our intuitive to-do list.', 
      path: '/todo' 
    },
    { 
      title: 'Calendar', 
      icon: <Calendar size={24} className="text-secondary-500" />, 
      description: 'Schedule events and manage your time efficiently with the built-in calendar.', 
      path: '/calendar' 
    },
    { 
      title: 'Journal', 
      icon: <BookOpen size={24} className="text-accent-500" />, 
      description: 'Capture your thoughts and experiences in your personal journal.', 
      path: '/journal' 
    },
    { 
      title: 'Image Gallery', 
      icon: <Image size={24} className="text-primary-500" />, 
      description: 'Store and organize your images in one convenient location.', 
      path: '/gallery' 
    },
  ];

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
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="py-8">
      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your personal productivity hub is ready to help you stay organized and focused.
            </p>
          </div>

          <div className="mb-10 bg-gradient-pastel p-6 rounded-xl shadow-soft">
            <div className="flex flex-col items-center text-center p-4">
              <Quote size={32} className="text-primary-500 mb-4" />
              <blockquote className="text-lg italic font-medium text-gray-900 mb-2">
                "{quote.text}"
              </blockquote>
              <cite className="text-sm text-gray-600">— {quote.author}</cite>
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={item}>
                <Link 
                  to={feature.path} 
                  className="card hover:scale-[1.02] transition-transform block h-full"
                >
                  <div className="flex items-start p-2">
                    <div className="mr-4">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              ProductivityHub
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Your all-in-one personal productivity suite. Stay organized, focused, and inspired.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-outline">
              Create Account
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex flex-col items-center text-center p-4">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
