import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { verifyAdminSession } from "@/lib/auth-admin"

/**
 * POST /api/admin/dues/[dueId]/mark-pending
 * Marks a membership due as pending (reverts payment)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dueId: string }> }
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

    const { dueId } = await params

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(dueId)) {
      return NextResponse.json(
        { error: "Invalid due ID format" },
        { status: 400 }
      )
    }

    // Update the due to pending status
    const { data: updatedDue, error: updateError } = await supabaseAdmin
      .from("membership_dues")
      .update({
        status: "pending",
        paid_at: null,
        marked_by: null,
      })
      .eq("id", dueId)
      .select()
      .single()

    if (updateError) {
      console.error("Error marking due as pending:", updateError)
      return NextResponse.json(
        { error: "Error updating membership due" },
        { status: 500 }
      )
    }

    if (!updatedDue) {
      return NextResponse.json(
        { error: "Due not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedDue,
    })
  } catch (error) {
    console.error("Error in /api/admin/dues/[dueId]/mark-pending:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
