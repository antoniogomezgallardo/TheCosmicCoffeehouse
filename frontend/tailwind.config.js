/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sci-Fi Cosmic Theme
        cosmic: {
          // Deep space backgrounds
          void: '#0a0a0a',
          space: '#111827',
          nebula: '#1a1a2e',
          darkMatter: '#16213e',

          // Neon accents
          cyan: '#00ffff',
          purple: '#8a2be2',
          neonGreen: '#39ff14',
          plasma: '#ff6b35',
          quantum: '#4ecdc4',
          energy: '#ffe66d',

          // Power-based colors
          mental: '#9d4edd',
          physical: '#f72585',
          mystical: '#4cc9f0',
          temporal: '#7209b7',

          // Rarity colors
          common: '#6c757d',
          rare: '#0d6efd',
          epic: '#6f42c1',
          legendary: '#fd7e14',
        },

        // Holographic effects
        holo: {
          primary: 'rgba(0, 255, 255, 0.8)',
          secondary: 'rgba(138, 43, 226, 0.6)',
          accent: 'rgba(57, 255, 20, 0.4)',
        }
      },

      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'future': ['Exo 2', 'sans-serif'],
        'matrix': ['Share Tech Mono', 'monospace'],
      },

      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite',
        'hologram': 'hologram 3s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 0.3s linear infinite',
      },

      keyframes: {
        glow: {
          '0%': {
            boxShadow: '0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.3)'
          },
          '100%': {
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.5)'
          }
        },
        'pulse-neon': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.7',
            transform: 'scale(1.05)'
          }
        },
        hologram: {
          '0%, 100%': {
            opacity: '0.8',
            transform: 'translateY(0px) rotateX(0deg)'
          },
          '50%': {
            opacity: '0.6',
            transform: 'translateY(-5px) rotateX(2deg)'
          }
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        }
      },

      backgroundImage: {
        'starfield': 'radial-gradient(2px 2px at 20px 30px, #eee, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent)',
        'cyber-grid': 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
        'hologram': 'linear-gradient(45deg, rgba(0,255,255,0.1), rgba(138,43,226,0.1), rgba(57,255,20,0.1))',
      },

      backdropBlur: {
        'cyber': '8px',
      },

      borderRadius: {
        'cyber': '0.375rem',
      },
    },
  },
  plugins: [],
}