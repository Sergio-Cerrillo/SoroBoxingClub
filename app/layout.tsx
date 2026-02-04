import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { MotionProvider } from "@/components/motion"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"]
})

export const metadata: Metadata = {
  title: "Soro Boxing Club",
  description:
    "Entrena como un campeón. Clases de boxeo profesional, entrenamiento en línea, técnicas avanzadas y combates organizados.",
  generator: "v0.app",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="font-montserrat antialiased">
        <MotionProvider>
          <AuthProvider>{children}</AuthProvider>
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  )
}
