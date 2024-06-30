import { Config } from "tailwindcss";
import { datawanUIPreset } from "./src/styles/datawan-ui";

const config: Config = {
  presets: [datawanUIPreset],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
};

export default config;
