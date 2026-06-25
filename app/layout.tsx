import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Campus Lost & Found",
  description: "Aplikasi pelaporan barang hilang dan temuan di kampus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}