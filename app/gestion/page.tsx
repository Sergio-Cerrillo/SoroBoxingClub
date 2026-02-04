"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Users, Calendar, DollarSign, BarChart3 } from "lucide-react"

export default function GestionPage() {
  const { user, isAuthenticated, isManager, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Esperar a que termine de cargar antes de redirigir
    if (loading) return

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isManager) {
      router.push("/")
      return
    }
  }, [isAuthenticated, isManager, router, loading])

  // Mostrar loading mientras se verifica autenticación
  if (loading || !user || !isManager) {
    return null
  }

  const sections = [
    {
      icon: Users,
      title: "GESTIÓN DE USUARIOS",
      description: "Administra usuarios, pagos y accesos",
      link: "/gestion/usuarios",
      color: "accent",
    },
    {
      icon: Calendar,
      title: "GESTIÓN DE CLASES",
      description: "Administra horarios y alumnos inscritos",
      link: "/gestion/clases",
      color: "primary",
    },
    {
      icon: BarChart3,
      title: "FACTURACIÓN",
      description: "Métricas financieras y control de cobros",
      link: "/gestion/dashboard",
      color: "blue-500",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary/95 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6">
              PANEL DE <span className="text-accent">CONTROL</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 font-mono">Administración completa de tu academia</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sections.map((section, index) => (
              <Button
                key={index}
                onClick={() => router.push(section.link)}
                className="relative h-auto p-8 flex flex-col items-start gap-4 bg-black backdrop-blur-md border-2 border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 text-left shadow-[0_0_10px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5),0_0_60px_rgba(251,191,36,0.3)] hover:scale-[1.03] rounded-[24px] overflow-hidden group !bg-black hover:!bg-black"
                variant="outline"
              >
                <div className="w-14 h-14 bg-accent/20 backdrop-blur-md rounded-xl flex items-center justify-center relative z-10">
                  <section.icon className="w-7 h-7 text-accent" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">{section.title}</h3>
                  <p className="text-sm text-primary-foreground/70 font-light">{section.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
