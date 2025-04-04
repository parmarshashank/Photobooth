'use client';

import { motion } from 'framer-motion';
import { HeartIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';

interface Sticker {
  id: string;
  icon: ReactNode;
  color: string;
}

const stickers: Sticker[] = [
  { id: 'heart-pink', icon: <HeartIcon className="w-full h-full" />, color: '#ff69b4' },
  { id: 'heart-red', icon: <HeartIcon className="w-full h-full" />, color: '#ff4444' },
  { id: 'heart-yellow', icon: <HeartIcon className="w-full h-full" />, color: '#FFD700' },
  { id: 'heart-black', icon: <HeartIcon className="w-full h-full" />, color: '#000000' },
  { id: 'sparkle', icon: <SparklesIcon className="w-full h-full" />, color: '#ffd700' },
  { id: 'star', icon: <StarIcon className="w-full h-full" />, color: '#ffa500' },
];

interface StickerPickerProps {
  onSelectSticker: (sticker: Sticker) => void;
}

export default function StickerPicker({ onSelectSticker }: StickerPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {stickers.map((sticker) => (
        <motion.button
          key={sticker.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelectSticker(sticker)}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ color: sticker.color }}
        >
          {sticker.icon}
        </motion.button>
      ))}
    </div>
  );
} 