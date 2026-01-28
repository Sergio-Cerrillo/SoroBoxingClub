"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, MapPin } from "lucide-react"

const schedules = [
  {
    day: "Lunes",
    classes: [
      { time: "06:00 - 07:00", name: "Boxeo Técnico", level: "Avanzado", spots: 8 },
      { time: "18:00 - 19:00", name: "Principiantes", level: "Inicial", spots: 12 },
      { time: "19:30 - 20:30", name: "Sparring", level: "Intermedio", spots: 10 },
    ],
  },
  {
    day: "Martes",
    classes: [
      { time: "07:00 - 08:00", name: "Cardio Boxing", level: "Todos", spots: 15 },
      { time: "18:00 - 19:00", name: "Técnica Avanzada", level: "Avanzado", spots: 8 },
      { time: "20:00 - 21:00", name: "Acondicionamiento", level: "Intermedio", spots: 12 },
    ],
  },
  {
    day: "Miércoles",
    classes: [
      { time: "06:00 - 07:00", name: "Boxeo Técnico", level: "Avanzado", spots: 8 },
      { time: "18:00 - 19:00", name: "Principiantes", level: "Inicial", spots: 12 },
      { time: "19:30 - 20:30", name: "Sparring", level: "Intermedio", spots: 10 },
    ],
  },
  {
    day: "Jueves",
    classes: [
      { time: "07:00 - 08:00", name: "Cardio Boxing", level: "Todos", spots: 15 },
      { time: "18:00 - 19:00", name: "Técnica Avanzada", level: "Avanzado", spots: 8 },
      { time: "20:00 - 21:00", name: "Combate Competitivo", level: "Profesional", spots: 6 },
    ],
  },
  {
    day: "Viernes",
    classes: [
      { time: "06:00 - 07:00", name: "Entrenamiento Integral", level: "Todos", spots: 15 },
      { time: "18:00 - 19:00", name: "Principiantes", level: "Inicial", spots: 12 },
      { time: "19:30 - 20:30", name: "Open Gym", level: "Todos", spots: 20 },
    ],
  },
  {
    day: "Sábado",
    classes: [
      { time: "09:00 - 10:00", name: "Clase Familiar", level: "Todos", spots: 20 },
      { time: "10:30 - 12:00", name: "Sparring Libre", level: "Intermedio+", spots: 12 },
    ],
  },
]

export function ScheduleSection() {
  const [selectedDay, setSelectedDay] = useState("Lunes")

  const currentSchedule = schedules.find((s) => s.day === selectedDay)

  return (
    <section id="horarios" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            HORARIOS <span className="text-accent">DE CLASES</span>
          </h2>
          <p className="text-lg text-muted-foreground font-mono max-w-2xl mx-auto">
            {"Encuentra el horario perfecto que se adapte a tu rutina"}
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {schedules.map((schedule) => (
            <Button
              key={schedule.day}
              variant={selectedDay === schedule.day ? "default" : "outline"}
              onClick={() => setSelectedDay(schedule.day)}
              className={`font-mono tracking-wide ${
                selectedDay === schedule.day
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "border-2 border-foreground/20 hover:border-accent"
              }`}
            >
              {schedule.day}
            </Button>
          ))}
        </div>

        {/* Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {currentSchedule?.classes.map((classItem, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent bg-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">{classItem.name}</h3>
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-mono tracking-wide">
                    {classItem.level}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  {classItem.time}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
                  <Users className="w-4 h-4 text-accent" />
                  {classItem.spots} plazas disponibles
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
                  <MapPin className="w-4 h-4 text-accent" />
                  Soro Boxing Gym
                </div>
              </div>

              <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-wide">
                RESERVAR
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
