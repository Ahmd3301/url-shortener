import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "Shorten any URL instantly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
