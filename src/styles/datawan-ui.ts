import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";
import talwindAnimate from "tailwindcss-animate";
import defaultTheme from "tailwindcss/defaultTheme";

const datawanUIPlugin = plugin(
  ({ addBase }) => {
    addBase({
      ":root": {
        "--background": "54.55 21.57% 90%",
        "--foreground": "225 6.06% 12.94%",
        "--muted": "54.55 21.57% 95%",
        "--muted-foreground": "225 6.06% 40%",
        "--popover": "53.33 69.23% 97.45%",
        "--popover-foreground": "225 6.06% 12.94%",
        "--card": "55 70% 97%",
        "--card-foreground": "225 6.06% 12.94%",
        "--border": "225 6.06% 80%",
        "--input": "225 6.06% 70%",
        "--ring": "46 91% 49%",
        "--primary": "45.07 91.24% 49.22%",
        "--primary-foreground": "225 6.06% 12.94%",
        "--secondary": "28.56 91.24% 49.22%",
        "--secondary-foreground": "53.33 69.23% 97.45%",
        "--accent": "54.55 21.57% 85%",
        "--accent-foreground": "225 6.06% 12.94%",
        "--destructive": "10 90% 49.22%",
        "--destructive-foreground": "0 91% 98%",
        "--radius": "0.5rem",
      },
      ".dark": {
        "--background": "225 6.06% 12.94%",
        "--foreground": "54.55 21.57% 90%",
        "--muted": "225 6.06% 16%",
        "--muted-foreground": "226 3% 70%",
        "--popover": "220 6.52% 18.04%",
        "--popover-foreground": "46 27% 98%",
        "--card": "225 6.06% 18%",
        "--card-foreground": "54.55 21.57% 90%",
        "--border": "54.55 3.64% 22%",
        "--input": "54.55 5% 30%",
        "--primary": "45.07 91.24% 49.22%",
        "--primary-foreground": "225 6.06% 12.94%",
        "--secondary": "28.56 91.24% 49.22%",
        "--secondary-foreground": "54.55 21.57% 90%",
        "--accent": "225 1.11% 20%",
        "--accent-foreground": "0 0% 100%",
        "--destructive": "0 91% 59%",
        "--destructive-foreground": "0 0% 100%",
        "--ring": "45.07 91.24% 49.22%",
      },

      "*": {
        "@apply border-border": {},
      },
      body: {
        "@apply bg-background text-foreground": {},
        "font-feature-settings": '"rlig" 1, "calt" 1',
      },
    });
  },
  {
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        fontFamily: {
          sans: ["Plus Jakarta Sans Variable", ...defaultTheme.fontFamily.sans],
          mono: ["JetBrains Mono Variable", ...defaultTheme.fontFamily.mono],
        },
        colors: {
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
  }
);

export const datawanUIPreset = {
  darkMode: ["class"],
  plugins: [talwindAnimate, datawanUIPlugin],
  content: [
    "./src/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
} satisfies Config;
