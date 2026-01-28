"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, User, LogIn, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, isManager, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "INICIO" },
    { href: "/clases", label: "CLASES" },
    { href: "/entrenadores", label: "ENTRENADORES" },
    { href: "/galeria", label: "GALERÍA" },
    { href: "/cuotas", label: "CUOTAS" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-primary/95 backdrop-blur-lg shadow-2xl" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-3xl font-bold transition-transform group-hover:scale-105">
              <span className="text-accent">SORO</span>
              <span className="text-primary-foreground"> BOXING</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-sm tracking-widest hover:text-accent transition-all duration-300 relative group ${pathname === link.href ? "text-accent" : "text-primary-foreground"
                  }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isManager && (
                  <Link href="/gestion">
                    <Button
                      variant="outline"
                      className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-mono tracking-wide transition-all hover:scale-105 bg-transparent"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      GESTIÓN
                    </Button>
                  </Link>
                )}
                <Link href="/perfil">
                  <Button
                    variant="outline"
                    className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-mono tracking-wide transition-all hover:scale-105 bg-transparent"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user?.first_name?.toUpperCase() || user?.dni || 'PERFIL'}
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-mono tracking-wide transition-all hover:scale-105 shadow-lg shadow-accent/20">
                  <LogIn className="w-4 h-4 mr-2" />
                  INICIAR SESIÓN
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-primary-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-primary/95 backdrop-blur-lg border-t border-border py-6 animate-fade-in">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono text-sm tracking-wide hover:text-accent transition-colors ${pathname === link.href ? "text-accent" : "text-primary-foreground"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {!loading && (
                <>
                  {isAuthenticated ? (
                    <>
                      {isManager && (
                        <Link href="/gestion" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button
                            variant="outline"
                            className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-mono tracking-wide bg-transparent"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            GESTIÓN
                          </Button>
                        </Link>
                      )}
                      <Link href="/perfil" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-mono tracking-wide bg-transparent"
                        >
                          <User className="w-4 h-4 mr-2" />
                          MI PERFIL
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-mono tracking-wide w-full">
                        <LogIn className="w-4 h-4 mr-2" />
                        INICIAR SESIÓN
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
