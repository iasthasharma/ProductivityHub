import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { GalleryImage } from '../../types';

interface ImageCardProps {
  image: GalleryImage;
  onDelete: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(image.id);
  };

  const toggleView = () => {
    setIsViewing(!isViewing);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-soft overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleView}
      >
        <div className="aspect-w-1 aspect-h-1 group">
          <img 
            src={image.url} 
            alt={image.title} 
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
            }}
          />
          
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-white bg-primary-500 hover:bg-primary-600 rounded-full p-2">
                <ExternalLink size={20} />
              </button>
            </div>
          )}
        </div>
        
        <div className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 truncate">{image.title}</h3>
              <p className="text-xs text-gray-500">
                {format(new Date(image.uploadDate), 'MMM d, yyyy')}
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600 transition-colors duration-200 p-1"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      </motion.div>
      
      {isViewing && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50" onClick={toggleView}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={image.url} 
                alt={image.title} 
                className="max-h-[80vh] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                }}
              />
              
              <button 
                onClick={toggleView}
                className="absolute top-4 right-4 bg-black bg-opacity-70 text-white rounded-full p-2 hover:bg-opacity-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mt-4 bg-white p-4 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 mb-1">{image.title}</h3>
              <p className="text-sm text-gray-500">
                Added on {format(new Date(image.uploadDate), 'MMMM d, yyyy')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

// Import necessary icon
import { X } from 'lucide-react';

export default ImageCard;