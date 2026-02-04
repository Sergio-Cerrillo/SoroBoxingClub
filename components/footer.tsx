import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"

export function Footer() {
  return (
    <footer className="bg-black border-t border-accent/30">
      <div className="container mx-auto px-4 py-16">
        {/* Card global única */}
        <Card className="p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-[0_20px_50px_rgba(251,191,36,0.15)] mb-8 rounded-[28px] border-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center justify-center lg:items-start">
              <div className="mb-4">
                <Image
                  src="/logo.png"
                  alt="Soro Boxing Club"
                  width={200}
                  height={50}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Navegación */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 font-mono flex items-center gap-2">
                <span className="w-1 h-4 bg-accent"></span>
                NAVEGACIÓN
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#servicios" className="text-gray-400 hover:text-accent transition-colors font-mono text-xs">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="/cuotas" className="text-gray-400 hover:text-accent transition-colors font-mono text-xs">
                    Planes
                  </Link>
                </li>
                <li>
                  <Link href="/galeria" className="text-gray-400 hover:text-accent transition-colors font-mono text-xs">
                    Galería
                  </Link>
                </li>
                <li>
                  <Link href="/entrenadores" className="text-gray-400 hover:text-accent transition-colors font-mono text-xs">
                    Entrenadores
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 font-mono flex items-center gap-2">
                <span className="w-1 h-4 bg-accent"></span>
                CONTACTO
              </h3>
              <div className="flex flex-col gap-2 lg:max-w-[180px]">
                <a
                  href="mailto:soroboxingclubsta@gmail.com"
                  className="h-7 bg-white/10 backdrop-blur-md hover:bg-accent flex items-center justify-center gap-1 transition-all duration-300 group rounded-full shadow-lg border-0"
                >
                  <Mail className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent-foreground transition-colors" />
                  <span className="text-gray-300 group-hover:text-accent-foreground text-[0.65rem] font-mono">Email</span>
                </a>
                <a
                  href="tel:+34669102905"
                  className="h-7 bg-white/10 backdrop-blur-md hover:bg-accent flex items-center justify-center gap-1 transition-all duration-300 group rounded-full shadow-lg border-0"
                >
                  <Phone className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent-foreground transition-colors" />
                  <span className="text-gray-300 group-hover:text-accent-foreground text-[0.65rem] font-mono">Llamar</span>
                </a>
                <a
                  href="https://wa.me/34669102905"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-7 bg-white/10 backdrop-blur-md hover:bg-accent flex items-center justify-center gap-1 transition-all duration-300 group rounded-full shadow-lg border-0"
                >
                  <Phone className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent-foreground transition-colors" />
                  <span className="text-gray-300 group-hover:text-accent-foreground text-[0.65rem] font-mono">WhatsApp</span>
                </a>
                <a
                  href="https://www.instagram.com/soroboxingclub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-7 bg-white/10 backdrop-blur-md hover:bg-accent flex items-center justify-center gap-1 transition-all duration-300 group rounded-full shadow-lg border-0"
                >
                  <Instagram className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent-foreground transition-colors" />
                  <span className="text-gray-300 group-hover:text-accent-foreground text-[0.65rem] font-mono">Instagram</span>
                </a>
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 font-mono flex items-center gap-2">
                <span className="w-1 h-4 bg-accent"></span>
                UBICACIÓN
              </h3>
              <div className="rounded-lg overflow-hidden shadow-lg" style={{ height: '120px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.9446792584946!2d2.7475!3d39.6850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1297912c0a7c7d9b%3A0x9c7c7c7c7c7c7c7c!2sCarrer%20Casesnoves%2C%2015%2C%2007320%20Santa%20Maria%20del%20Cam%C3%AD%2C%20Illes%20Balears!5e0!3m2!1ses!2ses!4v1600000000000!5m2!1ses!2ses"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Horarios centrados */}
          <div className="pt-6 mt-6 text-center">
            <p className="text-gray-400 font-mono text-xs">
              <span className="text-accent font-bold">365 días al año</span> de 09:00 a 21:00
            </p>
          </div>



          {/* Enlaces legales centrados en la parte inferior de la card */}
          <div className="pt-4 mt-4 border-t border-accent/30">

            <div className="flex flex-wrap justify-center gap-6">
              <Link href="#" className="text-gray-400 hover:text-accent transition-colors font-mono text-xs">
                Privacidad
              </Link>
              <Link href="#" className="text-gray-400 hover:text-accent transition-colors font-mono text-xs">
                Términos
              </Link>
              <Link href="#" className="text-gray-400 hover:text-accent transition-colors font-mono text-xs">
                Cookies
              </Link>
            </div>
            <p className="text-gray-400 font-mono text-sm text-center mt-4 -mb-4">
              © 2026 Soro Boxing Club. Todos los derechos reservados.
            </p>
          </div>
        </Card>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-accent/30">
          {/* Desarrollado por */}
          <div className="pt-6 text-center flex flex-col items-center gap-3">
            <h4 className="text-sm font-bold text-white font-mono mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent"></span>
              DESARROLLADO POR
            </h4>
            <a
              href="https://www.scwebstudio.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo-full-w.png"
                alt="Desarrollado por"
                width={150}
                height={75}
                className="object-contain"
              />
              <span className="text-gray-400 hover:text-accent transition-colors font-mono text-sm">
                www.scwebstudio.tech
              </span>
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}
