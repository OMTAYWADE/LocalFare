// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out backwards",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
};