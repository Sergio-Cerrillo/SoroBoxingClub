"use client"

import { Card } from "@/components/ui/card"
import { Shield, Award, Heart, Clock, Target, Zap } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Instalaciones de calidad",
    description: "Equipamiento profesional y espacios diseñados específicamente para el máximo rendimiento y confort.",
  },
  {
    icon: Award,
    title: "Entrenadores Certificados",
    description: "Profesionales con experiencia internacional, títulos nacionales y certificaciones de primer nivel.",
  },
  {
    icon: Heart,
    title: "Atención Personalizada",
    description: "Seguimiento individual detallado de tu progreso, objetivos personales y desarrollo continuo.",
  },
  {
    icon: Clock,
    title: "Horarios Flexibles",
    description: "Clases disponibles durante todo el día, adaptadas perfectamente a tu agenda y estilo de vida.",
  },
  {
    icon: Target,
    title: "Resultados Garantizados",
    description: "Programas científicamente probados que te llevan al siguiente nivel de forma segura y efectiva.",
  },
  {
    icon: Zap,
    title: "Energía y Motivación",
    description: "Comunidad vibrante y apasionada que te impulsa diariamente a superar todos tus límites.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/nosotros.jpg')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-accent/20 border border-accent/40 rounded-full mb-6">
            <span className="text-accent font-mono text-xs tracking-[0.2em] uppercase font-medium">
              Por Qué Elegirnos
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6">
            EXCELENCIA EN <span className="text-accent">CADA DETALLE</span>
          </h2>
          <p className="text-base md:text-xl text-primary-foreground/80 font-mono max-w-3xl mx-auto leading-relaxed">
            Más que un gimnasio, una familia dedicada a tu transformación física y mental
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group p-8 lg:p-10 bg-primary-foreground/5 backdrop-blur-sm border-2 border-primary-foreground/10 hover:border-accent hover:bg-primary-foreground/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-primary-foreground group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/70 font-mono text-sm leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
