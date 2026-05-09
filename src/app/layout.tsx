import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAIOS — Recube AI Operating System",
  description: "28 agents across 5 teams. Shared memory. One brain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
