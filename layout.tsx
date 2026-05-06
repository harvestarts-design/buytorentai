import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
export const metadata: Metadata = { title: 'BuyToRent AI — Buy low. Rent high.', description: 'Find rentals that cash flow before you buy. Analyze rental returns, compare markets, and create rental deal alerts.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><Header />{children}</body></html>; }
