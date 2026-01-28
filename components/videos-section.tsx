"use client"

import { Card } from "@/components/ui/card"
import { Play, Clock } from "lucide-react"

const videos = [
  {
    title: "Técnica de Jab Perfecto",
    duration: "12:45",
    thumbnail: "boxing+jab+technique+training",
    category: "Técnica Básica",
  },
  {
    title: "Combinaciones Avanzadas",
    duration: "18:30",
    thumbnail: "boxing+combinations+professional",
    category: "Avanzado",
  },
  {
    title: "Footwork y Movimiento",
    duration: "15:20",
    thumbnail: "boxer+footwork+training+gym",
    category: "Fundamentos",
  },
  {
    title: "Defensa y Esquivas",
    duration: "14:15",
    thumbnail: "boxing+defense+technique",
    category: "Defensa",
  },
  {
    title: "Entrenamiento de Potencia",
    duration: "20:00",
    thumbnail: "boxer+power+training+heavy+bag",
    category: "Acondicionamiento",
  },
  {
    title: "Estrategias de Combate",
    duration: "22:10",
    thumbnail: "boxing+match+strategy+ring",
    category: "Combate",
  },
]

export function VideosSection() {
  return (
    <section id="videos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            VIDEOS <span className="text-accent">DE TÉCNICA</span>
          </h2>
          <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
            {"Aprende de los mejores con nuestros tutoriales profesionales"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-accent bg-card cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={`/.jpg?height=400&width=600&query=${video.thumbnail}`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/60 group-hover:bg-primary/40 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-accent-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-mono tracking-wide">
                    {video.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-1 bg-primary/90 px-2 py-1 text-primary-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-mono">{video.duration}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors">
                  {video.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
