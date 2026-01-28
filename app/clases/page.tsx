"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, Calendar, User as UserIcon, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Class {
  id: string
  title: string
  professor: string
  starts_at: string
  duration_minutes: number
  capacity: number
  status: 'active' | 'cancelled'
  created_at: string
  updated_at: string
  bookings?: Array<{
    id: string
    profile_id: string
    status: string
  }>
}

export default function ClasesPage() {
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return dayNames[new Date().getDay()]
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes")
        if (response.ok) {
          const data = await response.json()
          setClasses(data.classes || [])
        } else {
          setError("Error al cargar las clases")
        }
      } catch (err) {
        console.error("Error fetching classes:", err)
        setError("Error de conexión")
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchClasses()
    }
  }, [isAuthenticated])

  const handleBookClass = async (classId: string) => {
    try {
      const response = await fetch(`/api/classes/${classId}/book`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        alert('¡Reserva realizada con éxito!')
        // Recargar clases
        const classesResponse = await fetch("/api/classes")
        if (classesResponse.ok) {
          const classesData = await classesResponse.json()
          setClasses(classesData.classes || [])
        }
      } else {
        alert(data.error || 'Error al realizar la reserva')
      }
    } catch (error) {
      console.error('Error booking class:', error)
      alert('Error al realizar la reserva')
    }
  }

  const handleCancelBooking = async (classId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return
    }

    try {
      const response = await fetch(`/api/classes/${classId}/book`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        alert('Reserva cancelada con éxito')
        // Recargar clases
        const classesResponse = await fetch("/api/classes")
        if (classesResponse.ok) {
          const classesData = await classesResponse.json()
          setClasses(classesData.classes || [])
        }
      } else {
        alert(data.error || 'Error al cancelar la reserva')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Error al cancelar la reserva')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">Cargando clases...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Agrupar clases por día
  const classesByDay: Record<string, Class[]> = {}
  classes.forEach((classItem) => {
    const date = new Date(classItem.starts_at)
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const dayName = dayNames[date.getDay()]

    if (!classesByDay[dayName]) {
      classesByDay[dayName] = []
    }
    classesByDay[dayName].push(classItem)
  })

  // Ordenar clases dentro de cada día por hora
  Object.keys(classesByDay).forEach((day) => {
    classesByDay[day].sort((a, b) =>
      new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
    )
  })

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
    }
    return `${mins}min`
  }

  const days = Object.keys(classesByDay).sort((a, b) => {
    const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    return dayOrder.indexOf(a) - dayOrder.indexOf(b)
  })

  const filteredClasses = classesByDay[selectedDay] || []

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-12 bg-gradient-to-b from-primary to-primary/95 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 animate-fade-in-up">
              CLASES <span className="text-accent">DISPONIBLES</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 font-mono">
              Consulta los horarios y reserva tu clase
            </p>

            {user && (
              <div className="mt-6 inline-block bg-background/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <p className="text-sm text-primary-foreground/90 font-mono">
                  Bienvenido/a, <span className="font-bold">{user.first_name || user.dni}</span>
                  {isAdmin && <Badge className="ml-2 bg-accent text-black">ADMIN</Badge>}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center">
              {error}
            </div>
          )}

          {classes.length === 0 ? (
            <Card className="p-12 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-2">No hay clases disponibles</h3>
              <p className="text-muted-foreground">
                Por el momento no hay clases programadas. Vuelve pronto para ver nuevas clases.
              </p>
            </Card>
          ) : (
            <>
              {/* Filtros por día */}
              {days.length > 0 && (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {days.map((day) => (
                      <Button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        variant={selectedDay === day ? "default" : "outline"}
                        className={selectedDay === day ? "bg-accent text-black hover:bg-accent/90" : ""}
                      >
                        {day} ({classesByDay[day].length})
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid de clases */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((classItem) => {
                  const userBooking = classItem.bookings?.find(
                    (b) => b.profile_id === user?.id && b.status === 'active'
                  )
                  const currentBookings = classItem.bookings?.filter((b) => b.status === 'active').length || 0
                  const spotsLeft = classItem.capacity - currentBookings
                  const isFull = spotsLeft <= 0

                  return (
                    <Card key={classItem.id} className="p-6 hover:border-accent/50 transition-all">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{classItem.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(classItem.starts_at)}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge variant="outline" className="ml-2">
                              {classItem.status === 'active' ? 'Activa' : 'Cancelada'}
                            </Badge>
                            {userBooking && (
                              <Badge className="bg-accent text-black">
                                Inscrito
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-accent" />
                            <span className="font-mono">
                              {formatTime(classItem.starts_at)} ({formatDuration(classItem.duration_minutes)})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <UserIcon className="w-4 h-4 text-accent" />
                            <span>
                              <span className="font-semibold">{classItem.professor}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-accent" />
                            <span>
                              {currentBookings}/{classItem.capacity} •
                              <span className={`font-semibold ml-1 ${isFull ? 'text-red-500' : spotsLeft <= 3 ? 'text-yellow-500' : 'text-green-500'
                                }`}>
                                {isFull ? 'Completa' : `${spotsLeft} ${spotsLeft === 1 ? 'plaza' : 'plazas'}`}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-4">
                          {classItem.status === 'active' ? (
                            userBooking ? (
                              <Button
                                className="w-full"
                                variant="destructive"
                                onClick={() => handleCancelBooking(classItem.id)}
                              >
                                Cancelar Reserva
                              </Button>
                            ) : isFull ? (
                              <Button className="w-full" variant="outline" disabled>
                                Clase Completa
                              </Button>
                            ) : (
                              <Button
                                className="w-full bg-accent text-black hover:bg-accent/90"
                                onClick={() => handleBookClass(classItem.id)}
                              >
                                Reservar Plaza
                              </Button>
                            )
                          ) : (
                            <Button className="w-full" variant="outline" disabled>
                              Clase cancelada
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
