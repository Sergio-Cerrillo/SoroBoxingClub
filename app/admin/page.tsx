"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { UserDetailModal } from "@/components/user-detail-modal"
import {
  UserPlus,
  Trash2,
  Copy,
  Check,
  Users,
  Mail,
  Phone,
  Calendar,
  Shield,
  Search,
  Key,
  UserX,
  UserCheck,
  Eye,
  Euro,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

interface MembershipDue {
  id: string
  profile_id: string
  period_month: string
  amount_cents: number
  currency: string
  status: "pending" | "paid" | "waived"
  paid_at: string | null
  marked_by: string | null
  note: string | null
}

interface UserStats {
  bookedCount: number
  attendanceCount: number
}

interface User {
  id: string
  dni: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  role: string
  created_at: string
  deleted_at: string | null
  stats?: UserStats
  dues?: MembershipDue[]
}

export default function AdminPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Form state
  const [dni, setDni] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Success state
  const [generatedPin, setGeneratedPin] = useState<string | null>(null)
  const [pinCopied, setPinCopied] = useState(false)

  // Reset PIN state
  const [resettingPin, setResettingPin] = useState<string | null>(null)
  const [resetPinResult, setResetPinResult] = useState<{ userId: string; newPin: string } | null>(null)

  // Delete confirmation
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // User detail modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Payment operations
  const [markingPaid, setMarkingPaid] = useState<string | null>(null)

  // Stats for dashboard
  const [totalEnrollments, setTotalEnrollments] = useState(0)
  const [pendingPayments, setPendingPayments] = useState(0)

  // Load users
  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return

    // Redirect if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
      router.push("/login")
      return
    }

    loadUsers()
  }, [authLoading, isAuthenticated, isAdmin, router, pathname])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (response.ok) {
        const baseUsers = data.users || []

        // Load stats and dues for each client user in parallel
        const usersWithData = await Promise.all(
          baseUsers.map(async (user: User) => {
            if (user.role !== "client" || user.deleted_at) {
              return user
            }

            try {
              // Fetch stats and dues in parallel
              const [statsRes, duesRes] = await Promise.all([
                fetch(`/api/admin/users/${user.id}/summary`),
                fetch(`/api/admin/users/${user.id}/dues`),
              ])

              let stats: UserStats | undefined
              let dues: MembershipDue[] | undefined

              if (statsRes.ok) {
                const statsData = await statsRes.json()
                stats = statsData.data
              }

              if (duesRes.ok) {
                const duesData = await duesRes.json()
                dues = duesData.data
              }

              return { ...user, stats, dues }
            } catch (err) {
              console.error(`Error loading data for user ${user.id}:`, err)
              return user
            }
          })
        )

        setUsers(usersWithData)

        // Calculate dashboard stats
        let totalBookings = 0
        let pendingCount = 0

        usersWithData.forEach((user: User) => {
          if (user.stats) {
            totalBookings += user.stats.bookedCount
          }
          if (user.dues) {
            pendingCount += user.dues.filter((d) => d.status === "pending").length
          }
        })

        setTotalEnrollments(totalBookings)
        setPendingPayments(pendingCount)
      } else {
        alert(data.error || "Error al cargar usuarios")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dni.trim()) {
      alert("El DNI es obligatorio")
      return
    }

    try {
      setCreating(true)
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dni: dni.trim(),
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedPin(data.generated_pin)
        setDni("")
        setFirstName("")
        setLastName("")
        setEmail("")
        setPhone("")
        loadUsers()
      } else {
        alert(data.error || "Error al crear usuario")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al crear usuario")
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setDeleting(userToDelete.id)
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userToDelete.id }),
      })

      const data = await response.json()

      if (response.ok) {
        loadUsers()
        setUserToDelete(null)
      } else {
        alert(data.error || "Error al eliminar usuario")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar usuario")
    } finally {
      setDeleting(null)
    }
  }

  const handleResetPin = async (userId: string) => {
    if (!confirm("¿Estás seguro de que quieres restablecer el PIN de este usuario? Se generará un nuevo PIN aleatorio.")) {
      return
    }

    try {
      setResettingPin(userId)
      const response = await fetch("/api/admin/reset-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (response.ok) {
        setResetPinResult({ userId, newPin: data.newPin })
        alert(`PIN restablecido exitosamente. Nuevo PIN: ${data.newPin}\n\nComunica este PIN al usuario de forma segura.`)
      } else {
        alert(data.error || "Error al restablecer PIN")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al restablecer PIN")
    } finally {
      setResettingPin(null)
    }
  }

  const handleMarkPaid = async (dueId: string) => {
    setMarkingPaid(dueId)
    try {
      const response = await fetch(`/api/admin/dues/${dueId}/mark-paid`, {
        method: "POST",
      })

      if (response.ok) {
        // Reload users to refresh payment status
        loadUsers()
      } else {
        const data = await response.json()
        alert(data.error || "Error al marcar como pagado")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al marcar como pagado")
    } finally {
      setMarkingPaid(null)
    }
  }

  const handleMarkPending = async (dueId: string) => {
    setMarkingPaid(dueId)
    try {
      const response = await fetch(`/api/admin/dues/${dueId}/mark-pending`, {
        method: "POST",
      })

      if (response.ok) {
        // Reload users to refresh payment status
        loadUsers()
      } else {
        const data = await response.json()
        alert(data.error || "Error al marcar como pendiente")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al marcar como pendiente")
    } finally {
      setMarkingPaid(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setPinCopied(true)
    setTimeout(() => setPinCopied(false), 2000)
  }

  const closeSuccessDialog = () => {
    setGeneratedPin(null)
    setPinCopied(false)
  }

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase()
    return (
      user.dni.toLowerCase().includes(searchLower) ||
      fullName.includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchTerm)
    )
  })

  const activeUsers = users.filter((u) => !u.deleted_at && u.role === "client").length
  const totalUsers = users.filter((u) => u.role === "client").length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
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
            <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6 text-center">
              <AlertCircle className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold text-accent mb-2">{pendingPayments}</div>
              <div className="text-sm font-mono text-primary-foreground/70">Pagos Pendientes</div>
            </div>
            <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl p-6 text-center">
              <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-4xl font-bold text-accent mb-2">{totalEnrollments}</div>
              <div className="text-sm font-mono text-primary-foreground/70">Reservas Totales</div>
            </div>
          </div>
        </div>
      </section>

      {/* Create User Form */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 border-2 border-accent/20">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <UserPlus className="w-8 h-8 text-accent" />
                Crear Usuario
              </h2>

              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="dni" className="text-sm font-mono tracking-wide">
                      DNI *
                    </Label>
                    <Input
                      id="dni"
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      placeholder="12345678A"
                      required
                      disabled={creating}
                      className="h-12 border-2 focus:border-accent"
                    />
                  </div>

                  <div>
                    <Label htmlFor="firstName" className="text-sm font-mono tracking-wide">
                      Nombre
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Juan"
                      disabled={creating}
                      className="h-12 border-2 focus:border-accent"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-sm font-mono tracking-wide">
                      Apellidos
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="García López"
                      disabled={creating}
                      className="h-12 border-2 focus:border-accent"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-mono tracking-wide">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@email.com"
                      disabled={creating}
                      className="h-12 border-2 focus:border-accent"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-mono tracking-wide">
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+34 600 000 000"
                      disabled={creating}
                      className="h-12 border-2 focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={creating}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 font-mono tracking-wide h-12 px-8"
                  >
                    {creating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        CREANDO...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        CREAR USUARIO
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground font-mono">
                  * El PIN se generará automáticamente y se mostrará una sola vez
                </p>
              </form>
            </Card>
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
            </div>

            <div className="grid gap-4">
              {filteredUsers
                .filter((u) => u.role === "client")
                .map((userItem) => {
                  const memberSince = new Date(userItem.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })

                  const fullName = [userItem.first_name, userItem.last_name].filter(Boolean).join(" ") || userItem.dni
                  const initials = fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()

                  const isActive = !userItem.deleted_at

                  // Check if there's an unpaid month
                  const hasUnpaidMonth = userItem.dues?.some((d) => d.status === "pending")

                  return (
                    <Card
                      key={userItem.id}
                      className={`p-6 border-2 transition-all hover:shadow-lg ${!isActive
                          ? "opacity-60 border-destructive"
                          : hasUnpaidMonth
                            ? "border-yellow-500"
                            : "hover:border-accent"
                        }`}
                    >
                      <div className="flex flex-col gap-6">
                        {/* Header con info básica */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-xl font-bold text-primary-foreground flex-shrink-0">
                              {initials}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-foreground mb-2">{fullName}</h3>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {!isActive && (
                                  <Badge variant="destructive">
                                    <UserX className="w-3 h-3 mr-1" />
                                    INACTIVO
                                  </Badge>
                                )}
                                {isActive && (
                                  <Badge variant="outline" className="border-green-500 text-green-600">
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    ACTIVO
                                  </Badge>
                                )}
                                {hasUnpaidMonth && (
                                  <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    PAGO PENDIENTE
                                  </Badge>
                                )}
                              </div>

                              <div className="grid md:grid-cols-3 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                                  <span className="text-muted-foreground font-mono truncate">
                                    {userItem.email || "Sin email"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                                  <span className="text-muted-foreground font-mono">
                                    {userItem.phone || "Sin teléfono"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
                                  <span className="text-muted-foreground font-mono">Desde {memberSince}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => handleResetPin(userItem.id)}
                              disabled={resettingPin === userItem.id || !isActive}
                              variant="outline"
                              size="sm"
                              className="font-mono"
                            >
                              <Key className="w-4 h-4 mr-2" />
                              {resettingPin === userItem.id ? "..." : "RESET PIN"}
                            </Button>
                            <Button
                              onClick={() => setUserToDelete(userItem)}
                              disabled={deleting === userItem.id}
                              variant="destructive"
                              size="sm"
                              className="font-mono"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {deleting === userItem.id ? "..." : "ELIMINAR"}
                            </Button>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4">
                          <div className="px-4 py-2 bg-muted rounded-lg">
                            <div className="text-xs font-mono text-muted-foreground mb-1">CLASES RESERVADAS</div>
                            <div className="text-xl font-bold text-accent">{userItem.stats?.bookedCount || 0}</div>
                          </div>
                          <div className="px-4 py-2 bg-muted rounded-lg">
                            <div className="text-xs font-mono text-muted-foreground mb-1">ASISTENCIAS</div>
                            <div className="text-xl font-bold text-accent">{userItem.stats?.attendanceCount || 0}</div>
                          </div>
                        </div>

                        {/* Pagos mensuales */}
                        <div className="border-t border-border pt-4">
                          <h4 className="text-sm font-mono tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                            <Euro className="w-4 h-4 text-accent" />
                            HISTORIAL DE PAGOS (Desde su registro)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {userItem.dues && userItem.dues.length > 0 ? (
                              userItem.dues.map((due) => {
                                const monthDate = new Date(due.period_month)
                                const monthName = monthDate.toLocaleDateString("es-ES", {
                                  month: "short",
                                  year: "numeric",
                                })

                                return (
                                  <div
                                    key={due.id}
                                    className={`p-3 rounded-lg border-2 ${due.status === "paid"
                                        ? "bg-green-50 dark:bg-green-950 border-green-500"
                                        : due.status === "pending"
                                          ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-500"
                                          : "bg-gray-50 dark:bg-gray-900 border-gray-500"
                                      }`}
                                  >
                                    <div className="text-xs font-mono text-muted-foreground mb-1">
                                      {monthName.toUpperCase()}
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-lg font-bold">{(due.amount_cents / 100).toFixed(0)}€</span>
                                      {due.status === "paid" ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                      ) : due.status === "pending" ? (
                                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                                      ) : (
                                        <CheckCircle2 className="w-5 h-5 text-gray-400" />
                                      )}
                                    </div>
                                    {due.status === "pending" ? (
                                      <Button
                                        onClick={() => handleMarkPaid(due.id)}
                                        disabled={markingPaid === due.id}
                                        size="sm"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                                      >
                                        {markingPaid === due.id ? "..." : "MARCAR PAGADO"}
                                      </Button>
                                    ) : due.status === "paid" ? (
                                      <Button
                                        onClick={() => handleMarkPending(due.id)}
                                        disabled={markingPaid === due.id}
                                        size="sm"
                                        variant="outline"
                                        className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950 text-xs"
                                      >
                                        {markingPaid === due.id ? "..." : "MARCAR PENDIENTE"}
                                      </Button>
                                    ) : (
                                      <div className="text-xs text-gray-600 font-mono text-center">Exento</div>
                                    )}
                                  </div>
                                )
                              })
                            ) : (
                              <div className="col-span-full text-center py-4">
                                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                <p className="text-sm text-muted-foreground font-mono">Sin datos de pagos</p>
                              </div>
                            )}
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

      {/* Success Dialog - PIN Generated */}
      <AlertDialog open={!!generatedPin} onOpenChange={closeSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2 text-green-600">
              <Check className="w-6 h-6" />
              Usuario Creado Exitosamente
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-mono text-muted-foreground mb-2">PIN GENERADO:</p>
                <div className="flex items-center gap-2">
                  <code className="text-3xl font-bold text-accent tracking-wider">{generatedPin}</code>
                  <Button
                    onClick={() => generatedPin && copyToClipboard(generatedPin)}
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    {pinCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-foreground font-mono leading-relaxed">
                ⚠️ <strong>IMPORTANTE:</strong> Guarda este PIN de forma segura. Este es el único momento en que se mostrará.
                El usuario necesitará este PIN para iniciar sesión.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeSuccessDialog} className="bg-accent text-accent-foreground hover:bg-accent/90 font-mono">
              ENTENDIDO
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">¿Eliminar Usuario?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Estás a punto de eliminar al usuario <strong>{userToDelete?.dni}</strong>.
              </p>
              <p className="text-destructive font-semibold">
                Esta acción marcará el usuario como eliminado. No se borrará permanentemente de la base de datos.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar Usuario
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </main>
  )
}
