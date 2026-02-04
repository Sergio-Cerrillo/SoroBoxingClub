"use client"

import { m } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Dumbbell, Users, Video, Trophy, PersonStanding } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Stagger, StaggerItem, Reveal } from "@/components/motion"
import { motionConfig } from "@/lib/motion/config"

const services = [
  {
    icon: Dumbbell,
    title: "Entrenamiento de pesas",
    description: "Accede a la zona de pesas de manera libre.",
    link: "/contacto",
  },
  {
    icon: Users,
    title: "Clases Grupales",
    description: "Entrena con otros boxeadores en un ambiente motivador, competitivo y lleno de energía positiva.",
    link: "/contacto",
  },
  {
    icon: PersonStanding,
    title: "Clases para todos los niveles",
    description: "No te presiones, te acompañaremos en tu trayectoria seas del nivel que seas.",
    link: "/contacto",
  },
  {
    icon: Trophy,
    title: "Preparación para Combates",
    description:
      "Programa intensivo profesional para competidores que buscan destacar en el ring y alcanzar la gloria.",
    link: "/contacto",
  },
]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-24 lg:py-32 pb-40 lg:pb-48 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <Reveal direction="down" delay={0.1}>
            <div className="inline-block px-6 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <span className="text-accent font-mono text-xs tracking-[0.2em] uppercase font-medium">
                Nuestros Programas
              </span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              ENTRENA A TU <span className="text-accent">MANERA</span>
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <p className="text-base md:text-lg text-muted-foreground font-mono max-w-3xl mx-auto leading-relaxed">
              Programas diseñados para todos los niveles, desde principiantes hasta profesionales
            </p>
          </Reveal>
        </div>

        <Stagger staggerDelay={motionConfig.stagger.normal} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <StaggerItem key={index} direction="up">
              <m.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={motionConfig.easing.spring}
                className="h-full"
              >
                <Card className="group p-8 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl hover:from-white/50 hover:via-white/40 hover:to-white/30 transition-all duration-500 shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_70px_rgba(251,191,36,0.25)] h-full flex flex-col rounded-[28px] border border-amber-500/20 hover:border-amber-500/40">
                  {/* Icon */}
                  <div className="mb-6">
                    <m.div
                      className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-all duration-300"
                      whileHover={{ rotate: 360, scale: 1.15 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <service.icon className="w-8 h-8 text-accent group-hover:text-accent-foreground transition-colors" />
                    </m.div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-6 flex-1">{service.description}</p>

                  <Link href={service.link}>
                    <m.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                      <Button
                        variant="ghost"
                        className="w-full justify-center bg-gradient-to-r from-white/40 to-white/30 backdrop-blur-md border border-amber-500/20 hover:border-amber-500/40 text-accent hover:text-accent hover:bg-white/50 font-mono text-sm group/btn rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all"
                      >
                        Más información
                        <span className="ml-2 group-hover/btn:translate-x-1 transition-transform">→</span>
                      </Button>
                    </m.div>
                  </Link>
                </Card>
              </m.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
