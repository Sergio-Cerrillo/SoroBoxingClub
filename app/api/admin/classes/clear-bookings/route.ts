import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { verifyAdminSession } from "@/lib/auth-admin"

export async function POST(request: Request) {
  try {
    // Verify admin access
    const adminUser = await verifyAdminSession()
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all booking IDs first
    const { data: allBookings, error: fetchError } = await supabaseAdmin
      .from("class_bookings")
      .select("id")

    if (fetchError) {
      console.error("Error fetching bookings:", fetchError)
      return NextResponse.json(
        { error: "Error fetching bookings" },
        { status: 500 }
      )
    }

    // If there are bookings, delete them
    if (allBookings && allBookings.length > 0) {
      const bookingIds = allBookings.map(b => b.id)
      
      const { error: deleteError } = await supabaseAdmin
        .from("class_bookings")
        .delete()
        .in("id", bookingIds)

      if (deleteError) {
        console.error("Error clearing bookings:", deleteError)
        return NextResponse.json(
          { error: "Error clearing bookings" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "All bookings have been cleared successfully" 
    })
  } catch (error) {
    console.error("Error clearing bookings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
