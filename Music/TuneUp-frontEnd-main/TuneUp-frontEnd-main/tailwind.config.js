/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}", "*.{js,ts,jsx,tsx,mdx}"],
	theme: {
	  extend: {
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		colors: {
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  chart: {
			1: "hsl(var(--chart-1))",
			2: "hsl(var(--chart-2))",
			3: "hsl(var(--chart-3))",
			4: "hsl(var(--chart-4))",
			5: "hsl(var(--chart-5))",
		  },
  
		  // HarmonyLandingPage Styles (Only affects HarmonyLandingPage)
		  harmony: {
			background: "#0B0F19",
			surface: "#161B29",
			primary: "#8E7AB5",
			secondary: "#00A9A5",
			accent: "#FF6B6B",
			text: {
			  primary: "#8E7AB5",
			  secondary: "#AAB0C2",
			},
		  },
  
		  // Authentication Pages Styles (For Login & Signup)
		  authStyles: {
			background: "#0D0A1A", // Deep Royal Blue-Black
			surface: "#1B1535", // Rich Dark Blue Card Background
			primary: "#6C47FF", // Vibrant Royal Purple
			secondary: "#B888FF", // Bright Elegant Lilac
			accent: "#FF5E78", // Soft Red for Highlights
			text: {
			  primary: "#F1E9FF", // Soft Light Lavender (Main Text)
			  secondary: "#9E86C8", // Muted Lilac (Subtext)
			},
			border: "#6C47FF", // Matching Primary Border
			button: {
			  background: "#6C47FF",
			  text: "#0D0A1A",
			  hover: "#8A68FF",
			},
			error: "#FF5E78", // Soft Red for Errors
			success: "#28C76F", // Fresh Green for Success Messages
		  },
		},
		backgroundImage: {
		  "gradient-radial": "radial-gradient(circle, #8E7AB5 10%, #161B29 90%)",
		  "gradient-conic": "conic-gradient(from 180deg, #00A9A5, #8E7AB5, #FF6B6B)",
		  "gradient-accent": "linear-gradient(135deg, #8E7AB5, #00A9A5, #FF6B6B)",
		},
		animation: {
		  "gradient-move": "gradientMove 3s ease infinite",
		  liquid: "liquidMove 2s infinite linear",
		},
		keyframes: {
		  gradientMove: {
			"0%": { backgroundPosition: "0% 50%" },
			"50%": { backgroundPosition: "100% 50%" },
			"100%": { backgroundPosition: "0% 50%" },
		  },
		  liquidMove: {
			"0%": { backgroundPosition: "0% 50%" },
			"6.25%": { backgroundPosition: "12.5% 60%" },
			"12.5%": { backgroundPosition: "25% 70%" },
			"18.75%": { backgroundPosition: "37.5% 80%" },
			"25%": { backgroundPosition: "50% 75%" },
			"31.25%": { backgroundPosition: "62.5% 65%" },
			"37.5%": { backgroundPosition: "75% 55%" },
			"43.75%": { backgroundPosition: "87.5% 45%" },
			"50%": { backgroundPosition: "100% 50%" },
			"56.25%": { backgroundPosition: "87.5% 55%" },
			"62.5%": { backgroundPosition: "75% 40%" },
			"68.75%": { backgroundPosition: "62.5% 30%" },
			"75%": { backgroundPosition: "50% 25%" },
			"81.25%": { backgroundPosition: "37.5% 30%" },
			"87.5%": { backgroundPosition: "25% 40%" },
			"93.75%": { backgroundPosition: "12.5% 50%" },
			"100%": { backgroundPosition: "0% 50%" },
		  },
		},
	  },
	},
	plugins: [require("tailwindcss-animate"),
		require('tailwind-scrollbar-hide')
	],
  };
  