"use client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export default function GaleriaPage() {
  const instalaciones = [
    {
      title: "Ring Principal",
      image: "/professional-boxing-ring-gym.jpg",
    },
    {
      title: "Zona de Sacos",
      image: "/boxing-heavy-bags-training-area.jpg",
    },
    {
      title: "Área de Fitness",
      image: "/modern-gym-fitness-area.jpg",
    },
    {
      title: "Vestuarios Premium",
      image: "/luxury-gym-locker-room.jpg",
    },
    {
      title: "Zona de Entrenamiento",
      image: "/boxing-training-floor-equipment.jpg",
    },
    {
      title: "Recepción",
      image: "/modern-gym-reception-entrance.jpg",
    },
  ]

  const combates = [
    {
      title: "Torneo Amateur 2024",
      image: "/boxing-match-ring-action.jpg",
    },
    {
      title: "Combate Profesional",
      image: "/professional-boxing-fight-intense.jpg",
    },
    {
      title: "Campeonato Nacional",
      image: "/boxing-championship-celebration.jpg",
    },
    {
      title: "Sparring de Elite",
      image: "/boxing-sparring-training-session.jpg",
    },
    {
      title: "Victoria por KO",
      image: "/placeholder-al94q.png",
    },
    {
      title: "Gala de Boxeo",
      image: "/boxing-event-arena-crowd.jpg",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-accent text-accent-foreground">GALERÍA</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary-foreground">
              Nuestras <span className="text-accent">Instalaciones</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Descubre el mejor equipamiento y los momentos más épicos de Soro Boxing.
            </p>
          </div>
        </div>
      </section>

      {/* Galería con Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="instalaciones" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="instalaciones" className="font-mono">
                INSTALACIONES
              </TabsTrigger>
              <TabsTrigger value="combates" className="font-mono">
                COMBATES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="instalaciones">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instalaciones.map((item, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden bg-card border-border hover:border-accent transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold text-primary-foreground">{item.title}</h3>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="combates">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {combates.map((item, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden bg-card border-border hover:border-accent transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold text-primary-foreground">{item.title}</h3>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  )
}
