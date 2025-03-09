module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['var(--font-playfair)'],
        'special-elite': ['var(--font-special-elite)'],
      },
      fontFamily: {
        'vintage': ['Special Elite', 'Courier New', 'monospace'],
        'playfair': ['Playfair Display', 'serif'],
        'special-elite': ['Special Elite', 'cursive'],
      },
      animation: {
        'flicker': 'flicker 4s infinite',
        'flash': 'flash 0.3s ease-out forwards',
        'noise': 'noise 2s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'grain-pattern': "url('/grain.png')",
      }
    },
  },
  // ... rest of config
} 