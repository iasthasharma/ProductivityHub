import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (title: string, url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageTitle, setImageTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setImageTitle('');
    setImageUrl('');
    
    // Focus the title input when modal opens
    if (!isOpen) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageTitle.trim() && imageUrl.trim()) {
      onUpload(imageTitle.trim(), imageUrl.trim());
      setIsOpen(false);
      setImageTitle('');
      setImageUrl('');
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleToggle}
        className="bg-white rounded-xl shadow-soft p-6 border-2 border-dashed border-gray-300 text-center w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-primary-500 hover:border-primary-300 transition-colors cursor-pointer"
      >
        <Upload size={24} className="mb-2" />
        <span className="font-medium">Add Image</span>
      </motion.button>

      {isOpen && (
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
                Add Image
              </h3>
              <button 
                onClick={handleToggle}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="imageTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Image Title
                </label>
                <input
                  type="text"
                  id="imageTitle"
                  ref={titleInputRef}
                  placeholder="Enter image title"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  className="input"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="input"
                />
              </div>
              
              {imageUrl && (
                <div className="mb-4 p-2 border rounded-lg bg-gray-50">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={handleToggle}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-1"
                  disabled={!imageTitle.trim() || !imageUrl.trim()}
                >
                  <ImageIcon size={18} />
                  <span>Add Image</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;