import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Untold — anonymous messages",
  description: "A quiet place for anonymous words, with no profiles and no reply paths.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
