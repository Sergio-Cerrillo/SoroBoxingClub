"use client"

import { useState, useEffect } from "react"
import { m, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, User, LogIn, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { motionConfig } from "@/lib/motion/config"

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
    { href: "/entrenadores", label: "ENTRENADORES" },
    { href: "/galeria", label: "GALERÍA" },
    { href: "/cuotas", label: "CUOTAS" },
  ]

  return (
    <m.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: motionConfig.easing.easeOut }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-primary/95 backdrop-blur-lg shadow-2xl" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <m.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
              <Image
                src="/logo.png"
                alt="Soro Boxing Club"
                width={120}
                height={40}
                className="object-contain"
                priority
              />
            </m.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <m.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className={`font-mono text-sm tracking-widest hover:text-accent transition-all duration-300 relative group ${pathname === link.href ? "text-accent" : "text-primary-foreground"
                    }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <m.span
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent/50 transition-all duration-300 group-hover:w-full" />
                </Link>
              </m.div>
            ))}

            {isAuthenticated ? (
              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3"
              >
                {isManager && (
                  <Link href="/gestion">
                    <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-mono tracking-wide transition-all bg-transparent"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        GESTIÓN
                      </Button>
                    </m.div>
                  </Link>
                )}
                <Link href="/perfil">
                  <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-mono tracking-wide transition-all bg-transparent"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user?.first_name?.toUpperCase() || user?.dni || 'PERFIL'}
                    </Button>
                  </m.div>
                </Link>
              </m.div>
            ) : (
              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/login">
                  <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-mono tracking-wide transition-all shadow-lg shadow-accent/20">
                      <LogIn className="w-4 h-4 mr-2" />
                      INICIAR SESIÓN
                    </Button>
                  </m.div>
                </Link>
              </m.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <m.button
            className="lg:hidden text-primary-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </m.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-primary/95 backdrop-blur-lg border-t border-border overflow-hidden"
            >
              <div className="flex flex-col gap-6 py-6">
                {navLinks.map((link, index) => (
                  <m.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`font-mono text-sm tracking-wide hover:text-accent transition-colors ${pathname === link.href ? "text-accent" : "text-primary-foreground"
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </m.div>
                ))}

                {!loading && (
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {isAuthenticated ? (
                      <>
                        {isManager && (
                          <Link href="/gestion" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button
                              variant="outline"
                              className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-mono tracking-wide bg-transparent mb-3"
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
                  </m.div>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.nav>
  )
}
