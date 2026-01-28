import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * POST /api/classes/[id]/book
 * Permite a un usuario reservar una clase
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verificar sesión del usuario
    const session = await verifySession()
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado. Debes iniciar sesión.' },
        { status: 401 }
      )
    }

    const { id: classId } = await params

    // 2. Verificar que la clase existe y está activa
    const { data: classData, error: classError } = await supabaseAdmin
      .from('classes')
      .select('*')
      .eq('id', classId)
      .eq('status', 'active')
      .maybeSingle()

    if (classError || !classData) {
      return NextResponse.json(
        { error: 'Clase no encontrada o no disponible' },
        { status: 404 }
      )
    }

    // 3. Verificar capacidad de la clase
    const { data: existingBookings, error: bookingsError } = await supabaseAdmin
      .from('class_bookings')
      .select('id')
      .eq('class_id', classId)
      .is('cancelled_at', null)

    if (bookingsError) {
      console.error('Error verificando reservas:', bookingsError)
      return NextResponse.json(
        { error: 'Error al verificar disponibilidad' },
        { status: 500 }
      )
    }

    if (existingBookings && existingBookings.length >= classData.capacity) {
      return NextResponse.json(
        { error: 'La clase está llena' },
        { status: 400 }
      )
    }

    // 4. Verificar que el usuario no esté ya inscrito
    const { data: userBooking } = await supabaseAdmin
      .from('class_bookings')
      .select('id, cancelled_at')
      .eq('class_id', classId)
      .eq('profile_id', session.profileId)
      .maybeSingle()

    if (userBooking && !userBooking.cancelled_at) {
      return NextResponse.json(
        { error: 'Ya estás inscrito en esta clase' },
        { status: 400 }
      )
    }

    // 5. Crear la reserva
    const { data: booking, error: insertError } = await supabaseAdmin
      .from('class_bookings')
      .insert({
        class_id: classId,
        profile_id: session.profileId,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creando reserva:', insertError)
      return NextResponse.json(
        { error: 'Error al crear la reserva' },
        { status: 500 }
      )
    }

    console.log(`✅ Reserva creada: Usuario ${session.profileId} -> Clase ${classId}`)

    return NextResponse.json(
      {
        success: true,
        booking,
        message: 'Reserva realizada con éxito'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en POST /api/classes/[id]/book:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/classes/[id]/book
 * Permite a un usuario cancelar su reserva de una clase
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verificar sesión del usuario
    const session = await verifySession()
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado. Debes iniciar sesión.' },
        { status: 401 }
      )
    }

    const { id: classId } = await params

    // 2. Buscar la reserva del usuario
    const { data: booking, error: findError } = await supabaseAdmin
      .from('class_bookings')
      .select('id, cancelled_at')
      .eq('class_id', classId)
      .eq('profile_id', session.profileId)
      .is('cancelled_at', null)
      .maybeSingle()

    if (findError || !booking) {
      return NextResponse.json(
        { error: 'No tienes una reserva activa para esta clase' },
        { status: 404 }
      )
    }

    // 3. Cancelar la reserva
    const { error: updateError } = await supabaseAdmin
      .from('class_bookings')
      .update({
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', booking.id)

    if (updateError) {
      console.error('Error cancelando reserva:', updateError)
      return NextResponse.json(
        { error: 'Error al cancelar la reserva' },
        { status: 500 }
      )
    }

    console.log(`✅ Reserva cancelada: Usuario ${session.profileId} -> Clase ${classId}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Reserva cancelada con éxito'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en DELETE /api/classes/[id]/book:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
