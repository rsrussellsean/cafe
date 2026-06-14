import type { Metadata } from "next";
import { Fraunces, Karla, DM_Mono } from "next/font/google";
import { BagProvider } from "@/lib/bag-context";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Kat & Perry's Kitchenette",
  description:
    "Handcrafted coffee, fresh donuts, and irresistible cakes in Tisa, Cebu City. Brewed to perfection, baked with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${karla.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink font-body overflow-x-clip">
        <BagProvider>{children}</BagProvider>
      </body>
    </html>
  );
}
