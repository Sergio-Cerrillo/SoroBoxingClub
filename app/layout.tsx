import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { MotionProvider } from "@/components/motion"
import "./globals.css"

const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-sans" })
const inter = Inter({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Soro Boxing - Academia de Boxeo de Élite",
  description:
    "Entrena como un campeón. Clases de boxeo profesional, entrenamiento en línea, técnicas avanzadas y combates organizados.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${playfairDisplay.variable} ${inter.variable} font-sans antialiased`}>
        <MotionProvider>
          <AuthProvider>{children}</AuthProvider>
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  )
}
