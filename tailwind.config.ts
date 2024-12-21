import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#FFDC58",
        mainAccent: "#ffc800",
        overlay: "rgba(0,0,0,0.8)",
        bg: "#FEF2E8",
        text: "#000",
        border: "hsl(var(--border))",
        darkBg: "#374151",
        darkText: "#eeefe9",
        darkBorder: "#000",
        darkNavBorder: "#000",
        secondaryBlack: "#1b1b1b",
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

        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        base: "5px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        light:
          "var(--horizontal-box-shadow) var(--vertical-box-shadow) 0px 0px var(--border)",
        dark: "var(--horizontal-box-shadow) var(--vertical-box-shadow) 0px 0px var(--dark-border)",
        nav: "4px 4px 0px 0px var(--border)",
        navDark: "4px 4px 0px 0px var(--dark-border)",
      },
      translate: {
        boxShadowX: "4px",
        boxShadowY: "4px",
        reverseBoxShadowX: "-4px",
        reverseBoxShadowY: "-4px",
      },
      fontWeight: {
        base: "500",
        heading: "700",
      },
      animation: {
        marquee: "marquee 5s linear infinite",
        marquee2: "marquee2 5s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        Space_Grotesk: ["Space Grotesk", ...fontFamily.sans],
      },
      screens: {
        m1500: {
          raw: "(max-width: 1500px)",
        },
        m1300: {
          raw: "(max-width: 1300px)",
        },
        m1250: {
          raw: "(max-width: 1250px)",
        },
        m1100: {
          raw: "(max-width: 1100px)",
        },
        m1000: {
          raw: "(max-width: 1000px)",
        },
        m900: {
          raw: "(max-width: 900px)",
        },
        m850: {
          raw: "(max-width: 850px)",
        },
        m800: {
          raw: "(max-width: 800px)",
        },
        m750: {
          raw: "(max-width: 750px)",
        },
        m700: {
          raw: "(max-width: 700px)",
        },
        m650: {
          raw: "(max-width: 650px)",
        },
        m600: {
          raw: "(max-width: 600px)",
        },
        m550: {
          raw: "(max-width: 550px)",
        },
        m500: {
          raw: "(max-width: 500px)",
        },
        m450: {
          raw: "(max-width: 450px)",
        },
        m400: {
          raw: "(max-width: 400px)",
        },
        m350: {
          raw: "(max-width: 350px)",
        },
      },
      width: {
        container: "1300px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
