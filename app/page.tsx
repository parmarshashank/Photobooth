'use client';
import { useState } from 'react';
import Camera from './components/Camera';
import PhotoStrip from './components/PhotoStrip';

export default function PhotoBooth() {
  const [images, setImages] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const captureSequence = async () => {
    setImages([]);
    
    for (let i = 0; i < 3; i++) {
      for (let timer = 3; timer > 0; timer--) {
        setCountdown(timer);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setCountdown(null);
      setFlash(true);
      await new Promise((resolve) => setTimeout(resolve, 150));
      setFlash(false);
      
      if (i < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
    setShowPreview(true); 
  };

  const handleCapture = (imageData: string) => {
    setImages((prev) => [...prev, imageData]);
  };

  const resetPhotos = () => {
    setImages([]);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-6 relative">
      {flash && (
        <div className="fixed inset-0 bg-white animate-flash z-50"></div>
      )}
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="relative flex justify-center mb-8">
          <div className="relative -rotate-2 inline-block">
            <div className="absolute inset-0 bg-zinc-800 opacity-80 rounded"></div>
            <div className="absolute inset-0 bg-[url('/grain-pattern.png')] opacity-30 mix-blend-overlay rounded"></div>
            <h1 className="relative text-2xl md:text-4xl font-bold text-center py-2 px-6 text-gray-200 font-playfair">
              Photo Booth
            </h1>
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-zinc-500"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-zinc-500"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-zinc-500"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-zinc-500"></div>
          </div>
        </div>
        
        {!showPreview ? (
          <div className="space-y-4">
            <div className="bg-zinc-800 p-3 border border-zinc-700 max-w-sm mx-auto">
              <h2 className="text-lg font-special-elite text-gray-200 mb-3 text-center">
                Get readyyyyy
              </h2>
              <Camera onCapture={handleCapture} countdown={countdown} />
              <div className="text-center mt-3">
                <button
                  onClick={captureSequence}
                  disabled={countdown !== null}
                  className="px-4 py-1.5 bg-gray-200 text-gray-900 text-sm font-special-elite
                         hover:bg-gray-300 transition-colors border border-gray-400
                         disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Take Photos
                </button>
              </div>
            </div>

            {images.length > 0 && (
              <div className="bg-zinc-800 p-2 border border-zinc-700">
                <div className="grid grid-cols-3 gap-1 max-w-[240px] mx-auto">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="aspect-[3/4] border border-zinc-600">
                      {images[index] ? (
                        <img 
                          src={images[index]} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                          <span className="text-gray-500 text-xs font-special-elite">{index + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <PhotoStrip images={images} onReset={resetPhotos} />
        )}
      </div>
    </div>
  );
}