import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Target, Trophy } from "lucide-react"

export default function EntrenadoresPage() {
  const entrenadores = [
    {
      nombre: "Andreu Noguera",
      titulo: "Entrenador Principal & Fundador de Soro Boxing Club",
      especialidad: "Bi-campeón de Baleares",
      logros: ["+20 años de experiencia", "+19 combates", "Maestro de boxeo"],
      image: "/andreu.JPG",
      descripcion: "Especialista en boxeo y estrategia de combate.",
    }
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/entrenadores.JPG')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-black" />

        <div className="container mx-auto px-4 z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 backdrop-blur-md border border-accent/30 rounded-full mb-8">
              <span className="text-accent font-mono text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                NUESTRO EQUIPO
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary-foreground tracking-tight leading-tight">
              ENTRENADORES{" "}
              <span className="animate-shimmer bg-gradient-to-r from-accent via-yellow-300 to-accent bg-[length:200%_auto] bg-clip-text text-transparent">
                DE ELITE
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/90 leading-relaxed font-light max-w-3xl mx-auto">
              Aprende de los mejores. Conviértete en uno de ellos.
            </p>
          </div>
        </div>
      </section>

      {/* Entrenadores Grid */}
      <section className="py-20 lg:py-32 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {entrenadores.map((entrenador, index) => (
              <Card
                key={index}
                className="group overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:from-white/15 hover:via-white/10 hover:to-white/5 transition-all duration-300 shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_70px_rgba(251,191,36,0.25)] w-full max-w-md rounded-[32px] border-0"
              >
                <div className="relative h-[32rem] overflow-hidden">
                  <img
                    src={entrenador.image || "/placeholder.svg"}
                    alt={entrenador.nombre}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-50" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{entrenador.nombre}</h3>
                    <p className="text-accent font-mono text-sm tracking-wider">{entrenador.titulo}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-accent" />
                    <p className="font-mono text-sm text-white">{entrenador.especialidad}</p>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">{entrenador.descripcion}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="font-mono text-xs text-accent tracking-[0.2em]">LOGROS DESTACADOS</span>
                    </div>
                    {entrenador.logros.map((logro, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Trophy className="w-3 h-3 text-accent/70" />
                        <span className="text-sm text-gray-400">{logro}</span>
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
