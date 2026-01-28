import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Zap, Crown, Sparkles } from "lucide-react"

export default function CuotasPage() {
  const planes = [
    {
      nombre: "BÁSICO",
      precio: "49",
      periodo: "mes",
      descripcion: "Perfecto para empezar tu viaje en el boxeo",
      icon: Zap,
      caracteristicas: [
        "Acceso al gimnasio (horario limitado)",
        "3 clases grupales por semana",
        "Uso de equipamiento básico",
        "Vestuarios y duchas",
        "Asesoramiento inicial",
      ],
      popular: false,
    },
    {
      nombre: "PRO",
      precio: "89",
      periodo: "mes",
      descripcion: "Para boxeadores comprometidos y serios",
      icon: Crown,
      caracteristicas: [
        "Acceso ilimitado al gimnasio",
        "Clases grupales ilimitadas",
        "2 sesiones de entrenamiento personal/mes",
        "Acceso a videos técnicos premium",
        "Plan de nutrición básico",
        "Prioridad en eventos y combates",
        "Descuento en merchandising",
      ],
      popular: true,
    },
    {
      nombre: "ELITE",
      precio: "149",
      periodo: "mes",
      descripcion: "Entrenamiento de campeones, atención VIP",
      icon: Sparkles,
      caracteristicas: [
        "Todo lo incluido en PRO",
        "Entrenamiento personal ilimitado",
        "Sesiones 1-a-1 con entrenadores elite",
        "Plan de nutrición personalizado",
        "Análisis de rendimiento mensual",
        "Preparación para competiciones",
        "Acceso prioritario a eventos",
        "Merchandising exclusivo incluido",
        "Locker privado",
      ],
      popular: false,
    },
  ]

  const serviciosExtra = [
    { servicio: "Clase individual (1 hora)", precio: "35€" },
    { servicio: "Pack 5 clases individuales", precio: "150€" },
    { servicio: "Pack 10 clases individuales", precio: "280€" },
    { servicio: "Preparación para combate (mes)", precio: "200€" },
    { servicio: "Análisis de video técnico", precio: "45€" },
    { servicio: "Plan nutricional personalizado", precio: "60€" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-accent text-accent-foreground">PRECIOS</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary-foreground">
              Elige tu <span className="text-accent">Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Planes diseñados para todos los niveles. Sin permanencia, cancela cuando quieras.
            </p>
          </div>
        </div>
      </section>

      {/* Planes de Cuotas */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {planes.map((plan, index) => {
              const IconComponent = plan.icon
              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden p-8 ${
                    plan.popular ? "border-accent border-2 shadow-xl scale-105" : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-sm font-mono">
                      MÁS POPULAR
                    </div>
                  )}

                  <div className="mb-6">
                    <IconComponent className="w-12 h-12 text-accent mb-4" />
                    <h3 className="text-2xl font-bold mb-2 font-mono">{plan.nombre}</h3>
                    <p className="text-muted-foreground text-sm">{plan.descripcion}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-accent">{plan.precio}€</span>
                      <span className="text-muted-foreground">/ {plan.periodo}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.caracteristicas.map((caracteristica, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{caracteristica}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full font-mono ${
                      plan.popular
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                    size="lg"
                  >
                    COMENZAR AHORA
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Servicios Extra */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Servicios <span className="text-accent">Extra</span>
              </h2>
              <p className="text-muted-foreground">Complementa tu entrenamiento con servicios adicionales</p>
            </div>

            <Card className="p-8">
              <div className="space-y-4">
                {serviciosExtra.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-4 border-b border-border last:border-b-0"
                  >
                    <span className="text-foreground font-medium">{item.servicio}</span>
                    <span className="text-accent font-bold text-lg">{item.precio}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                * Todos los precios incluyen IVA. Descuentos disponibles para estudiantes y familias.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
