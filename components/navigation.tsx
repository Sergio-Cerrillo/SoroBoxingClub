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
    { href: "/contacto", label: "CONTACTO" },
  ]

  return (
    <m.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: motionConfig.easing.easeOut }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          {/* Main Navigation Container - Centered with logo and all links */}
          <div
            className={`flex items-center gap-6 h-16 px-6 rounded-full transition-all duration-500 ${isScrolled
                ? "bg-gradient-to-r from-black/60 via-black/50 to-black/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(251,191,36,0.15)] border border-amber-500/20"
                : "bg-gradient-to-r from-black/40 via-black/30 to-black/40 backdrop-blur-lg border border-white/10"
              }`}
          >
            {/* Left Links - INICIO, ENTRENADORES, GALERÍA */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.slice(0, 3).map((link, index) => (
                <m.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className={`font-mono text-sm tracking-widest hover:text-accent transition-all duration-300 relative group px-4 py-2 rounded-full ${pathname === link.href
                        ? "text-accent bg-white/10"
                        : "text-white/90 hover:bg-white/5"
                      }`}
                  >
                    {link.label}
                  </Link>
                </m.div>
              ))}
            </div>

            {/* Center - Logo */}
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

            {/* Right Links - CUOTAS, CONTACTO */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.slice(3, 5).map((link, index) => (
                <m.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className={`font-mono text-sm tracking-widest hover:text-accent transition-all duration-300 relative group px-4 py-2 rounded-full ${pathname === link.href
                        ? "text-accent bg-white/10"
                        : "text-white/90 hover:bg-white/5"
                      }`}
                  >
                    {link.label}
                  </Link>
                </m.div>
              ))}
            </div>

            {/* Auth Section - Inside main container */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <m.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2"
                >
                  {isManager && (
                    <Link href="/gestion">
                      <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="ghost"
                          className="relative bg-gradient-to-r from-amber-500/15 via-yellow-600/10 to-amber-500/15 backdrop-blur-md border-2 border-amber-500/40 text-amber-400 hover:text-amber-300 hover:border-amber-400/60 font-mono tracking-widest transition-all duration-300 shadow-[0_0_10px_rgba(251,191,36,0.15)] hover:shadow-[0_0_20px_rgba(251,191,36,0.3),0_0_40px_rgba(251,191,36,0.15)] rounded-full h-10 px-4 overflow-hidden group"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <Shield className="w-4 h-4 mr-2 relative z-10" />
                          <span className="relative z-10">GESTIÓN</span>
                        </Button>
                      </m.div>
                    </Link>
                  )}
                  <Link href="/perfil">
                    <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="ghost"
                        className="relative bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-md border-2 border-white/40 text-white hover:text-white hover:border-white/60 font-mono tracking-widest transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2),0_0_40px_rgba(255,255,255,0.1)] rounded-full h-10 px-4 overflow-hidden group"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <User className="w-4 h-4 mr-2 relative z-10" />
                        <span className="relative z-10">{user?.first_name?.toUpperCase() || user?.dni || 'PERFIL'}</span>
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
                    <m.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <Button className="relative bg-gradient-to-r from-amber-500/15 via-yellow-600/10 to-amber-500/15 backdrop-blur-md border-2 border-amber-500/40 text-amber-400 hover:text-amber-300 hover:border-amber-400/60 font-mono tracking-widest transition-all duration-300 shadow-[0_0_10px_rgba(251,191,36,0.15)] hover:shadow-[0_0_20px_rgba(251,191,36,0.3),0_0_40px_rgba(251,191,36,0.15)] rounded-full h-10 px-6 overflow-hidden group">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <LogIn className="w-4 h-4 mr-2 relative z-10" />
                        <span className="relative z-10">ACCEDER</span>
                      </Button>
                    </m.div>
                  </Link>
                </m.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <m.button
              className="lg:hidden text-primary-foreground ml-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </m.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden"
          >
            <div className="mt-4 px-4">
              <div className="bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-[0_8px_32px_rgba(251,191,36,0.15)]">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link, index) => (
                    <m.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className={`font-mono text-sm tracking-wide transition-all px-4 py-2 rounded-full ${pathname === link.href
                            ? "text-accent bg-white/10"
                            : "text-white/90 hover:bg-white/5 hover:text-accent"
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
                      className="pt-4 border-t border-white/10"
                    >
                      {isAuthenticated ? (
                        <>
                          {isManager && (
                            <Link href="/gestion" onClick={() => setIsMobileMenuOpen(false)}>
                              <Button
                                variant="ghost"
                                className="w-full bg-white/10 backdrop-blur-md border border-amber-500/20 text-white hover:bg-white/20 hover:border-amber-500/40 font-mono tracking-wide mb-3 rounded-full"
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                GESTIÓN
                              </Button>
                            </Link>
                          )}
                          <Link href="/perfil" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button
                              variant="ghost"
                              className="w-full bg-white/10 backdrop-blur-md border border-amber-500/20 text-white hover:bg-white/20 hover:border-amber-500/40 font-mono tracking-wide rounded-full"
                            >
                              <User className="w-4 h-4 mr-2" />
                              MI PERFIL
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="bg-gradient-to-r from-amber-500/90 to-yellow-600/90 backdrop-blur-md border border-amber-400/30 text-accent-foreground hover:from-amber-500 hover:to-yellow-600 hover:border-amber-400/50 font-mono tracking-wide w-full rounded-full shadow-lg">
                            <LogIn className="w-4 h-4 mr-2" />
                            INICIAR SESIÓN
                          </Button>
                        </Link>
                      )}
                    </m.div>
                  )}
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.nav>
  )
}
