'use client';

import { useState } from 'react';
import CameraFrame from './components/CameraFrame';
import FilterSelector from './components/FilterSelector';
import PreviewStrip from './components/PreviewStrip';
import { motion } from 'framer-motion';

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('normal');

  const handlePhotoCapture = (photoData: string) => {
    setPhotos((prev) => {
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, photoData];
    });
  };

  const getFilterClass = () => {
    const filters = {
      normal: '',
      vintage: 'sepia brightness-90',
      bw: 'grayscale',
      soft: 'brightness-105 contrast-95 saturate-95',
      warm: 'brightness-105 saturate-110',
      cool: 'brightness-100 saturate-90 hue-rotate-15',
    };
    return filters[selectedFilter as keyof typeof filters];
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-pink-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ✨ Photobooth ✨
          </h1>
          <p className="text-gray-600">
            Take three photos to create your perfect photo strip!
          </p>
        </div>

        <div className="relative">
          <CameraFrame 
            onPhotoCapture={handlePhotoCapture} 
            photosCount={photos.length}
          />
          
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2 text-center">
              Choose a Filter
            </h2>
            <FilterSelector
              selectedFilter={selectedFilter}
              onFilterSelect={setSelectedFilter}
            />
          </div>
        </div>

        {photos.length > 0 && (
          <PreviewStrip photos={photos} filterClass={getFilterClass()} />
        )}

        {photos.length === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4"
          >
            <button
              onClick={() => setPhotos([])}
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
