"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary/80 z-10" />
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
          <source src="/placeholder.mp4?height=1080&width=1920&query=boxing+training+intense" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary/90 z-10" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 z-20 text-center pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-primary/30 backdrop-blur-md border border-accent/30 rounded-full mb-8">
              <span className="text-accent font-mono text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                Academia de Élite Mundial
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-primary-foreground mb-8 tracking-tight leading-[0.95]">
              ENTRENA COMO UN
              <span className="text-accent block mt-4 animate-shimmer bg-gradient-to-r from-accent via-yellow-300 to-accent bg-[length:200%_auto] bg-clip-text text-transparent">
                CAMPEÓN
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary-foreground/90 mb-12 font-light max-w-4xl mx-auto leading-relaxed px-4">
              Descubre el arte del boxeo con entrenadores de élite mundial.
              <span className="block mt-2 text-accent/90">Fuerza, técnica y disciplina en cada golpe.</span>
            </p>

            {/* CTA Buttons - Mejor espaciado y diseño más elegante */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-20 px-4">
              <Link href="/clases" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-base md:text-lg px-8 md:px-12 py-6 md:py-7 font-mono tracking-wider group shadow-2xl shadow-accent/30 hover:scale-[1.02] transition-all duration-300"
                >
                  RESERVAR CLASE
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-primary-foreground/80 text-primary-foreground hover:bg-primary-foreground/10 hover:border-accent text-base md:text-lg px-8 md:px-12 py-6 md:py-7 font-mono tracking-wider bg-transparent backdrop-blur-sm group transition-all duration-300"
              >
                <Play className="mr-3 group-hover:scale-110 transition-transform" size={20} />
                VER VIDEO
              </Button>
            </div>
          </div>

          {/* Stats - Grid mejorado con mejor espaciado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mt-16 px-4">
            <div className="group text-center hover:scale-105 transition-all duration-300 bg-primary/30 backdrop-blur-lg border border-accent/20 rounded-2xl p-8 lg:p-10">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent mb-4 group-hover:scale-110 transition-transform">
                15+
              </div>
              <div className="text-xs md:text-sm font-mono text-primary-foreground/80 tracking-[0.15em] uppercase">
                Años de Experiencia
              </div>
            </div>
            <div className="group text-center hover:scale-105 transition-all duration-300 bg-primary/30 backdrop-blur-lg border border-accent/20 rounded-2xl p-8 lg:p-10">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent mb-4 group-hover:scale-110 transition-transform">
                500+
              </div>
              <div className="text-xs md:text-sm font-mono text-primary-foreground/80 tracking-[0.15em] uppercase">
                Alumnos Activos
              </div>
            </div>
            <div className="group text-center hover:scale-105 transition-all duration-300 bg-primary/30 backdrop-blur-lg border border-accent/20 rounded-2xl p-8 lg:p-10">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent mb-4 group-hover:scale-110 transition-transform">
                50+
              </div>
              <div className="text-xs md:text-sm font-mono text-primary-foreground/80 tracking-[0.15em] uppercase">
                Campeones Formados
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-7 h-12 border-2 border-accent/60 rounded-full flex items-start justify-center p-2 backdrop-blur-sm bg-primary/20">
          <div className="w-2 h-3 bg-accent rounded-full animate-pulse-slow" />
        </div>
      </div>
    </section>
  )
}
