'use client';

import { motion } from 'framer-motion';
import { ArrowDownTrayIcon, SwatchIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface PreviewStripProps {
  photos: string[];
  filterClass: string;
}

const stripColors = [
  { name: 'White', bg: '#ffffff', text: '#4a4a4a' },
  { name: 'Beige', bg: '#f5f5dc', text: '#6b5b4c' },
  { name: 'Soft Pink', bg: '#fce7f3', text: '#831843' },
  { name: 'Lavender', bg: '#ede9fe', text: '#5b21b6' },
  { name: 'Mint', bg: '#ecfdf5', text: '#065f46' },
  { name: 'Sky', bg: '#e0f2fe', text: '#075985' },
];

export default function PreviewStrip({ photos, filterClass }: PreviewStripProps) {
  const [selectedColor, setSelectedColor] = useState(stripColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const downloadStrip = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate dimensions that maintain aspect ratio
    const targetWidth = 800;
    const aspectRatio = 16 / 9;
    const photoWidth = targetWidth;
    const photoHeight = Math.round(targetWidth / aspectRatio);
    
    // Add margins
    const sideMargin = 40;
    const topBottomMargin = 60;
    const photoSpacing = 40;
    const extraBottomSpace = 80;

    canvas.width = photoWidth + (sideMargin * 2);
    canvas.height = (photoHeight * 3) + (topBottomMargin * 2) + (photoSpacing * 2) + extraBottomSpace;

    // Fill background
    ctx.fillStyle = selectedColor.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    };

    Promise.all(photos.map(loadImage)).then((images) => {
      // Reset shadow before drawing images
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      images.forEach((img, index) => {
        const y = topBottomMargin + (index * (photoHeight + photoSpacing));
        
        // Add shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        // Draw photo
        ctx.drawImage(img, sideMargin, y, photoWidth, photoHeight);
      });

      const link = document.createElement('a');
      link.download = 'photobooth-strip.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    });
  };

  return (
    <div className="fixed bottom-8 right-8 w-64">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="polaroid p-6 space-y-4"
        style={{ backgroundColor: selectedColor.bg }}
      >
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            className="relative w-full"
            style={{ 
              aspectRatio: '16/9',
              marginBottom: index === 2 ? '2.5rem' : '1.5rem' // Extra space after last photo
            }}
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className={`w-full h-full object-cover rounded shadow-sm ${filterClass}`}
            />
          </motion.div>
        ))}
        
        {photos.length === 3 && (
          <div className="space-y-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="button-3d w-full flex items-center justify-center"
              style={{ color: selectedColor.text }}
            >
              <SwatchIcon className="w-5 h-5 mr-2" />
              Change Color
            </motion.button>

            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-5 gap-2 mt-2"
              >
                {stripColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color);
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.bg }}
                    title={color.name}
                  />
                ))}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadStrip}
              className="button-3d w-full flex items-center justify-center"
              style={{ color: selectedColor.text }}
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Save Strip
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}