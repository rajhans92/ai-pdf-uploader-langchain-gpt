/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./src/**/*.{js,ts,jsx,tsx}", // if using `/src` directory
	],
	theme: {
		extend: {
		  colors: {
			primary: "#6C63FF",     // Purple
			accent: "#00C3FF",      // Sky Blue
			background: "#808000",  // olive green
			textMain: "#111827",    // Dark Gray
		  },
		},
	  },
	plugins: {
		"@tailwindcss/postcss": {}
	},
	
  }
  