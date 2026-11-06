import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apex Motors | 3D Luxury Car Experience",
  description: "Premium interactive 360° car configurator experience built with Next.js and Three.js.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
