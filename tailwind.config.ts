import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Semantic colors for shadcn/ui
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Custom Event Design Tokens
        blue: {
          DEFAULT: "#1A54C8",
          dark: "#1340A0",
          darker: "#0E2D7A",
          mid: "#4A7CE8",
          light: "#EEF3FF",
          xlight: "#F5F8FF",
        },
        red: {
          DEFAULT: "#CE1126",
          dark: "#8B0000",
          light: "rgba(206, 17, 38, 0.08)",
        },
        green: {
          DEFAULT: "#007A3D",
          dark: "#005229",
          light: "rgba(0, 122, 61, 0.09)",
        },
        neutral: {
          black: "#0A1628",
          white: "#FFFFFF",
          gray: "#6B7A99",
          "gray-light": "#E4E9F5",
          "gray-xlight": "#F0F4FF",
        },
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "sans-serif"],
        barlow: ["var(--font-barlow)", "sans-serif"],
        "barlow-condensed": ["var(--font-barlow-condensed)", "sans-serif"],
      },
      boxShadow: {
        sm: "0 2px 12px rgba(26, 84, 200, 0.08)",
        md: "0 6px 28px rgba(26, 84, 200, 0.12)",
        lg: "0 16px 56px rgba(26, 84, 200, 0.16)",
        card: "0 2px 16px rgba(10, 22, 40, 0.07)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config;