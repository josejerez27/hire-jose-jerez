import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body>{children}</body>
    </html>
  );
}
