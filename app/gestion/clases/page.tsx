"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, Users, Award, Plus, TrendingUp, User, Trash2 } from "lucide-react"

interface Class {
  id: string
  title: string
  professor: string
  starts_at: string
  duration_minutes: number
  capacity: number
  status: string
  created_at: string
  day_of_week?: number
}

interface ClassBooking {
  id: string
  profile_id: string
  status: string
  profiles: {
    full_name: string
    email: string
  }
}

interface ClassWithBookings extends Class {
  bookings: ClassBooking[]
}

const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const spanishDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function GestionClasesPage() {
  const { user, isAuthenticated, isManager } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [classes, setClasses] = useState<ClassWithBookings[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>("Lunes")
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [classToCancel, setClassToCancel] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    professor: "",
    days_of_week: [] as number[],
    time: "",
    duration_minutes: "60",
    capacity: "20",
    recurring_weeks: "1",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isManager) {
      router.push("/")
      return
    }

    loadClasses()
  }, [isAuthenticated, isManager, router, pathname])

  const loadClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes || [])
      } else {
        console.error("Error loading classes:", response.statusText)
      }
    } catch (error) {
      console.error("Error loading classes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/admin/classes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await loadClasses()
        setShowForm(false)
        setFormData({
          title: "",
          professor: "",
          days_of_week: [],
          time: "",
          duration_minutes: "60",
          capacity: "20",
          recurring_weeks: "1",
        })
      } else {
        console.error("Error creating class:", response.statusText)
      }
    } catch (error) {
      console.error("Error creating class:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleDay = (dayNumber: number) => {
    setFormData((prev) => {
      const isSelected = prev.days_of_week.includes(dayNumber)
      return {
        ...prev,
        days_of_week: isSelected
          ? prev.days_of_week.filter((d) => d !== dayNumber)
          : [...prev.days_of_week, dayNumber].sort(),
      }
    })
  }

  const handleCancelClass = async (classId: string) => {
    try {
      const response = await fetch(`/api/admin/classes/${classId}/cancel`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadClasses()
        setClassToCancel(null)
      } else {
        console.error("Error cancelling class:", response.statusText)
      }
    } catch (error) {
      console.error("Error cancelling class:", error)
    }
  }

  if (!user || !isManager) {
    return null
  }

  // Helper to get day of week from ISO date
  const getDayOfWeek = (isoDate: string) => {
    const date = new Date(isoDate)
    return daysOfWeek[date.getDay()]
  }

  // Filter classes by selected day
  const filteredClasses = classes.filter((c) => getDayOfWeek(c.starts_at) === selectedDay)

  // Get current week's classes for stats (Monday to Sunday)
  const now = new Date()
  const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, ...
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() + mondayOffset)
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  const weeklyClasses = classes.filter((c) => {
    const classDate = new Date(c.starts_at)
    return classDate >= startOfWeek && classDate <= endOfWeek
  })

  // Stats based on all active classes
  const activeClasses = classes.filter(c => c.status === 'active')
  const totalClasses = activeClasses.length
  const totalCapacity = activeClasses.reduce((sum, c) => sum + c.capacity, 0)
  const totalEnrolled = activeClasses.reduce((sum, c) => {
    // bookings ya vienen filtradas por cancelled_at null desde la API
    const enrolled = c.bookings?.length || 0
    return sum + enrolled
  }, 0)
  const averageOccupancy = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
    }
    return `${minutes} min`
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/95 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-accent/20 backdrop-blur-sm border border-accent/50 rounded-full mb-6">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-accent font-mono text-sm tracking-widest">GESTIÓN DE CLASES</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4">
              ADMINISTRACIÓN <span className="text-accent">HORARIOS</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 font-mono">
              Crea, edita y gestiona el horario de clases del gimnasio
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
            <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6 text-center">
              <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold text-accent mb-2">{totalClasses}</div>
              <div className="text-sm font-mono text-primary-foreground/70">Clases Activas</div>
            </div>
            <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold text-accent mb-2">{totalCapacity}</div>
              <div className="text-sm font-mono text-primary-foreground/70">Aforo Total</div>
            </div>
            <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold text-accent mb-2">{totalEnrolled}</div>
              <div className="text-sm font-mono text-primary-foreground/70">Plazas Ocupadas</div>
            </div>
            <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6 text-center">
              <Award className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold text-accent mb-2">{averageOccupancy}%</div>
              <div className="text-sm font-mono text-primary-foreground/70">Ocupación Media</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-muted/50 border-b border-border sticky top-20 z-40 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {spanishDays.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  onClick={() => setSelectedDay(day)}
                  className={`font-mono tracking-wide transition-all ${selectedDay === day
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "border-2 hover:border-accent"
                    }`}
                >
                  {day}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-mono"
            >
              <Plus className="w-4 h-4 mr-2" />
              AÑADIR CLASE
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Create Class Form */}
          {showForm && (
            <Card className="p-8 mb-8 border-2 border-accent max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-6">Añadir Nueva Clase</h3>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-mono">NOMBRE DE LA CLASE</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: Boxeo Avanzado"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="professor" className="text-sm font-mono">ENTRENADOR</Label>
                    <Input
                      id="professor"
                      value={formData.professor}
                      onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                      placeholder="Nombre del entrenador"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-sm font-mono">DÍAS DE LA SEMANA (selecciona uno o varios)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {spanishDays.map((day, index) => {
                        const dayNumber = index + 1
                        const isSelected = formData.days_of_week.includes(dayNumber)
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(dayNumber)}
                            className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${isSelected
                              ? "bg-accent text-accent-foreground border-2 border-accent"
                              : "bg-secondary text-secondary-foreground border-2 border-transparent hover:border-accent/50"
                              }`}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                    {formData.days_of_week.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-2">* Debes seleccionar al menos un día</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="time" className="text-sm font-mono">HORA DE INICIO</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration_minutes" className="text-sm font-mono">DURACIÓN (minutos)</Label>
                    <Input
                      id="duration_minutes"
                      type="number"
                      min="15"
                      step="15"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="capacity" className="text-sm font-mono">AFORO MÁXIMO</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="recurring_weeks" className="text-sm font-mono">REPETIR DURANTE (semanas)</Label>
                    <Input
                      id="recurring_weeks"
                      type="number"
                      min="1"
                      max="52"
                      value={formData.recurring_weeks}
                      onChange={(e) => setFormData({ ...formData, recurring_weeks: e.target.value })}
                      className="mt-2"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Se crearán {formData.days_of_week.length} clase(s) × {formData.recurring_weeks} semana(s) = {formData.days_of_week.length * parseInt(formData.recurring_weeks || "1")} clases totales
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-mono"
                  >
                    {submitting ? "GUARDANDO..." : "GUARDAR CLASE"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
                    className="flex-1 font-mono"
                  >
                    CANCELAR
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Classes List */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Clases del {selectedDay} ({filteredClasses.length})
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-xl text-muted-foreground font-mono">No hay clases programadas para este día</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredClasses.map((cls) => {
                  // bookings ya vienen filtradas por cancelled_at null desde la API
                  const activeBookings = cls.bookings || []
                  const occupancyPercent = Math.round((activeBookings.length / cls.capacity) * 100)

                  return (
                    <Card key={cls.id} className="p-6 border-2 hover:border-accent transition-all">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Side - Class Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground mb-2">{cls.title}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="border-accent text-accent">
                                  {cls.professor}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setClassToCancel(cls.id)}
                              className="font-mono"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              CANCELAR
                            </Button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-muted-foreground font-mono">
                              <Clock className="w-4 h-4 text-accent" />
                              {formatTime(cls.starts_at)} ({cls.duration_minutes}min)
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground font-mono">
                              <Award className="w-4 h-4 text-accent" />
                              {cls.professor}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground font-mono">
                              <Users className="w-4 h-4 text-accent" />
                              {activeBookings.length}/{cls.capacity} plazas
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono text-muted-foreground">OCUPACIÓN</span>
                              <span className="text-sm font-mono font-bold text-accent">{occupancyPercent}%</span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                              <div
                                className="h-full bg-accent transition-all"
                                style={{ width: `${occupancyPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Side - Enrolled Users */}
                        <div className="lg:w-96 border-l border-border pl-6">
                          <h4 className="text-sm font-mono tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-accent" />
                            ALUMNOS INSCRITOS ({activeBookings.length})
                          </h4>
                          {activeBookings.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {activeBookings.map((booking) => (
                                <div
                                  key={booking.id}
                                  className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                                >
                                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-accent">
                                      {getInitials(booking.profiles.full_name)}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground">{booking.profiles.full_name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{booking.profiles.email}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No hay alumnos inscritos</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!classToCancel} onOpenChange={(open) => !open && setClassToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar esta clase?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cancelará la clase y notificará automáticamente a todos los alumnos inscritos.
              Los alumnos ya no verán esta clase en su horario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">No, mantener clase</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => classToCancel && handleCancelClass(classToCancel)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-mono"
            >
              Sí, cancelar clase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </main>
  )
}
