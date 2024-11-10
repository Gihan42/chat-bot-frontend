// tailwind.config.js

module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust this based on your file structure
    ],
    theme: {
      extend: {
        animation: {
          pulse: 'pulse 2s infinite',
        },
        keyframes: {
          pulse: {
            '0%, 100%': { transform: 'scale(1)', opacity: '1' },
            '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          },
        },
      },
    },
    plugins: [],
  };
  