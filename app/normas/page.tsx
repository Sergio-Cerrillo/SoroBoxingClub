import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Shield, Users, Clock, Heart, AlertTriangle, CheckCircle } from "lucide-react"

export default function NormasPage() {
  const normas = [
    {
      categoria: "Seguridad y Equipamiento",
      icon: Shield,
      reglas: [
        "Es obligatorio el uso de guantes, vendas y protector bucal durante el entrenamiento",
        "El equipamiento de protección debe estar en buen estado",
        "No se permite entrenar con joyas, relojes o accesorios que puedan causar lesiones",
        "El calzado deportivo adecuado es obligatorio en todo momento",
        "Reporta cualquier equipamiento dañado al personal inmediatamente",
      ],
    },
    {
      categoria: "Conducta y Respeto",
      icon: Users,
      reglas: [
        "Respeta a todos los miembros, entrenadores y personal del gimnasio",
        "Mantén un lenguaje apropiado en todo momento",
        "No se tolera ningún tipo de discriminación o acoso",
        "Respeta el espacio personal de los demás durante el entrenamiento",
        "Sigue siempre las instrucciones de los entrenadores",
      ],
    },
    {
      categoria: "Horarios y Reservas",
      icon: Clock,
      reglas: [
        "Llega puntual a las clases reservadas",
        "Cancela con al menos 3 horas de antelación si no puedes asistir",
        "Las clases tienen un límite de participantes, respeta tu reserva",
        "El acceso al gimnasio está permitido solo durante tu horario contratado",
        "Más de 3 faltas sin aviso pueden resultar en suspensión temporal",
      ],
    },
    {
      categoria: "Higiene y Limpieza",
      icon: Heart,
      reglas: [
        "Usa siempre una toalla durante el entrenamiento",
        "Limpia el equipamiento después de usarlo con los productos disponibles",
        "Mantén tu espacio de entrenamiento ordenado",
        "Las duchas y vestuarios deben dejarse limpios después de su uso",
        "No compartas botellas de agua ni equipamiento personal",
      ],
    },
    {
      categoria: "Entrenamiento y Combate",
      icon: AlertTriangle,
      reglas: [
        "El sparring solo está permitido bajo supervisión de un entrenador",
        "Respeta el nivel de tu compañero durante el sparring",
        "Detén inmediatamente si tu compañero dice 'stop' o da señales de parar",
        "No se permiten golpes en la nuca, riñones o por debajo del cinturón",
        "Consulta con el entrenador si tienes lesiones antes de entrenar",
      ],
    },
    {
      categoria: "Responsabilidad",
      icon: CheckCircle,
      reglas: [
        "Cada miembro es responsable de su propia salud y bienestar",
        "Es obligatorio tener un certificado médico actualizado",
        "Informa al personal de cualquier condición médica relevante",
        "El gimnasio no se hace responsable de objetos personales perdidos",
        "Está prohibido grabar o fotografiar sin consentimiento de los presentes",
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-accent text-accent-foreground">NORMATIVA</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary-foreground">
              Normas de <span className="text-accent">Uso</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Para garantizar un ambiente seguro, respetuoso y productivo para todos nuestros miembros.
            </p>
          </div>
        </div>
      </section>

      {/* Normas Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {normas.map((seccion, index) => {
              const IconComponent = seccion.icon
              return (
                <Card key={index} className="p-8 border-border hover:border-accent transition-colors duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <IconComponent className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{seccion.categoria}</h2>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {seccion.reglas.map((regla, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground leading-relaxed">{regla}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )
            })}
          </div>

          {/* Nota Final */}
          <Card className="max-w-5xl mx-auto mt-12 p-8 bg-accent/5 border-accent">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-accent">Importante</h3>
              <p className="text-muted-foreground leading-relaxed">
                El incumplimiento reiterado de estas normas puede resultar en la suspensión temporal o permanente de la
                membresía. Estas normas están diseñadas para proteger a todos los miembros y crear el mejor ambiente de
                entrenamiento posible. Si tienes dudas sobre cualquier norma, no dudes en consultar con nuestro
                personal.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
