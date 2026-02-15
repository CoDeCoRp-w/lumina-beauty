import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lumina Beauty - Sistema de Gestión para Salones de Belleza",
    template: "%s | Lumina Beauty",
  },
  description: "Sistema profesional de gestión para salones de belleza. Agenda citas, gestiona servicios, personal y genera reportes de ingresos. Interfaz moderna y fácil de usar.",
  keywords: ["salón de belleza", "gestión", "citas", "reservas", "POS", "Bolivia", "estilista"],
  authors: [{ name: "Lumina Beauty" }],
  creator: "Lumina Beauty",
  openGraph: {
    type: "website",
    locale: "es_BO",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Lumina Beauty",
    title: "Lumina Beauty - Sistema de Gestión para Salones de Belleza",
    description: "Sistema profesional de gestión para salones de belleza",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lumina Beauty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumina Beauty - Sistema de Gestión",
    description: "Sistema profesional de gestión para salones de belleza",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
