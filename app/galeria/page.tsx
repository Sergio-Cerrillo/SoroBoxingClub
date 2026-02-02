"use client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export default function GaleriaPage() {
  const instalaciones = [
    {
      title: "Ring Principal - Vista General",
      image: "/ring1.jpg",
    },
    {
      title: "Ring Principal - Vista lateral",
      image: "/ring2.jpg",
    },
    {
      title: "Zona de sacos",
      image: "/sacos1.jpg",
    },
    {
      title: "Zona de sacos",
      image: "/sacos2.jpg",
    },
    {
      title: "Zona de sacos",
      image: "/sacos3.jpg",
    },
    {
      title: "Recepción",
      image: "/recepcion.jpg",
    },
  ]

  const pesas = [
    {
      title: "Zona de Pesas",
      image: "/pesas1.jpg",
    },
    {
      title: "Zona exterior libre",
      image: "/exterior.jpg",
    },
    {
      title: "Zona de Pesas",
      image: "/pesas2.jpg",
    },
    {
      title: "Zona de Pesas",
      image: "/pesas3.jpg",
    },
    {
      title: "Zona de pesas",
      image: "/pesas4.jpg",
    },
    {
      title: "Zona interior",
      image: "/pesas5.jpg",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/instalaciones.JPG')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-black" />

        <div className="container mx-auto px-4 z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 backdrop-blur-md border border-accent/30 rounded-full mb-8">
              <span className="text-accent font-mono text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                GALERÍA
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary-foreground tracking-tight leading-tight">
              NUESTRAS{" "}
              <span className="animate-shimmer bg-gradient-to-r from-accent via-yellow-300 to-accent bg-[length:200%_auto] bg-clip-text text-transparent">
                INSTALACIONES
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/90 leading-relaxed font-light max-w-3xl mx-auto">
              Descubre el mejor equipamiento y los momentos más épicos de Soro Boxing.
            </p>
          </div>
        </div>
      </section>

      {/* Galería con Tabs */}
      <section className="py-20 lg:py-32 bg-black">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="instalaciones" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-zinc-900 border border-accent/30 p-1 rounded-full h-14">
              <TabsTrigger
                value="instalaciones"
                className="font-mono text-sm tracking-wider text-gray-400 hover:text-white data-[state=active]:bg-accent data-[state=active]:text-black data-[state=active]:shadow-lg rounded-full transition-all duration-300"
              >
                BOXEO
              </TabsTrigger>
              <TabsTrigger
                value="combates"
                className="font-mono text-sm tracking-wider text-gray-400 hover:text-white data-[state=active]:bg-accent data-[state=active]:text-black data-[state=active]:shadow-lg rounded-full transition-all duration-300"
              >
                PESAS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="instalaciones">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instalaciones.map((item, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden bg-zinc-900 border-accent/30 hover:border-accent transition-all duration-300 cursor-pointer shadow-lg shadow-accent/20 hover:shadow-2xl hover:shadow-accent/50"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="combates">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pesas.map((item, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden bg-zinc-900 border-accent/30 hover:border-accent transition-all duration-300 cursor-pointer shadow-lg shadow-accent/20 hover:shadow-2xl hover:shadow-accent/50"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
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
