"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  Mail,
  Phone,
  Calendar,
  Search,
  Shield,
  CheckCircle2,
  AlertCircle,
  Euro,
  UserX,
  UserCheck,
  KeyRound,
  UserPlus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  dni: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  role: string
  created_at: string
  dues?: Array<{
    id: string
    period_month: string
    amount_cents: number
    status: "pending" | "paid" | "waived"
    paid_at: string | null
  }>
}

export default function GestionUsuariosPage() {
  const { user, isAuthenticated, isManager, loading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showPendingPaymentsDialog, setShowPendingPaymentsDialog] = useState(false)
  const [newUserData, setNewUserData] = useState({
    dni: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    // Esperar a que termine de cargar antes de redirigir
    if (loading) return

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isManager) {
      router.push("/")
      return
    }

    loadUsers()
  }, [isAuthenticated, isManager, router, loading])

  const loadUsers = async () => {
    try {
      setLoadingUsers(true)
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (response.ok) {
        const baseUsers = data.users || []

        // Cargar dues para cada usuario client
        const usersWithDues = await Promise.all(
          baseUsers.map(async (u: User) => {
            if (u.role !== "client") return u

            try {
              const duesRes = await fetch(`/api/admin/users/${u.id}/dues`)
              if (duesRes.ok) {
                const duesData = await duesRes.json()
                return { ...u, dues: duesData.data }
              }
              return u
            } catch (error) {
              console.error(`Error loading dues for user ${u.id}:`, error)
              return u
            }
          })
        )

        setAllUsers(usersWithDues)
      } else {
        console.error("Error loading users:", data.error)
      }
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleDeactivate = async (userId: string) => {
    if (!confirm("¿Estás seguro de que quieres dar de baja a este usuario?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadUsers()
      } else {
        const data = await response.json()
        alert(data.error || "Error al desactivar usuario")
      }
    } catch (error) {
      console.error("Error deactivating user:", error)
      alert("Error al desactivar usuario")
    }
  }

  const handleMarkAsPaid = async (userId: string, dueId: string) => {
    try {
      const response = await fetch(`/api/admin/dues/${dueId}/mark-paid`, {
        method: 'POST',
      })

      if (response.ok) {
        await loadUsers()
      } else {
        const data = await response.json()
        alert(data.error || "Error al marcar como pagado")
      }
    } catch (error) {
      console.error("Error marking as paid:", error)
      alert("Error al marcar como pagado")
    }
  }

  const handleMarkAsPending = async (userId: string, dueId: string) => {
    try {
      const response = await fetch(`/api/admin/dues/${dueId}/mark-pending`, {
        method: 'POST',
      })

      if (response.ok) {
        await loadUsers()
      } else {
        const data = await response.json()
        alert(data.error || "Error al marcar como pendiente")
      }
    } catch (error) {
      console.error("Error marking as pending:", error)
      alert("Error al marcar como pendiente")
    }
  }

  const handleActivate = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
      })

      if (response.ok) {
        await loadUsers()
      } else {
        const data = await response.json()
        alert(data.error || "Error al activar usuario")
      }
    } catch (error) {
      console.error("Error activating user:", error)
      alert("Error al activar usuario")
    }
  }

  const handleResetPin = async (userId: string) => {
    if (!confirm("¿Generar un nuevo PIN para este usuario?")) {
      return
    }

    try {
      const response = await fetch('/api/admin/reset-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`PIN actualizado correctamente a: ${data.newPin}\n\nComunica este PIN al usuario.`)
      } else {
        const data = await response.json()
        alert(data.error || "Error al actualizar PIN")
      }
    } catch (error) {
      console.error("Error resetting PIN:", error)
      alert("Error al actualizar PIN")
    }
  }

  const handleAddUser = async () => {
    if (!newUserData.dni || !newUserData.first_name || !newUserData.last_name) {
      alert("DNI, nombre y apellido son obligatorios")
      return
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Usuario creado correctamente\nPIN: ${data.pin}\n\nComunica este PIN al usuario.`)
        setShowAddUserDialog(false)
        setNewUserData({ dni: "", first_name: "", last_name: "", email: "", phone: "" })
        await loadUsers()
      } else {
        alert(data.error || "Error al crear usuario")
      }
    } catch (error) {
      console.error("Error adding user:", error)
      alert("Error al crear usuario")
    }
  }

  // Mostrar loading mientras se verifica autenticación
  if (loading || !user || !isManager) {
    return null
  }

  // Skeleton durante la carga de usuarios
  if (loadingUsers) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />

        {/* Hero Section Skeleton */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/95 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-accent/20 backdrop-blur-sm border border-accent/50 rounded-full mb-6">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-accent font-mono text-sm tracking-widest">GESTIÓN DE USUARIOS</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4">
                ADMINISTRACIÓN <span className="text-accent">USUARIOS</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 font-mono">
                Gestiona pagos, reservas y estado de los usuarios
              </p>
            </div>

            {/* Stats Dashboard Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6 text-center">
                  <div className="w-8 h-8 bg-accent/30 rounded-full mx-auto mb-3 animate-pulse" />
                  <div className="h-10 bg-accent/30 rounded mx-auto mb-2 w-16 animate-pulse" />
                  <div className="h-4 bg-primary-foreground/20 rounded mx-auto w-32 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search Skeleton */}
        <section className="py-8 bg-muted/50 border-b border-border sticky top-20 z-40 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="h-14 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </section>

        {/* Users List Skeleton */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="h-9 bg-muted rounded w-64 animate-pulse" />
                <div className="h-10 bg-accent/30 rounded w-48 animate-pulse" />
              </div>

              <div className="grid gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="p-6 border-2 border-border/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="h-7 bg-muted rounded w-48 mb-2 animate-pulse" />
                        <div className="h-5 bg-muted rounded w-32 animate-pulse" />
                      </div>
                      <div className="h-6 bg-accent/30 rounded-full w-20 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="h-5 bg-muted rounded w-full animate-pulse" />
                      <div className="h-5 bg-muted rounded w-full animate-pulse" />
                      <div className="h-5 bg-muted rounded w-full animate-pulse" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 bg-muted rounded flex-1 animate-pulse" />
                      <div className="h-9 bg-muted rounded flex-1 animate-pulse" />
                      <div className="h-9 bg-muted rounded w-24 animate-pulse" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  const filteredUsers = allUsers.filter((u) => {
    const searchLower = searchTerm.toLowerCase()
    const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ").toLowerCase()
    return (
      fullName.includes(searchLower) ||
      u.dni.toLowerCase().includes(searchLower) ||
      (u.email && u.email.toLowerCase().includes(searchLower)) ||
      (u.phone && u.phone.includes(searchTerm))
    )
  })

  const totalUsers = allUsers.filter((u) => u.role === "client").length
  const activeUsers = totalUsers // Por ahora todos son activos (no tienen deleted_at)

  // Calcular pagos pendientes del último mes
  const getCurrentPeriod = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  }

  const currentPeriod = getCurrentPeriod()

  console.log('🔍 Current period:', currentPeriod)
  console.log('📊 All users with dues:', allUsers.map(u => ({
    name: [u.first_name, u.last_name].join(' '),
    dues: u.dues?.map(d => ({ period: d.period_month, status: d.status }))
  })))

  const usersWithPendingPayments = allUsers
    .filter((u) => u.role === "client")
    .filter((u) => {
      const currentDue = u.dues?.find(d => d.period_month === currentPeriod)
      console.log('🔎 Checking user:', [u.first_name, u.last_name].join(' '), 'currentDue:', currentDue)
      return currentDue && currentDue.status === "pending"
    })

  const pendingPaymentsCount = usersWithPendingPayments.length

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/95 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-accent/20 backdrop-blur-sm border border-accent/50 rounded-full mb-6">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-accent font-mono text-sm tracking-widest">GESTIÓN DE USUARIOS</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4">
              ADMINISTRACIÓN <span className="text-accent">USUARIOS</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 font-mono">
              Gestiona pagos, reservas y estado de los usuarios
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold text-accent mb-2">{totalUsers}</div>
              <div className="text-sm font-mono text-primary-foreground/70">Usuarios Totales</div>
            </div>
            <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold text-accent mb-2">{activeUsers}</div>
              <div className="text-sm font-mono text-primary-foreground/70">Usuarios Activos</div>
            </div>
            <button
              onClick={() => setShowPendingPaymentsDialog(true)}
              className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6 text-center hover:bg-primary-foreground/10 transition-colors cursor-pointer"
            >
              <AlertCircle className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold text-accent mb-2">{pendingPaymentsCount}</div>
              <div className="text-sm font-mono text-primary-foreground/70">Pagos Pendientes</div>
            </button>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-muted/50 border-b border-border sticky top-20 z-40 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 border-2 focus:border-accent text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Users List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                Lista de Usuarios ({filteredUsers.filter((u) => u.role === "client").length})
              </h2>

              <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90 text-primary font-mono">
                    <UserPlus className="w-4 h-4 mr-2" />
                    AÑADIR USUARIO
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Añadir Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Completa los datos del nuevo usuario. Se generará un PIN automáticamente.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dni">DNI *</Label>
                      <Input
                        id="dni"
                        value={newUserData.dni}
                        onChange={(e) => setNewUserData({ ...newUserData, dni: e.target.value })}
                        placeholder="12345678X"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="first_name">Nombre *</Label>
                      <Input
                        id="first_name"
                        value={newUserData.first_name}
                        onChange={(e) => setNewUserData({ ...newUserData, first_name: e.target.value })}
                        placeholder="Juan"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last_name">Apellidos *</Label>
                      <Input
                        id="last_name"
                        value={newUserData.last_name}
                        onChange={(e) => setNewUserData({ ...newUserData, last_name: e.target.value })}
                        placeholder="García López"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                        placeholder="juan@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={newUserData.phone}
                        onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                        placeholder="600123456"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddUser} className="bg-accent hover:bg-accent/90">
                      Crear Usuario
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Diálogo de Pagos Pendientes */}
            <Dialog open={showPendingPaymentsDialog} onOpenChange={setShowPendingPaymentsDialog}>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-accent" />
                    Usuarios con Pagos Pendientes ({pendingPaymentsCount})
                  </DialogTitle>
                  <DialogDescription>
                    Listado de usuarios con cuotas pendientes del mes actual ({currentPeriod})
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {usersWithPendingPayments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                      <p>¡Todos los pagos del mes están al día!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {usersWithPendingPayments.map((u) => {
                        const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.dni
                        const currentDue = u.dues?.find(d => d.period_month === currentPeriod)
                        const amount = currentDue ? (currentDue.amount_cents / 100).toFixed(2) : "0.00"

                        return (
                          <Card key={u.id} className="p-4 border-2 border-orange-500/30">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">
                                  {fullName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-foreground truncate">{fullName}</p>
                                  <p className="text-sm text-muted-foreground">{u.dni}</p>
                                  {u.phone && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                      <Phone className="w-3 h-3" />
                                      {u.phone}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <Badge variant="outline" className="border-orange-500 text-orange-600 mb-2">
                                  PENDIENTE
                                </Badge>
                                <p className="text-lg font-bold text-accent">{amount}€</p>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPendingPaymentsDialog(false)}>
                    Cerrar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="grid gap-4">
              {filteredUsers
                .filter((u) => u.role === "client")
                .map((userItem) => {
                  const fullName = [userItem.first_name, userItem.last_name].filter(Boolean).join(" ") || userItem.dni
                  const memberSince = new Date(userItem.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })

                  return (
                    <Card
                      key={userItem.id}
                      className="p-6 border-2 transition-all hover:shadow-lg hover:border-accent"
                    >
                      <div className="flex flex-col gap-6">
                        {/* Header con info básica */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-xl font-bold text-primary-foreground flex-shrink-0">
                              {fullName.charAt(0).toUpperCase()}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-foreground mb-2">{fullName}</h3>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline" className="border-green-500 text-green-600">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  ACTIVO
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => handleResetPin(userItem.id)}
                              variant="outline"
                              size="sm"
                              className="font-mono"
                            >
                              <KeyRound className="w-4 h-4 mr-2" />
                              GESTIONAR PIN
                            </Button>
                            <Button
                              onClick={() => handleDeactivate(userItem.id)}
                              variant="destructive"
                              size="sm"
                              className="font-mono"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              DAR DE BAJA
                            </Button>
                          </div>
                        </div>

                        {/* Historial de Pagos */}

                        {/* Historial de Pagos */}
                        {userItem.dues && userItem.dues.length > 0 && (
                          <div className="border-t border-border pt-4">
                            <h4 className="text-sm font-mono tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                              <Euro className="w-4 h-4 text-accent" />
                              HISTORIAL DE PAGOS (Desde su registro)
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                              {userItem.dues.slice(-6).reverse().map((due) => {
                                const monthDate = new Date(due.period_month)
                                const monthName = monthDate.toLocaleDateString("es-ES", {
                                  month: "short",
                                  year: "numeric",
                                })

                                return (
                                  <div
                                    key={due.id}
                                    className={`p-3 rounded-lg border-2 ${due.status === "paid"
                                      ? "bg-green-50 border-green-500"
                                      : "bg-yellow-50 border-yellow-500"
                                      }`}
                                  >
                                    <div className="text-xs font-mono text-muted-foreground mb-1">
                                      {monthName.toUpperCase()}
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-lg font-bold">{due.amount_cents / 100}€</span>
                                      {due.status === "paid" ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                      ) : (
                                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                                      )}
                                    </div>
                                    {due.status === "pending" ? (
                                      <Button
                                        onClick={() => handleMarkAsPaid(userItem.id, due.id)}
                                        size="sm"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                                      >
                                        MARCAR PAGADO
                                      </Button>
                                    ) : (
                                      <Button
                                        onClick={() => handleMarkAsPending(userItem.id, due.id)}
                                        size="sm"
                                        variant="outline"
                                        className="w-full text-xs"
                                      >
                                        MARCAR PENDIENTE
                                      </Button>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{userItem.email || "Sin email"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">{userItem.phone || "Sin teléfono"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Miembro desde {memberSince}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
            </div>

            {filteredUsers.filter((u) => u.role === "client").length === 0 && (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-xl text-muted-foreground font-mono">No se encontraron usuarios</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
