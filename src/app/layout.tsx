import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const displayFont = localFont({
  src: "./fonts/SpaceGrotesk.ttf",
  variable: "--font-display",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Hire Jose Jerez | IT Operations & Automation", template: "%s | Jose Jerez" },
  description: "Meet Jose Jerez: IT Operations, identity management, systems administration, and workflow automation. Explore projects, support metrics, and the person behind the work.",
  openGraph: { title: "Hire Jose Jerez", description: "IT Operations. Thoughtful automation. Real impact.", type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} h-full antialiased`}>
      <body>{children}</body>
    </html>
  );
}
