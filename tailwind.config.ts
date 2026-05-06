import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { brand: { orange: '#f97316', dark: '#0c0a09' } } } }, plugins: [] };
export default config;
