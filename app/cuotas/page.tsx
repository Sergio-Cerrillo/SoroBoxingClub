import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Zap, Crown, Sparkles, User, Users2, Calendar, Apple } from "lucide-react"
import Link from "next/link"

export default function CuotasPage() {
  const planes = [
    {
      nombre: "SOLO PESAS",
      precio: "35",
      periodo: "mes + 25€ de matrícula",
      descripcion: "Perfecto para mantenerte en forma en nuestra zona de pesas.",
      icon: Zap,
      caracteristicas: [
        "Acceso al gimnasio (horario ilimitado)",
        "Uso de equipamiento de pesas y máquinas",
        "Vestuarios y duchas",
      ],
      popular: false,
    },
    {
      nombre: "PESAS Y BOXEO",
      precio: "50",
      periodo: "mes + 25€ de matrícula",
      descripcion: "Combina entrenamiento de pesas y clases de boxeo.",
      icon: Crown,
      caracteristicas: [
        "Todo lo incluido en 'Solo Pesas'",
        "Clases grupales ilimitadas de boxeo",
        "Acceso días de combate y sparring",
        "Asesoramiento inicial y plan de entrenamiento básico",
        "uso de equipamiento de pesas y máquinas",
        "Vestuarios y duchas"
      ],
      popular: true,
    },
    {
      nombre: "CLASES FUNCIONALES DIRIGIDAS",
      precio: "50",
      periodo: "mes + 25€ de matrícula",
      descripcion: "Alternativa al boxeo, con clases funcionales dirigidas.",
      icon: Sparkles,
      caracteristicas: [
        "Todo lo incluido en 'Solo Pesas'",
        "Acceso a todas las clases funcionales dirigidas",
        "Uso de equipamiento de pesas y máquinas",
        "Vestuarios y duchas",
        "Asesoramiento inicial",
      ],
      popular: false,
    },

  ]

  const serviciosExtra = [
    { servicio: "Clase individual (1 hora)", icon: User, descripcion: "Entrenamiento personalizado 1 a 1 adaptado a tus objetivos" },
    { servicio: "Pack 5 clases individuales", icon: Users2, descripcion: "Mejora tu técnica con sesiones personalizadas", destacado: true },
    { servicio: "Pack 10 clases individuales", icon: Calendar, descripcion: "Máxima dedicación para resultados profesionales", destacado: true },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/planes.JPG')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-black" />

        <div className="container mx-auto px-4 z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 backdrop-blur-md border border-accent/30 rounded-full mb-8">
              <span className="text-accent font-mono text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                PRECIOS
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary-foreground tracking-tight leading-tight">
              ELIGE TU{" "}
              <span className="animate-shimmer bg-gradient-to-r from-accent via-yellow-300 to-accent bg-[length:200%_auto] bg-clip-text text-transparent">
                PLAN
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/90 leading-relaxed font-light max-w-3xl mx-auto">
              Planes diseñados para todos los niveles. Sin permanencia, cancela cuando quieras.
            </p>
          </div>
        </div>
      </section>

      {/* Planes de Cuotas */}
      <section className="py-20 lg:py-32 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {planes.map((plan, index) => {
              const IconComponent = plan.icon
              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:from-white/15 hover:via-white/10 hover:to-white/5 ${plan.popular
                    ? "shadow-[0_20px_70px_rgba(251,191,36,0.3)] hover:shadow-[0_30px_90px_rgba(251,191,36,0.4)] scale-105"
                    : "shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_70px_rgba(251,191,36,0.25)]"
                    } transition-all duration-300 rounded-[28px] border-0`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-sm font-mono">
                      MÁS POPULAR
                    </div>
                  )}

                  <div className="mb-6">
                    <IconComponent className="w-12 h-12 text-accent mb-4" />
                    <h3 className="text-2xl font-bold mb-2 font-mono text-white tracking-wider">{plan.nombre}</h3>
                    <p className="text-gray-400 text-sm">{plan.descripcion}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-accent">{plan.precio}€</span>
                      <span className="text-gray-400">/ {plan.periodo}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.caracteristicas.map((caracteristica, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{caracteristica}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full font-mono rounded-full shadow-lg hover:shadow-xl transition-all ${plan.popular
                      ? "bg-gradient-to-r from-amber-500/90 to-yellow-600/90 backdrop-blur-md border border-amber-400/30 text-accent-foreground hover:from-amber-500 hover:to-yellow-600 hover:border-amber-400/50"
                      : "bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-amber-500/20 text-white hover:from-white/30 hover:to-white/20 hover:border-amber-500/40"
                      }`}
                    size="lg"
                    asChild
                  >
                    <Link href="/contacto">COMENZAR AHORA</Link>
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Servicios Extra */}
      <section className="py-20 lg:py-32 bg-black border-t border-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
                <span className="text-accent font-mono text-xs tracking-[0.2em] uppercase font-medium">
                  Complementos
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                SERVICIOS <span className="text-accent">ADICIONALES</span>
              </h2>
              <p className="text-gray-400 text-lg font-mono">Lleva tu entrenamiento al siguiente nivel</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {serviciosExtra.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Card
                    key={index}
                    className="group p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:from-white/15 hover:via-white/10 hover:to-white/5 shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_70px_rgba(251,191,36,0.25)] transition-all duration-300 hover:-translate-y-1 rounded-[28px] border-0"
                  >
                    {item.destacado && (
                      <Badge className="absolute top-4 right-4 bg-accent/20 text-accent border-accent/30">
                        POPULAR
                      </Badge>
                    )}

                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-accent group-hover:text-accent-foreground" />
                      </div>
                      <h3 className="text-white font-bold text-xl mb-3 font-mono">{item.servicio}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.descripcion}</p>
                    </div>

                    <Link href="/contacto" className="block">
                      <Button
                        className="w-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-amber-500/30 text-accent hover:from-white/30 hover:to-white/20 hover:border-amber-500/50 hover:text-accent font-mono transition-all duration-300 rounded-full shadow-lg hover:shadow-xl"
                      >
                        Infórmate de esto
                      </Button>
                    </Link>
                  </Card>
                )
              })}
            </div>

            {/* CTA adicional */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-4 font-mono">¿Necesitas más información sobre nuestros servicios?</p>
              <Link href="/contacto">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500/90 to-yellow-600/90 backdrop-blur-md border border-amber-400/30 text-accent-foreground hover:from-amber-500 hover:to-yellow-600 hover:border-amber-400/50 font-mono rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Contacta con nosotros
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
