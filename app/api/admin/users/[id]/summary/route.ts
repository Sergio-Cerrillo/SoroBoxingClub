import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { verifyAdminSession } from "@/lib/auth-admin"

/**
 * GET /api/admin/users/[id]/summary
 * Returns booking and attendance counts for a user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const adminSession = await verifyAdminSession()
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      )
    }

    const { id: userId } = await params

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      )
    }

    // Verify user exists and is not deleted
    const { data: user, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("id, deleted_at")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (user.deleted_at) {
      return NextResponse.json(
        { error: "User is deleted" },
        { status: 404 }
      )
    }

    // Count active future bookings
    // (not cancelled, not removed, class starts in future, class is active)
    const { data: futureBookings, error: bookedError } = await supabaseAdmin
      .from("class_bookings")
      .select("id, class_id, classes!inner(starts_at, status)")
      .eq("profile_id", userId)
      .is("cancelled_at", null)
      .is("removed_at", null)

    if (bookedError) {
      console.error("Error fetching bookings:", bookedError)
      return NextResponse.json(
        { error: "Error counting bookings" },
        { status: 500 }
      )
    }

    // Filter in memory for future classes that are active
    const now = new Date()
    const bookedCount = (futureBookings || []).filter((booking: any) => {
      const classData = booking.classes
      if (!classData) return false
      const startsAt = new Date(classData.starts_at)
      return startsAt >= now && classData.status === "active"
    }).length

    // Count attendance (checked in and not cancelled/removed)
    const { count: attendanceCount, error: attendanceError } = await supabaseAdmin
      .from("class_bookings")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", userId)
      .not("checked_in_at", "is", null)
      .is("cancelled_at", null)
      .is("removed_at", null)

    if (attendanceError) {
      console.error("Error counting attendance:", attendanceError)
      return NextResponse.json(
        { error: "Error counting attendance" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        bookedCount: bookedCount || 0,
        attendanceCount: attendanceCount || 0,
      },
    })
  } catch (error) {
    console.error("Error in /api/admin/users/[id]/summary:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
