"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Shield, LogIn } from "lucide-react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [dni, setDni] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, pin }),
      })

      const data = await response.json()
      console.log('Login response:', { ok: response.ok, status: response.status, data })

      if (response.ok) {
        // Login exitoso - redirigir según rol
        console.log('Login successful, user role:', data.user?.role)

        // Usar window.location.href para forzar recarga completa y asegurar que la cookie se propague
        if (data.user.role === 'admin') {
          console.log('Redirecting to /gestion')
          window.location.href = '/gestion'
        } else {
          console.log('Redirecting to /clases')
          window.location.href = '/clases'
        }
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch (err) {
      console.error('Error en login:', err)
      setError('Error de conexión. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 border-2 border-accent/20 shadow-2xl backdrop-blur-sm bg-background/95">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            SORO <span className="text-accent">BOXING</span>
          </h1>
          <p className="text-sm font-mono text-muted-foreground tracking-widest">ACCESO AL SISTEMA</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="dni" className="text-sm font-mono uppercase text-muted-foreground">
              DNI
            </Label>
            <Input
              id="dni"
              type="text"
              placeholder="12345678A"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
              disabled={loading}
              className="mt-2 bg-background/50 border-accent/20 focus:border-accent"
            />
          </div>

          <div>
            <Label htmlFor="pin" className="text-sm font-mono uppercase text-muted-foreground">
              PIN
            </Label>
            <Input
              id="pin"
              type="password"
              placeholder="······"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              disabled={loading}
              className="mt-2 bg-background/50 border-accent/20 focus:border-accent"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-black font-bold py-3"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                INICIANDO SESIÓN...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                INICIAR SESIÓN
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            Si has olvidado tu PIN, contacta con el administrador
          </p>
        </div>
      </Card>
    </div>
  )
}
