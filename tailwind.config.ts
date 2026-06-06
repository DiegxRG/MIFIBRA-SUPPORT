import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // GeoShield Brand
        'gs-orange': '#F72585',
        'gs-orange-light': '#FF6CB6',
        'gs-orange-dark': '#C01367',
        'gs-blue': '#432A8D',
        'gs-blue-mid': '#6D3DF2',
        'gs-blue-light': '#9D7BFF',
        // MiFibra Brand
        'mf-pink': '#F3188F',
        'mf-pink-light': '#FF83C6',
        'mf-dark': '#171724',
        'mf-darker': '#090912',
        // Neutral
        'surface': '#10131D',
        'surface-light': '#181D2A',
        'surface-card': '#141A26',
        'surface-hover': '#20283A',
        'border-subtle': '#2B3448',
        'text-primary': '#F5F7FB',
        'text-secondary': '#A3AEC2',
        'text-muted': '#69758A',
        // Status
        'status-active': '#22C55E',
        'status-expired': '#EF4444',
        'status-revoked': '#F59E0B',
        'status-pending': '#A78BFA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-orange': '0 0 24px rgba(247, 37, 133, 0.35)',
        'glow-pink': '0 0 24px rgba(243, 24, 143, 0.34)',
        'glow-blue': '0 0 24px rgba(109, 61, 242, 0.28)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7C3AED 0%, #F3188F 56%, #FF83C6 100%)',
        'gradient-dark': 'radial-gradient(circle at top left, rgba(243, 24, 143, 0.12), transparent 32%), linear-gradient(180deg, #090912 0%, #111420 48%, #090912 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(24, 29, 42, 0.95) 0%, rgba(11, 13, 20, 0.98) 100%)',
        'gradient-orange': 'linear-gradient(135deg, #F3188F 0%, #C01367 100%)',
        'gradient-pink': 'linear-gradient(135deg, #FF6CB6 0%, #F3188F 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
