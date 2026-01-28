import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { verifyAdminSession } from "@/lib/auth-admin"

/**
 * POST /api/admin/bookings/[bookingId]/check-in
 * Marks a class booking as checked in (attendance tracking)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
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

    const { bookingId } = await params

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID format" },
        { status: 400 }
      )
    }

    // Verify booking exists and is not cancelled/removed
    const { data: existingBooking, error: fetchError } = await supabaseAdmin
      .from("class_bookings")
      .select("id, cancelled_at, removed_at, checked_in_at")
      .eq("id", bookingId)
      .single()

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    // Check if booking is cancelled or removed
    if (existingBooking.cancelled_at) {
      return NextResponse.json(
        { error: "Cannot check in: booking is cancelled" },
        { status: 400 }
      )
    }

    if (existingBooking.removed_at) {
      return NextResponse.json(
        { error: "Cannot check in: booking is removed" },
        { status: 400 }
      )
    }

    // Check if already checked in
    if (existingBooking.checked_in_at) {
      return NextResponse.json(
        { 
          success: true,
          message: "Already checked in",
          data: existingBooking 
        }
      )
    }

    // Mark as checked in
    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from("class_bookings")
      .update({
        checked_in_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single()

    if (updateError) {
      console.error("Error checking in booking:", updateError)
      return NextResponse.json(
        { error: "Error checking in booking" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Checked in successfully",
      data: updatedBooking,
    })
  } catch (error) {
    console.error("Error in /api/admin/bookings/[bookingId]/check-in:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
