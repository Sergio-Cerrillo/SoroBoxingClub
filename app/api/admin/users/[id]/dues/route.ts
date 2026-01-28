import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { verifyAdminSession } from "@/lib/auth-admin"

/**
 * GET /api/admin/users/[id]/dues?months=6
 * Returns membership dues for the last N months
 * Creates missing months on-demand
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
    const { searchParams } = new URL(request.url)
    const monthsParam = searchParams.get("months")
    const months = monthsParam ? parseInt(monthsParam, 10) : 6

    // Validate input
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      )
    }

    if (isNaN(months) || months < 1 || months > 24) {
      return NextResponse.json(
        { error: "Invalid months parameter (must be 1-24)" },
        { status: 400 }
      )
    }

    // Verify user exists and is not deleted
    const { data: user, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("id, deleted_at, created_at")
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

    // Generate list of months from user registration to current month
    const periodMonths: string[] = []
    const today = new Date()
    const registrationDate = new Date(user.created_at)
    
    // Set to first day of registration month
    const startDate = new Date(registrationDate.getFullYear(), registrationDate.getMonth(), 1)
    
    // Set to first day of current month
    const endDate = new Date(today.getFullYear(), today.getMonth(), 1)
    
    console.log('📅 Generating dues from registration:', {
      registrationDate: user.created_at,
      startMonth: startDate.toISOString().split('T')[0],
      endMonth: endDate.toISOString().split('T')[0]
    })
    
    // Generate all months from registration to now
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const periodMonth = `${year}-${month}-01`
      periodMonths.push(periodMonth)
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    console.log('📅 Generated period months:', periodMonths)

    // Fetch existing dues for these months
    const { data: existingDues, error: duesError } = await supabaseAdmin
      .from("membership_dues")
      .select("*")
      .eq("profile_id", userId)
      .in("period_month", periodMonths)

    if (duesError) {
      console.error("Error fetching dues:", duesError)
      return NextResponse.json(
        { error: "Error fetching membership dues" },
        { status: 500 }
      )
    }

    // Find missing months and create them
    const existingPeriods = new Set(existingDues?.map((d) => d.period_month) || [])
    const missingPeriods = periodMonths.filter((p) => !existingPeriods.has(p))

    if (missingPeriods.length > 0) {
      const newDues = missingPeriods.map((period) => ({
        profile_id: userId,
        period_month: period,
        status: "pending",
        amount_cents: 5000,
        currency: "EUR",
      }))

      const { error: insertError } = await supabaseAdmin
        .from("membership_dues")
        .insert(newDues)

      if (insertError) {
        console.error("Error creating missing dues:", insertError)
        // Continue anyway - return existing data
      }
    }

    // Re-fetch all dues for these months (now including newly created ones)
    const { data: allDues, error: refetchError } = await supabaseAdmin
      .from("membership_dues")
      .select(`
        id,
        profile_id,
        period_month,
        amount_cents,
        currency,
        status,
        paid_at,
        marked_by,
        note,
        created_at,
        updated_at
      `)
      .eq("profile_id", userId)
      .in("period_month", periodMonths)
      .order("period_month", { ascending: false })

    if (refetchError) {
      console.error("Error refetching dues:", refetchError)
      return NextResponse.json(
        { error: "Error fetching membership dues" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: allDues || [],
    })
  } catch (error) {
    console.error("Error in /api/admin/users/[id]/dues:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
