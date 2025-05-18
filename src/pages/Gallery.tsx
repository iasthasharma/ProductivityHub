import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GalleryImage } from '../types';
import { getGalleryImages, saveGalleryImage, deleteGalleryImage } from '../services/localStorageService';
import ImageUpload from '../components/gallery/ImageUpload';
import ImageCard from '../components/gallery/ImageCard';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userImages = getGalleryImages(user.id);
      // Sort by upload date, newest first
      const sortedImages = [...userImages].sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
      setImages(sortedImages);
    }
  }, [user]);

  const handleUpload = (title: string, url: string) => {
    if (!user) return;
    
    const newImage = saveGalleryImage({
      title,
      url,
      userId: user.id
    });
    
    setImages([newImage, ...images]);
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this image?');
    
    if (confirmed) {
      deleteGalleryImage(id);
      setImages(images.filter(image => image.id !== id));
    }
  };

  // Sample stock photos from Pexels
  const sampleImages = [
    {
      title: "Mountain Landscape",
      url: "https://images.pexels.com/photos/2098428/pexels-photo-2098428.jpeg"
    },
    {
      title: "Beach Sunset",
      url: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg"
    },
    {
      title: "Forest Path",
      url: "https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg"
    },
    {
      title: "City Skyline",
      url: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg"
    }
  ];

  const handleAddSampleImage = (title: string, url: string) => {
    handleUpload(title, url);
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
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Image Gallery
        </h1>
        <p className="text-gray-600">
          Store and organize your favorite images.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <motion.div variants={item} className="h-full">
          <ImageUpload onUpload={handleUpload} />
        </motion.div>

        {images.length > 0 ? (
          images.map(image => (
            <motion.div key={image.id} variants={item}>
              <ImageCard image={image} onDelete={handleDelete} />
            </motion.div>
          ))
        ) : (
          <motion.div 
            variants={item}
            className="md:col-span-2 lg:col-span-3 xl:col-span-3 bg-white rounded-xl shadow-soft p-6"
          >
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">No images yet</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first image or try one of our samples:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {sampleImages.map((sample, index) => (
                  <div 
                    key={index}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleAddSampleImage(sample.title, sample.url)}
                  >
                    <img 
                      src={sample.url} 
                      alt={sample.title} 
                      className="w-full h-36 object-cover rounded-lg mb-2" 
                    />
                    <p className="text-sm font-medium text-gray-900">{sample.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Gallery;
