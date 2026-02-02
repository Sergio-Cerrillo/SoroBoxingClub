"use client"

import { m } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Reveal, ParallaxScale, TextReveal } from "@/components/motion"
import { motionConfig } from "@/lib/motion/config"

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      {/* Imagen de fondo con parallax */}
      <ParallaxScale scaleRange={[1, 1.15]}>
        <div className="absolute inset-0 z-0">
          <Image
            src="/_ (2).jpeg"
            alt="Background"
            fill
            className="object-cover"
            priority={false}
          />
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/80" />
          {/* Degradado inferior de transparente a negro */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-black/70 to-black" />
        </div>
      </ParallaxScale>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal direction="scale" delay={0.1}>
            <div className="inline-block px-6 py-2 bg-accent/20 border border-accent/40 rounded-full mb-8">
              <span className="text-accent font-mono text-xs tracking-[0.2em] uppercase font-medium">Únete Hoy</span>
            </div>
          </Reveal>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            <TextReveal delay={0.2} staggerDelay={0.08}>
              ¿LISTO PARA
            </TextReveal>
            <span className="text-accent block mt-2">
              <TextReveal delay={0.5} staggerDelay={0.08}>
                TRANSFORMARTE?
              </TextReveal>
            </span>
          </h2>

          <Reveal direction="up" delay={0.8}>
            <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/90 mb-12 font-mono leading-relaxed max-w-3xl mx-auto px-4">
              Únete a Soro Boxing y descubre tu verdadero potencial.
            </p>
          </Reveal>

          <Reveal direction="scale" delay={1}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-20 px-4">
              <Link href="/contacto" className="w-full sm:w-auto">
                <m.div
                  whileHover={{ scale: 1.08, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={motionConfig.easing.spring}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-base md:text-lg px-8 md:px-12 py-6 md:py-7 font-mono tracking-wider group shadow-2xl shadow-accent/50"
                  >
                    EMPEZAR HOY
                    <m.span
                      className="ml-3 inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight size={20} />
                    </m.span>
                  </Button>
                </m.div>
              </Link>
            </div>
          </Reveal>

          {/* Trust Indicators */}
          <Reveal direction="up" delay={1.2}>
            <div className="pt-16 border-t border-primary-foreground/20">
              <p className="text-primary-foreground/70 font-mono text-xs md:text-sm mb-8 tracking-[0.15em] uppercase">
                Entrena con los Mejores
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
                <m.div
                  className="text-primary-foreground/80 font-bold text-sm md:text-lg lg:text-xl font-mono tracking-wider"
                  whileHover={{ scale: 1.1, color: "rgb(218, 165, 32)" }}
                  transition={{ duration: 0.2 }}
                >
                  FEDERACIÓN NACIONAL
                </m.div>
                <m.div
                  className="text-primary-foreground/80 font-bold text-sm md:text-lg lg:text-xl font-mono tracking-wider"
                  whileHover={{ scale: 1.1, color: "rgb(218, 165, 32)" }}
                  transition={{ duration: 0.2 }}
                >
                  WBC CERTIFICADO
                </m.div>
                <m.div
                  className="text-primary-foreground/80 font-bold text-sm md:text-lg lg:text-xl font-mono tracking-wider"
                  whileHover={{ scale: 1.1, color: "rgb(218, 165, 32)" }}
                  transition={{ duration: 0.2 }}
                >
                  CAMPEONES OLÍMPICOS
                </m.div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
