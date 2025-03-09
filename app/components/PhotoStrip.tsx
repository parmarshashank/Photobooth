'use client';
import { useState } from 'react';

interface PhotoStripProps {
  images: string[];
  onReset: () => void;
}

export default function PhotoStrip({ images, onReset }: PhotoStripProps) {
  const [downloading, setDownloading] = useState(false);

  const downloadPhotoStrip = async () => {
    if (images.length !== 3) return;
    setDownloading(true);

    const stripCanvas = document.createElement('canvas');
    const ctx = stripCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const photoWidth = 640;
    const photoHeight = 480;
    const padding = 40; 
    const borderWidth = 20; 
    
    stripCanvas.width = photoWidth + (borderWidth * 2);
    stripCanvas.height = (photoHeight * 3) + (padding * 2) + (borderWidth * 2);

    try {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

      const loadedImages = await Promise.all(
        images.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.src = src;
            })
        )
      );
      loadedImages.forEach((img, index) => {
        const y = (index * (photoHeight + padding)) + borderWidth;
        ctx.drawImage(img, borderWidth, y, photoWidth, photoHeight);
      });

      const link = document.createElement('a');
      link.download = 'vintage-photo-strip.jpg';
      link.href = stripCanvas.toDataURL('image/jpeg', 0.92);
      link.click();
    } catch (error) {
      console.error('Error creating photo strip:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-zinc-800 p-6 border border-zinc-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-200 font-playfair">
        Your Vintage Photos
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <div className="absolute inset-0 border border-gray-700 pointer-events-none"></div>
            <img
              src={img}
              className="w-full aspect-[3/4] object-cover"
              alt={`Photo ${index + 1}`}
            />
            <a
              href={img}
              download={`vintage-photo-${index + 1}.jpg`}
              className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 
                       group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span className="text-gray-200 font-special-elite px-4 py-2 border border-gray-400">
                Download
              </span>
            </a>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={downloadPhotoStrip}
          disabled={downloading || images.length !== 3}
          className="px-4 py-2 bg-gray-200 text-gray-900 font-special-elite
                   hover:bg-gray-300 transition-colors border-2 border-gray-400
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? 'Creating...' : 'Download Strip'}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-zinc-700 text-gray-200 font-special-elite
                   hover:bg-zinc-600 transition-colors border-2 border-zinc-600"
        >
          Retake Photos
        </button>
      </div>
    </div>
  );
} 