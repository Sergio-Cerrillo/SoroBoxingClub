"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trophy, Users } from "lucide-react"

const fights = [
  {
    title: "Torneo Primavera 2025",
    date: "15 de Marzo, 2025",
    location: "Arena Soro Boxing",
    category: "Amateur",
    participants: "32 boxeadores",
    prize: "€5,000",
    status: "Inscripciones abiertas",
  },
  {
    title: "Campeonato Regional",
    date: "22 de Abril, 2025",
    location: "Palacio de Deportes",
    category: "Semi-profesional",
    participants: "16 boxeadores",
    prize: "€10,000",
    status: "Próximamente",
  },
  {
    title: "Copa Soro Boxing",
    date: "10 de Mayo, 2025",
    location: "Arena Soro Boxing",
    category: "Todos los niveles",
    participants: "48 boxeadores",
    prize: "€3,000",
    status: "Inscripciones abiertas",
  },
]

export function FightsSection() {
  return (
    <section id="combates" className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            PRÓXIMOS <span className="text-accent">COMBATES</span>
          </h2>
          <p className="text-lg text-primary-foreground/80 font-mono max-w-2xl mx-auto">
            {"Demuestra tu talento y compite con los mejores boxeadores"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {fights.map((fight, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-accent/20 hover:border-accent bg-card"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-mono tracking-wide">
                    {fight.category}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-mono tracking-wide ${
                      fight.status === "Inscripciones abiertas"
                        ? "bg-accent/10 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {fight.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-2">{fight.title}</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="font-mono text-sm text-card-foreground">{fight.date}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="font-mono text-sm text-card-foreground">{fight.location}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="font-mono text-sm text-card-foreground">{fight.participants}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="font-mono text-sm text-card-foreground">Premio: {fight.prize}</span>
                </div>
              </div>

              <Button
                className={`w-full font-mono tracking-wide ${
                  fight.status === "Inscripciones abiertas"
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                disabled={fight.status !== "Inscripciones abiertas"}
              >
                {fight.status === "Inscripciones abiertas" ? "INSCRIBIRME" : "PRÓXIMAMENTE"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
