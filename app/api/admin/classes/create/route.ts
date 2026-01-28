import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { verifyAdminSession } from "@/lib/auth-admin"

/**
 * POST /api/admin/classes/create
 * Creates a new class
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const adminSession = await verifyAdminSession()
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      professor,
      days_of_week,
      time,
      duration_minutes,
      capacity,
      recurring_weeks = 1,
    } = body

    // Validate required fields
    if (!title || !professor || !days_of_week || !Array.isArray(days_of_week) || days_of_week.length === 0 || !time || !duration_minutes || !capacity) {
      return NextResponse.json(
        { error: "Missing required fields or invalid days_of_week" },
        { status: 400 }
      )
    }

    // Validate days_of_week (1-6: Lunes-Sábado)
    for (const day of days_of_week) {
      if (day < 1 || day > 6) {
        return NextResponse.json(
          { error: "Invalid day_of_week (must be 1-6)" },
          { status: 400 }
        )
      }
    }

    const [hours, minutes] = time.split(':').map(Number)
    const createdClasses = []

    // Create classes for each selected day and each week
    for (let week = 0; week < parseInt(recurring_weeks); week++) {
      for (const targetDay of days_of_week) {
        // Calculate the date for this specific week and day
        const now = new Date()
        const currentDay = now.getDay()
        
        let daysUntilTarget = targetDay - currentDay
        if (daysUntilTarget <= 0) {
          daysUntilTarget += 7
        }

        const targetDate = new Date(now)
        targetDate.setDate(now.getDate() + daysUntilTarget + (week * 7))
        targetDate.setHours(hours, minutes, 0, 0)

        // Insert class
        const { data: newClass, error: insertError } = await supabaseAdmin
          .from("classes")
          .insert({
            title,
            professor,
            starts_at: targetDate.toISOString(),
            duration_minutes: parseInt(duration_minutes),
            capacity: parseInt(capacity),
            status: "active",
          })
          .select()
          .single()

        if (insertError) {
          console.error("Error creating class:", insertError)
          // Continue creating other classes even if one fails
          continue
        }

        createdClasses.push(newClass)
      }
    }

    if (createdClasses.length === 0) {
      return NextResponse.json(
        { error: "Error creating classes" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      classes: createdClasses,
      count: createdClasses.length,
    })
  } catch (error) {
    console.error("Error in /api/admin/classes/create:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
