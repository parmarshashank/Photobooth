'use client';

import { motion } from 'framer-motion';

const filters = [
  { id: 'normal', name: 'Normal', class: '' },
  { id: 'vintage', name: 'Vintage', class: 'sepia brightness-90' },
  { id: 'bw', name: 'B&W', class: 'grayscale' },
  { id: 'soft', name: 'Soft', class: 'brightness-105 contrast-95 saturate-95' },
  { id: 'warm', name: 'Warm', class: 'brightness-105 saturate-110' },
  { id: 'cool', name: 'Cool', class: 'brightness-100 saturate-90 hue-rotate-15' },
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