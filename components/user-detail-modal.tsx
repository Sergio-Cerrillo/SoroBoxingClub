"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Calendar,
    TrendingUp,
    CheckCircle2,
    Clock,
    XCircle,
    Euro,
    AlertCircle,
} from "lucide-react"

interface User {
    id: string
    dni: string
    first_name: string | null
    last_name: string | null
    email: string | null
    phone: string | null
}

interface UserStats {
    bookedCount: number
    attendanceCount: number
}

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
    created_at: string
    updated_at: string
}

interface UserDetailModalProps {
    user: User | null
    open: boolean
    onClose: () => void
}

export function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
    const [stats, setStats] = useState<UserStats | null>(null)
    const [dues, setDues] = useState<MembershipDue[]>([])
    const [loading, setLoading] = useState(false)
    const [markingPaid, setMarkingPaid] = useState<string | null>(null)

    useEffect(() => {
        if (open && user) {
            loadUserData()
        }
    }, [open, user])

    const loadUserData = async () => {
        if (!user) return

        setLoading(true)
        try {
            // Load stats and dues in parallel
            const [statsRes, duesRes] = await Promise.all([
                fetch(`/api/admin/users/${user.id}/summary`),
                fetch(`/api/admin/users/${user.id}/dues?months=6`),
            ])

            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setStats(statsData.data)
            }

            if (duesRes.ok) {
                const duesData = await duesRes.json()
                setDues(duesData.data)
            }
        } catch (error) {
            console.error("Error loading user data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleMarkPaid = async (dueId: string) => {
        setMarkingPaid(dueId)
        try {
            const response = await fetch(`/api/admin/dues/${dueId}/mark-paid`, {
                method: "POST",
            })

            if (response.ok) {
                // Reload dues
                loadUserData()
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
        })
    }

    const formatAmount = (cents: number, currency: string) => {
        return `${(cents / 100).toFixed(2)} ${currency}`
    }

    if (!user) return null

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.dni

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{fullName}</DialogTitle>
                    <DialogDescription className="text-base font-mono">DNI: {user.dni}</DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                            {stats?.bookedCount || 0}
                                        </div>
                                        <div className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                                            Clases Reservadas
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    <div>
                                        <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                                            {stats?.attendanceCount || 0}
                                        </div>
                                        <div className="text-sm text-green-600 dark:text-green-400 font-mono">
                                            Asistencias Totales
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <Separator />

                        {/* Payment History */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Euro className="w-5 h-5 text-accent" />
                                Historial de Pagos (Últimos 6 Meses)
                            </h3>

                            <div className="space-y-3">
                                {dues.length === 0 ? (
                                    <Card className="p-6 text-center">
                                        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                                        <p className="text-muted-foreground font-mono">No hay registros de pagos</p>
                                    </Card>
                                ) : (
                                    dues.map((due) => (
                                        <Card
                                            key={due.id}
                                            className={`p-4 border-2 transition-all ${due.status === "paid"
                                                    ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                                                    : due.status === "pending"
                                                        ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
                                                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        {due.status === "paid" ? (
                                                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                                        ) : due.status === "pending" ? (
                                                            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                                                        ) : (
                                                            <XCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-lg">{formatDate(due.period_month)}</div>
                                                        <div className="text-sm text-muted-foreground font-mono">
                                                            {formatAmount(due.amount_cents, due.currency)}
                                                        </div>
                                                        {due.paid_at && (
                                                            <div className="text-xs text-muted-foreground font-mono">
                                                                Pagado: {new Date(due.paid_at).toLocaleDateString("es-ES")}
                                                            </div>
                                                        )}
                                                        {due.note && (
                                                            <div className="text-xs text-muted-foreground mt-1 italic">
                                                                Nota: {due.note}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {due.status === "paid" ? (
                                                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300">
                                                            PAGADO
                                                        </Badge>
                                                    ) : due.status === "pending" ? (
                                                        <>
                                                            <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 border-yellow-500 text-yellow-700 dark:text-yellow-300">
                                                                PENDIENTE
                                                            </Badge>
                                                            <Button
                                                                onClick={() => handleMarkPaid(due.id)}
                                                                disabled={markingPaid === due.id}
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700 text-white font-mono"
                                                            >
                                                                {markingPaid === due.id ? (
                                                                    <>
                                                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                                                                        ...
                                                                    </>
                                                                ) : (
                                                                    "Marcar Pagado"
                                                                )}
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-900 border-gray-500 text-gray-700 dark:text-gray-300">
                                                            EXENTO
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
