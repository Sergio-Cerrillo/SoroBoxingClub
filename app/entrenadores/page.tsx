import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Target, Trophy } from "lucide-react"

export default function EntrenadoresPage() {
  const entrenadores = [
    {
      nombre: "Ilia Topuria",
      titulo: "Campeón UFC Peso Pluma",
      especialidad: "MMA & Boxeo Elite",
      logros: ["Campeón UFC", "Invicto 15-0", "Maestro en striking"],
      image: "/ilia-topuria-fighter-portrait.jpg",
      descripcion: "Campeón mundial de UFC, especialista en técnicas de striking y boxeo de elite.",
    },
    {
      nombre: "Javier Pardo",
      titulo: "Entrenador Principal",
      especialidad: "Boxeo Técnico & Estrategia",
      logros: ["20 años experiencia", "Entrenador nacional", "Formador de campeones"],
      image: "/professional-boxing-coach.png",
      descripcion: "Maestro en técnica de boxeo con más de dos décadas formando campeones profesionales.",
    },
    {
      nombre: "Maravilla Alonso",
      titulo: "Campeón Nacional",
      especialidad: "Boxeo de Combate & Competición",
      logros: ["Ex campeón nacional", "50+ combates", "Entrenador olímpico"],
      image: "/champion-boxer-portrait.jpg",
      descripcion: "Ex campeón nacional con vasta experiencia en preparación para combates de alto nivel.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-accent text-accent-foreground">NUESTRO EQUIPO</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary-foreground">
              Entrenadores <span className="text-accent">de Elite</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Aprende de los mejores. Nuestro equipo de campeones y maestros del boxeo te guiarán hacia la excelencia.
            </p>
          </div>
        </div>
      </section>

      {/* Entrenadores Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {entrenadores.map((entrenador, index) => (
              <Card
                key={index}
                className="group overflow-hidden bg-card border-border hover:border-accent transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={entrenador.image || "/placeholder.svg"}
                    alt={entrenador.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-primary-foreground mb-1">{entrenador.nombre}</h3>
                    <p className="text-accent font-mono text-sm">{entrenador.titulo}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-accent" />
                    <p className="font-mono text-sm text-foreground">{entrenador.especialidad}</p>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">{entrenador.descripcion}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="font-mono text-xs text-accent">LOGROS DESTACADOS</span>
                    </div>
                    {entrenador.logros.map((logro, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Trophy className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{logro}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
