import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // First get classes
    const { data: classes, error: classesError } = await supabaseAdmin
      .from('classes')
      .select('*')
      .eq('status', 'active')
      .order('starts_at', { ascending: true })

    if (classesError) {
      console.error('Error obteniendo clases:', classesError)
      return NextResponse.json(
        { error: 'Error al obtener las clases' },
        { status: 500 }
      )
    }

    // Then get bookings with profiles for each class
    const classesWithBookings = await Promise.all(
      (classes || []).map(async (classItem) => {
        const { data: bookings } = await supabaseAdmin
          .from('class_bookings')
          .select(`
            id,
            profile_id,
            cancelled_at,
            profiles!class_bookings_profile_id_fkey(first_name, last_name, email, dni)
          `)
          .eq('class_id', classItem.id)
          .is('cancelled_at', null)

        // Transformar los datos para agregar full_name
        const bookingsWithFullName = (bookings || []).map(booking => ({
          ...booking,
          status: 'active',
          profiles: {
            ...booking.profiles,
            full_name: [booking.profiles?.first_name, booking.profiles?.last_name].filter(Boolean).join(' ') || booking.profiles?.dni || 'Sin nombre'
          }
        }))

        return {
          ...classItem,
          bookings: bookingsWithFullName,
        }
      })
    )

    return NextResponse.json({ classes: classesWithBookings }, { status: 200 })

  } catch (error) {
    console.error('Error en GET /api/classes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
