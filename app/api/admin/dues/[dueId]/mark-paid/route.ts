import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { verifyAdminSession } from "@/lib/auth-admin"

/**
 * POST /api/admin/dues/[dueId]/mark-paid
 * Marks a membership due as paid
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

    // Parse body for optional note
    let note: string | undefined
    try {
      const body = await request.json()
      note = body.note
    } catch {
      // Body is optional
    }

    // Verify due exists
    const { data: existingDue, error: fetchError } = await supabaseAdmin
      .from("membership_dues")
      .select("id, status")
      .eq("id", dueId)
      .single()

    if (fetchError || !existingDue) {
      return NextResponse.json(
        { error: "Membership due not found" },
        { status: 404 }
      )
    }

    // Update the due to mark as paid
    const { data: updatedDue, error: updateError } = await supabaseAdmin
      .from("membership_dues")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        marked_by: adminSession.profileId,
        ...(note && { note }),
      })
      .eq("id", dueId)
      .select()
      .single()

    if (updateError) {
      console.error("Error marking due as paid:", updateError)
      return NextResponse.json(
        { error: "Error marking due as paid" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedDue,
    })
  } catch (error) {
    console.error("Error in /api/admin/dues/[dueId]/mark-paid:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
