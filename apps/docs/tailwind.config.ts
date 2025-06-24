import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  theme: {
    container: {
      center: false,
      padding: "0",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      colors: {
        // Core color system
        black: {
          100: "var(--color-black-100)",
        },
        white: "var(--color-white)",
        gray: {
          10: "var(--color-gray-10)",
          20: "var(--color-gray-20)",
          30: "var(--color-gray-30)",
          40: "var(--color-gray-40)",
          50: "var(--color-gray-50)",
          60: "var(--color-gray-60)",
          70: "var(--color-gray-70)",
          80: "var(--color-gray-80)",
          90: "var(--color-gray-90)",
          100: "var(--color-gray-100)",
        },
        blue: {
          50: "var(--color-blue-50)",
          60: "var(--color-blue-60)",
          70: "var(--color-blue-70)",
        },
        // Theme-based colors
        theme: {
          background: "var(--theme-background)",
          text: "var(--theme-text)",
          border: "var(--theme-border)",
          "border-subdued": "var(--theme-border-subdued)",
          "focused-foreground": "var(--theme-focused-foreground)",
          muted: "var(--theme-muted)",
          "hover-bg": "var(--theme-hover-bg)",
          "active-bg": "var(--theme-active-bg)",
        },
        // Compatibility with shadcn/ui components
        border: "var(--theme-border)",
        input: "var(--theme-border)",
        ring: "var(--theme-focused-foreground)",
        background: "var(--theme-background)",
        foreground: "var(--theme-text)",
        primary: {
          DEFAULT: "var(--theme-text)",
          foreground: "var(--theme-background)",
        },
        secondary: {
          DEFAULT: "var(--theme-border)",
          foreground: "var(--theme-text)",
        },
        destructive: {
          DEFAULT: "var(--color-gray-90)",
          foreground: "var(--color-white)",
        },
        muted: {
          DEFAULT: "var(--color-gray-10)",
          foreground: "var(--theme-muted)",
        },
        accent: {
          DEFAULT: "var(--theme-focused-foreground)",
          foreground: "var(--color-white)",
        },
        popover: {
          DEFAULT: "var(--theme-background)",
          foreground: "var(--theme-text)",
        },
        card: {
          DEFAULT: "var(--color-gray-10)",
          foreground: "var(--theme-text)",
        },
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
      },
      borderRadius: {
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
      },
      fontFamily: {
        sans: ["var(--font-family-mono)", "monospace"],
        mono: ["var(--font-family-mono)", "monospace"],
        title: ["var(--font-family-title)", "monospace"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "var(--font-size)",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
      },
      lineHeight: {
        base: "var(--line-height-base)",
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
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideInFromBottom: {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.15s ease-out",
        slideInFromBottom: "slideInFromBottom 0.3s ease-out",
      },
      maxWidth: {
        container: "620px",
        "container-lg": "1024px",
        prose: "65ch",
      },
      zIndex: {
        page: "var(--z-index-page)",
        tooltips: "var(--z-index-tooltips)",
        modals: "var(--z-index-modals)",
      },
    },
  },
  plugins: [],
}

export default config