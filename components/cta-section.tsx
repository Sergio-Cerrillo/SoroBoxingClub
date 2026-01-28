import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-6 py-2 bg-accent/20 border border-accent/40 rounded-full mb-8">
            <span className="text-accent font-mono text-xs tracking-[0.2em] uppercase font-medium">Únete Hoy</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            ¿LISTO PARA <span className="text-accent block mt-2">TRANSFORMARTE?</span>
          </h2>

          <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/90 mb-12 font-mono leading-relaxed max-w-3xl mx-auto px-4">
            Únete a Soro Boxing y descubre tu verdadero potencial.
            <span className="block mt-2 text-accent/90">Primera clase gratis para nuevos miembros.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-20 px-4">
            <Link href="/clases" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-base md:text-lg px-8 md:px-12 py-6 md:py-7 font-mono tracking-wider group shadow-2xl shadow-accent/30 hover:scale-[1.02] transition-all duration-300"
              >
                EMPEZAR HOY
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary-foreground/80 text-primary-foreground hover:bg-primary-foreground/10 hover:border-accent text-base md:text-lg px-8 md:px-12 py-6 md:py-7 font-mono tracking-wider bg-transparent backdrop-blur-sm transition-all duration-300"
            >
              <Phone className="mr-3" size={20} />
              CONTACTAR
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-16 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/70 font-mono text-xs md:text-sm mb-8 tracking-[0.15em] uppercase">
              Entrena con los Mejores
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              <div className="text-primary-foreground/80 font-bold text-sm md:text-lg lg:text-xl font-mono tracking-wider">
                FEDERACIÓN NACIONAL
              </div>
              <div className="text-primary-foreground/80 font-bold text-sm md:text-lg lg:text-xl font-mono tracking-wider">
                WBC CERTIFICADO
              </div>
              <div className="text-primary-foreground/80 font-bold text-sm md:text-lg lg:text-xl font-mono tracking-wider">
                CAMPEONES OLÍMPICOS
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
