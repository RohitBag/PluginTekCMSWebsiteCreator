import type { Metadata } from "next";
import "./globals.css";
import { SiteProvider } from "@/store/SiteContext";

export const metadata: Metadata = {
  title: "Plugintek Local Website Builder",
  description: "A professional, browser-only CMS for building stunning websites locally.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full font-sans antialiased text-foreground bg-background">
        <SiteProvider>
          {children}
        </SiteProvider>
      </body>
    </html>
  );
}
