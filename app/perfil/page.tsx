"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Calendar, Shield, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PerfilPage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
  }

  const memberSinceDate = new Date(user.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.dni

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/95 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-6 py-2 bg-accent/20 backdrop-blur-sm border border-accent/50 rounded-full mb-6">
              <span className="text-accent font-mono text-sm tracking-widest">MI PERFIL</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4">
              Hola, <span className="text-accent">{user.first_name || user.dni}</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 font-mono">
              {isAdmin ? 'Administrador del sistema' : 'Información de tu cuenta'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 border-2 hover:border-accent transition-all">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Información Personal</h2>
                {isAdmin && (
                  <Badge className="px-4 py-2 bg-accent text-accent-foreground text-base">
                    <Shield className="w-4 h-4 mr-2" />
                    ADMINISTRADOR
                  </Badge>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-mono tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    DNI
                  </Label>
                  <p className="text-lg p-3 bg-muted rounded-lg">{user.dni}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-mono tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" />
                    NOMBRE COMPLETO
                  </Label>
                  <p className="text-lg p-3 bg-muted rounded-lg">
                    {fullName}
                  </p>
                </div>

                {user.email && (
                  <div className="space-y-2">
                    <Label className="text-sm font-mono tracking-wide flex items-center gap-2">
                      <Mail className="w-4 h-4 text-accent" />
                      EMAIL
                    </Label>
                    <p className="text-lg p-3 bg-muted rounded-lg">{user.email}</p>
                  </div>
                )}

                {user.phone && (
                  <div className="space-y-2">
                    <Label className="text-sm font-mono tracking-wide flex items-center gap-2">
                      <Phone className="w-4 h-4 text-accent" />
                      TELÉFONO
                    </Label>
                    <p className="text-lg p-3 bg-muted rounded-lg">{user.phone}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-mono tracking-wide flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    MIEMBRO DESDE
                  </Label>
                  <p className="text-lg p-3 bg-muted rounded-lg">{memberSinceDate}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-mono tracking-wide flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent" />
                    ROL
                  </Label>
                  <p className="text-lg p-3 bg-muted rounded-lg uppercase">{user.role}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full md:w-auto font-mono tracking-wide"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  CERRAR SESIÓN
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
