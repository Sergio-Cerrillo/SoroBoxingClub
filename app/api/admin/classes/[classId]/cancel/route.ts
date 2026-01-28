import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { verifyAdminSession } from "@/lib/auth-admin"

/**
 * DELETE /api/admin/classes/[classId]/cancel
 * Cancels a class (sets status to 'cancelled')
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
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

    const { classId } = await params

    // Update class status to 'cancelled'
    const { data: cancelledClass, error: updateError } = await supabaseAdmin
      .from("classes")
      .update({ status: "cancelled" })
      .eq("id", classId)
      .select()
      .single()

    if (updateError) {
      console.error("Error cancelling class:", updateError)
      return NextResponse.json(
        { error: "Error cancelling class" },
        { status: 500 }
      )
    }

    // Cancel all active bookings for this class
    const { error: bookingsError } = await supabaseAdmin
      .from("class_bookings")
      .update({ status: "cancelled" })
      .eq("class_id", classId)
      .eq("status", "active")

    if (bookingsError) {
      console.error("Error cancelling bookings:", bookingsError)
      // Don't fail the request, class is already cancelled
    }

    return NextResponse.json({
      success: true,
      class: cancelledClass,
    })
  } catch (error) {
    console.error("Error in /api/admin/classes/[classId]/cancel:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
