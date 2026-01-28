"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Wallet,
  Calendar,
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts"

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
  dues?: MembershipDue[]
}

export default function DashboardPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    if (authLoading) return

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

        // Load dues for each client user
        const usersWithDues = await Promise.all(
          baseUsers.map(async (user: User) => {
            if (user.role !== "client" || user.deleted_at) {
              return user
            }

            try {
              const duesRes = await fetch(`/api/admin/users/${user.id}/dues`)
              if (duesRes.ok) {
                const duesData = await duesRes.json()
                return { ...user, dues: duesData.data }
              }
              return user
            } catch (error) {
              console.error(`Error loading dues for user ${user.id}:`, error)
              return user
            }
          })
        )

        setUsers(usersWithDues)
      }
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !isAdmin) return null

  const activeUsers = users.filter((u) => u.role === "client" && !u.deleted_at)

  const getCurrentMonthKey = () => {
    return `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`
  }

  const getPaymentStats = () => {
    const currentMonthKey = getCurrentMonthKey()
    let paidCount = 0
    let unpaidCount = 0
    let totalRevenue = 0
    let pendingRevenue = 0

    const paymentDetails = activeUsers.map((u) => {
      const due = u.dues?.find((d) => d.period_month === currentMonthKey)
      const userName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.dni

      if (due) {
        if (due.status === "paid") {
          paidCount++
          totalRevenue += due.amount_cents / 100
        } else if (due.status === "pending") {
          unpaidCount++
          pendingRevenue += due.amount_cents / 100
        }

        return {
          user: {
            id: u.id,
            name: userName,
            email: u.email || "Sin email",
          },
          payment: {
            paid: due.status === "paid",
            amount: due.amount_cents / 100,
            paidDate: due.paid_at,
          },
        }
      } else {
        // Si no hay registro, contamos como pendiente
        unpaidCount++
        pendingRevenue += 50

        return {
          user: {
            id: u.id,
            name: userName,
            email: u.email || "Sin email",
          },
          payment: {
            paid: false,
            amount: 50,
            paidDate: null,
          },
        }
      }
    })

    return {
      paidCount,
      unpaidCount,
      totalRevenue,
      pendingRevenue,
      totalExpected: totalRevenue + pendingRevenue,
      collectionRate: paidCount / (paidCount + unpaidCount) || 0,
      paymentDetails,
    }
  }

  const stats = getPaymentStats()

  // Calculate average monthly fee from dues (default to 50 if no data)
  const monthlyRevenue =
    activeUsers.length > 0 && activeUsers.some((u) => u.dues && u.dues.length > 0)
      ? Math.round(
        activeUsers.reduce((sum, u) => {
          const latestDue = u.dues?.[0]
          return sum + (latestDue ? latestDue.amount_cents / 100 : 0)
        }, 0) / activeUsers.filter((u) => u.dues && u.dues.length > 0).length
      )
      : 50

  const generateHistoricalData = () => {
    const data = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`

      let monthRevenue = 0
      let monthPaid = 0

      activeUsers.forEach((u) => {
        const due = u.dues?.find((d) => d.period_month === monthKey)
        if (due?.status === "paid") {
          monthRevenue += due.amount_cents / 100
          monthPaid++
        }
      })

      data.push({
        month: date.toLocaleDateString("es-ES", { month: "short" }),
        ingresos: monthRevenue,
        pagos: monthPaid,
      })
    }
    return data
  }

  const historicalData = generateHistoricalData()

  // Payment methods estimation (could be enhanced with real data later)
  const paymentMethods = [
    {
      name: "Efectivo",
      count: Math.floor(stats.paidCount * 0.4),
      amount: Math.floor(stats.totalRevenue * 0.4),
      color: "bg-green-500",
    },
    {
      name: "Tarjeta",
      count: Math.floor(stats.paidCount * 0.35),
      amount: Math.floor(stats.totalRevenue * 0.35),
      color: "bg-blue-500",
    },
    {
      name: "Transferencia",
      count: Math.floor(stats.paidCount * 0.25),
      amount: Math.floor(stats.totalRevenue * 0.25),
      color: "bg-purple-500",
    },
  ]

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <p className="text-muted-foreground">Cargando datos del dashboard...</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-12 bg-gradient-to-b from-primary to-primary/95">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 text-center">
            DASHBOARD <span className="text-accent">& FACTURACIÓN</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 font-mono text-center">
            Métricas financieras y control de cobros
          </p>
        </div>
      </section>

      <section className="py-6 bg-muted/30 border-b sticky top-16 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {months.map((month, index) => (
              <Button
                key={month}
                variant={selectedMonth === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMonth(index)}
                className={selectedMonth === index ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
              >
                {month}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* KPIs principales */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-8 border-2 hover:border-accent transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-mono">USUARIOS ACTIVOS</p>
                  <p className="text-4xl font-bold text-accent">{activeUsers.length}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Cuota mensual: {monthlyRevenue}€</p>
            </Card>

            <Card className="p-8 border-2 hover:border-green-500 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-mono">INGRESOS COBRADOS</p>
                  <p className="text-4xl font-bold text-green-600">{stats.totalRevenue}€</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{stats.paidCount} pagos confirmados</p>
            </Card>

            <Card className="p-8 border-2 hover:border-destructive transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-mono">PENDIENTES</p>
                  <p className="text-4xl font-bold text-destructive">{stats.unpaidCount}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{stats.pendingRevenue}€ por cobrar</p>
            </Card>

            <Card className="p-8 border-2 hover:border-blue-500 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-mono">TASA DE COBRO</p>
                  <p className="text-4xl font-bold text-blue-600">{(stats.collectionRate * 100).toFixed(0)}%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Total esperado: {stats.totalExpected}€</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Gráfica de ingresos mensuales */}
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-accent" />
                Evolución de Ingresos
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ingresos"
                    stroke="hsl(var(--accent))"
                    fillOpacity={1}
                    fill="url(#colorIngresos)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Gráfica de pagos por mes */}
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Pagos por Mes
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={historicalData}>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="pagos" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-8 mb-12">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-accent" />
              Métodos de Pago del Mes
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {paymentMethods.map((method) => (
                <div key={method.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-muted-foreground">{method.name}</span>
                    <span className="font-bold">{method.count} pagos</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${method.color} transition-all duration-500`}
                      style={{ width: `${(method.count / stats.paidCount) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {method.amount}€ (
                    {stats.paidCount > 0 ? ((method.count / stats.paidCount) * 100).toFixed(0) : 0}%)
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-accent" />
                Detalle de Pagos - {months[selectedMonth]}
              </h3>
              <div className="flex gap-3">
                <Badge variant="outline" className="border-green-600 text-green-600">
                  {stats.paidCount} pagados
                </Badge>
                <Badge variant="outline" className="border-destructive text-destructive">
                  {stats.unpaidCount} pendientes
                </Badge>
              </div>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {stats.paymentDetails.map(({ user: u, payment }) => (
                <div
                  key={u.id}
                  className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all hover:shadow-md ${payment.paid
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-destructive/30 bg-destructive/5 animate-pulse"
                    }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg ${payment.paid ? "bg-green-500/20 text-green-700" : "bg-destructive/20 text-destructive"
                        }`}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{u.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        {payment.paid && payment.paidDate && (
                          <Badge variant="outline" className="text-xs">
                            Pagado: {new Date(payment.paidDate).toLocaleDateString("es-ES")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent">{payment.amount}€</p>
                      <p
                        className={`text-sm font-mono font-bold ${payment.paid ? "text-green-600" : "text-destructive"}`}
                      >
                        {payment.paid ? "✓ PAGADO" : "⚠ PENDIENTE"}
                      </p>
                    </div>
                    {payment.paid ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {stats.unpaidCount > 0 && (
            <Card className="p-6 border-2 border-orange-500/30 bg-orange-500/5 mt-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-orange-700 mb-2">Recordatorio de Cobros</h3>
                  <p className="text-muted-foreground">
                    Tienes {stats.unpaidCount} usuario{stats.unpaidCount > 1 ? "s" : ""} con pagos pendientes por un
                    total de {stats.pendingRevenue}€. Considera enviar recordatorios de pago.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
