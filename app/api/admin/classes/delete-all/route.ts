import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { verifyAdminSession } from "@/lib/auth-admin"

export async function DELETE(request: Request) {
  try {
    // Verify admin access
    const adminUser = await verifyAdminSession()
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // First, get all booking IDs
    const { data: allBookings } = await supabaseAdmin
      .from("class_bookings")
      .select("id")

    // Delete all bookings if any exist (due to foreign key constraint)
    if (allBookings && allBookings.length > 0) {
      const bookingIds = allBookings.map(b => b.id)
      const { error: bookingsError } = await supabaseAdmin
        .from("class_bookings")
        .delete()
        .in("id", bookingIds)

      if (bookingsError) {
        console.error("Error deleting bookings:", bookingsError)
        return NextResponse.json(
          { error: "Error deleting bookings" },
          { status: 500 }
        )
      }
    }

    // Then, get all class IDs and delete them
    const { data: allClasses } = await supabaseAdmin
      .from("classes")
      .select("id")

    if (allClasses && allClasses.length > 0) {
      const classIds = allClasses.map(c => c.id)
      const { error: classesError } = await supabaseAdmin
        .from("classes")
        .delete()
        .in("id", classIds)

      if (classesError) {
        console.error("Error deleting classes:", classesError)
        return NextResponse.json(
          { error: "Error deleting classes" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "All classes and bookings have been deleted successfully" 
    })
  } catch (error) {
    console.error("Error deleting all classes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
