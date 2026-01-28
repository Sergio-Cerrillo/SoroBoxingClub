import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-3xl font-bold mb-4">
              <span className="text-accent">SORO</span>
              <span className="text-foreground"> BOXING</span>
            </div>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-6">
              {"La mejor academia de boxeo con entrenadores profesionales y equipamiento de última generación."}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-muted hover:bg-accent flex items-center justify-center transition-colors group"
              >
                <Facebook className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-muted hover:bg-accent flex items-center justify-center transition-colors group"
              >
                <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-muted hover:bg-accent flex items-center justify-center transition-colors group"
              >
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-muted hover:bg-accent flex items-center justify-center transition-colors group"
              >
                <Youtube className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 font-mono">ENLACES RÁPIDOS</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#servicios"
                  className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="#horarios"
                  className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm"
                >
                  Horarios
                </Link>
              </li>
              <li>
                <Link
                  href="#videos"
                  className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm"
                >
                  Videos
                </Link>
              </li>
              <li>
                <Link
                  href="#combates"
                  className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm"
                >
                  Combates
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 font-mono">PROGRAMAS</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm">
                  Principiantes
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm">
                  Intermedio
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm">
                  Avanzado
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm">
                  Competición
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 font-mono">CONTACTO</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-mono text-sm">Calle del Boxeo 123, Madrid</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-mono text-sm">+34 900 123 456</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-mono text-sm">info@soroboxing.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground font-mono text-sm">
              © 2025 Soro Boxing. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm">
                Privacidad
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm">
                Términos
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors font-mono text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
