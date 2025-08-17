import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import {
  DM_Serif_Text,
  Poppins,
  M_PLUS_Rounded_1c,
  Pacifico,
} from "next/font/google";

const dmSerif = DM_Serif_Text({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
});
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
});
const rounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  variable: "--font-rounded",
  weight: ["400", "700"],
});
const pacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  weight: "400",
});
export const metadata: Metadata = {
  title: "Dyce – College Dating App",
  description:
    "Dyce is a modern dating app designed exclusively for college students. Match, chat, and vibe with people who share your world.",
  keywords: [
    "dating app",
    "college dating",
    "Dyce",
    "social app",
    "student relationships",
    "college matchmaking"
  ],
  authors: [{ name: "Roshan Sharma", url: "https://dyce.app" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/dyce-logo-192x192.png",
    apple: "/dyce-logo-192x192.png", // ensure it's 180x180 or close
    shortcut: "/dyce-logo-192x192.png"
  },
  robots: {
    index: true,
    follow: true
  },
  category: "social networking"
};

export const viewport = {
  themeColor: "#36B9C5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${dmSerif.variable} ${poppins.variable} ${rounded.variable} ${pacifico.variable}`}
    >
      <body
        className={`${dmSerif.variable} ${poppins.variable} ${rounded.variable} ${pacifico.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
