'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownTrayIcon, SwatchIcon, HeartIcon } from '@heroicons/react/24/solid';
import { useState, useRef, ReactNode } from 'react';
import Image from 'next/image';
import StickerPicker from './StickerPicker';

declare global {
  interface Window {
    Path2D: {
      new(path?: string): Path2D;
      prototype: Path2D;
    }
    Image: {
      new(): HTMLImageElement;
      prototype: HTMLImageElement;
    }
  }
}

interface PreviewStripProps {
  photos: string[];
  filterClass: string;
}

interface PlacedSticker {
  id: string;
  x: number;
  y: number;
  icon: ReactNode;
  color: string;
  rotation: number;
  scale: number;
}

interface Sticker {
  id: string;
  icon: ReactNode;
  color: string;
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
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);

  const handleStickerSelect = (sticker: Sticker) => {
    const stripElement = stripRef.current;
    if (!stripElement) return;

    const rect = stripElement.getBoundingClientRect();
    const randomX = Math.random() * (rect.width - 40); // 40px is approx sticker size
    const randomY = Math.random() * (rect.height - 40);
    const randomRotation = Math.random() * 360;
    const randomScale = 0.8 + Math.random() * 0.4; // Scale between 0.8 and 1.2

    setPlacedStickers(prev => [...prev, {
      ...sticker,
      x: randomX,
      y: randomY,
      rotation: randomRotation,
      scale: randomScale
    }]);
  };

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
        const img = new window.Image();
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

      // Draw stickers
      placedStickers.forEach(sticker => {
        // Scale sticker positions to canvas size
        const stripElement = stripRef.current;
        if (!stripElement) return;
        
        const stripRect = stripElement.getBoundingClientRect();
        const scaleX = canvas.width / stripRect.width;
        const scaleY = canvas.height / stripRect.height;
        
        const x = sticker.x * scaleX;
        const y = sticker.y * scaleY;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((sticker.rotation * Math.PI) / 180);
        ctx.scale(sticker.scale, sticker.scale);
        
        // Draw heart shape directly
        ctx.fillStyle = sticker.color;
        ctx.beginPath();
        ctx.moveTo(12, 21.35);
        ctx.bezierCurveTo(40, 10, 40, -10, 12, 4);
        ctx.bezierCurveTo(-16, -10, -16, 10, 12, 21.35);
        ctx.fill();
        
        ctx.restore();
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
        ref={stripRef}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="polaroid p-6 space-y-4 relative"
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
              marginBottom: index === 2 ? '2.5rem' : '1.5rem'
            }}
          >
            <Image
              src={photo}
              alt={`Photo ${index + 1}`}
              className={`w-full h-full object-cover rounded shadow-sm ${filterClass}`}
              width={400}
              height={225}
              priority={true}
            />
          </motion.div>
        ))}

        <AnimatePresence>
          {placedStickers.map((sticker, index) => (
            <motion.div
              key={`${sticker.id}-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute w-8 h-8"
              style={{
                left: `${sticker.x}px`,
                top: `${sticker.y}px`,
                transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                color: sticker.color
              }}
            >
              {sticker.icon}
            </motion.div>
          ))}
        </AnimatePresence>
        
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
              onClick={() => setShowStickerPicker(!showStickerPicker)}
              className="button-3d w-full flex items-center justify-center"
              style={{ color: selectedColor.text }}
            >
              <HeartIcon className="w-5 h-5 mr-2" />
              Add Stickers
            </motion.button>

            {showStickerPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              >
                <StickerPicker onSelectSticker={handleStickerSelect} />
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