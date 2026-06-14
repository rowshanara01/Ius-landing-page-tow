import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IUS — Digital Law on your side",
  description: "Obtaining IT benefits, business support, program registration, development of complex contracts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
