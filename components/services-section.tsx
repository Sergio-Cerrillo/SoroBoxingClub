import { Card } from "@/components/ui/card"
import { Dumbbell, Users, Video, Trophy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: Dumbbell,
    title: "Entrenamiento Personal",
    description: "Sesiones individuales con entrenadores certificados para maximizar tu progreso y alcanzar tus metas.",
    link: "/clases",
  },
  {
    icon: Users,
    title: "Clases Grupales",
    description: "Entrena con otros boxeadores en un ambiente motivador, competitivo y lleno de energía positiva.",
    link: "/clases",
  },
  {
    icon: Video,
    title: "Clases Online",
    description: "Accede a entrenamientos en vivo y grabados desde cualquier lugar del mundo, sin límites.",
    link: "/clases",
  },
  {
    icon: Trophy,
    title: "Preparación para Combates",
    description:
      "Programa intensivo profesional para competidores que buscan destacar en el ring y alcanzar la gloria.",
    link: "/combates",
  },
]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-24 lg:py-32 pb-40 lg:pb-48 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
            <span className="text-accent font-mono text-xs tracking-[0.2em] uppercase font-medium">
              Nuestros Programas
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            ENTRENA A TU <span className="text-accent">MANERA</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-mono max-w-3xl mx-auto leading-relaxed">
            Programas diseñados para todos los niveles, desde principiantes hasta profesionales
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-accent bg-card animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-8 h-8 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-6">{service.description}</p>

              <Link href={service.link}>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-0 text-accent hover:text-accent/80 font-mono text-sm group/btn"
                >
                  Más información
                  <span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
