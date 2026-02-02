"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Martínez",
    role: "Campeón Nacional Amateur",
    image: "/sacos1.jpg",
    rating: 5,
    text: "Soro Boxing transformó completamente mi técnica y mentalidad. Los entrenadores son verdaderos profesionales que se preocupan por tu progreso.",
  },
  {
    name: "Laura Sánchez",
    role: "Alumna desde 2022",
    image: "/ring1.jpg",
    rating: 5,
    text: "Nunca pensé que el boxeo sería para mí, pero aquí encontré una familia. He ganado confianza, fuerza y disciplina que aplico en toda mi vida.",
  },
  {
    name: "Miguel Ángel Torres",
    role: "Profesional Competitivo",
    image: "/andreu.JPG",
    rating: 5,
    text: "Las instalaciones son de primer nivel y el nivel de entrenamiento es comparable a cualquier gimnasio internacional. Recomendado 100%.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-32 bg-muted/50 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
            <span className="text-accent font-mono text-sm tracking-widest">TESTIMONIOS</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            LO QUE DICEN <span className="text-accent">NUESTROS CAMPEONES</span>
          </h2>
          <p className="text-xl text-muted-foreground font-mono max-w-3xl mx-auto">
            Historias reales de transformación y éxito
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-accent group animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/20 group-hover:ring-accent transition-all"
                />
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-accent transition-colors">
                    {testimonial.name}
                  </h4>
                  <p className="text-muted-foreground font-mono text-xs">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust badge */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground font-mono text-sm mb-4">MÁS DE 150 HISTORIAS DE ÉXITO</p>
          <div className="flex justify-center items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-accent text-accent" />
            ))}
            <span className="ml-3 text-2xl font-bold text-foreground">4.9/5</span>
            <span className="text-muted-foreground font-mono text-sm">(150+ reseñas)</span>
          </div>
        </div>
      </div>
    </section>
  )
}
