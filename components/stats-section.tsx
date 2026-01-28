"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Trophy, Calendar } from "lucide-react"

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <Card className="p-8 text-center border-2 hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-accent" />
            </div>
            <div className="text-5xl font-bold text-accent mb-3">15+</div>
            <div className="text-sm font-mono text-muted-foreground tracking-wider uppercase">Años Experiencia</div>
          </Card>

          <Card className="p-8 text-center border-2 hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-accent" />
            </div>
            <div className="text-5xl font-bold text-accent mb-3">500+</div>
            <div className="text-sm font-mono text-muted-foreground tracking-wider uppercase">Alumnos Activos</div>
          </Card>

          <Card className="p-8 text-center border-2 hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-accent" />
            </div>
            <div className="text-5xl font-bold text-accent mb-3">50+</div>
            <div className="text-sm font-mono text-muted-foreground tracking-wider uppercase">Campeones Formados</div>
          </Card>

          <Card className="p-8 text-center border-2 hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
            <div className="text-5xl font-bold text-accent mb-3">98%</div>
            <div className="text-sm font-mono text-muted-foreground tracking-wider uppercase">Satisfacción</div>
          </Card>
        </div>
      </div>
    </section>
  )
}
