'use client';

import { motion } from 'framer-motion';

const filters = [
  { 
    id: 'normal', 
    name: 'Normal', 
    class: '' 
  },
  { 
    id: 'vintage', 
    name: 'Vintage', 
    class: 'sepia-[0.6] contrast-125 brightness-95 saturate-70 hue-rotate-[355deg]'
  },
  { 
    id: 'dreamy', 
    name: 'Dreamy', 
    class: 'brightness-125 contrast-75 saturate-75 blur-[1px] opacity-90'
  },
  { 
    id: 'retro', 
    name: 'Retro 70s', 
    class: 'sepia-[0.35] contrast-150 brightness-90 saturate-150 hue-rotate-[10deg]'
  },
  { 
    id: 'noir', 
    name: 'Noir', 
    class: 'grayscale contrast-150 brightness-90'
  },
  { 
    id: 'polaroid', 
    name: 'Polaroid', 
    class: 'contrast-110 brightness-110 saturate-110 sepia-[0.15] hue-rotate-[5deg]'
  },
  { 
    id: 'summer', 
    name: 'Summer', 
    class: 'brightness-120 contrast-110 saturate-150 hue-rotate-[355deg]'
  },
  { 
    id: 'winter', 
    name: 'Winter', 
    class: 'brightness-110 contrast-110 saturate-75 hue-rotate-[180deg]'
  },
  { 
    id: 'dramatic', 
    name: 'Dramatic', 
    class: 'contrast-175 brightness-75 saturate-125 hue-rotate-[5deg]'
  },
  { 
    id: 'cyberpunk', 
    name: 'Cyberpunk', 
    class: 'contrast-150 brightness-110 saturate-200 hue-rotate-[300deg]'
  }
];

interface FilterSelectorProps {
  selectedFilter: string;
  onFilterSelect: (filterId: string) => void;
}

export default function FilterSelector({ selectedFilter, onFilterSelect }: FilterSelectorProps) {
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex space-x-4 px-4">
        {filters.map((filter) => (
          <motion.div
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`filter-thumbnail ${selectedFilter === filter.id ? 'border-[var(--accent-pink)]' : ''}`}
            onClick={() => onFilterSelect(filter.id)}
          >
            <div className="relative w-20 h-20">
              <div className={`w-full h-full bg-[var(--primary-pink)] rounded-lg ${filter.class}`} />
              <span className="absolute bottom-0 left-0 right-0 text-center text-xs font-medium text-gray-700 bg-white/80 rounded-b-lg py-1">
                {filter.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 