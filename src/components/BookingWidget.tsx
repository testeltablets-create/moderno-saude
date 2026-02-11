"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, Clock, Loader2, CheckCircle2 } from "lucide-react"
import { format, addDays, startOfDay, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface Slot {
  id: string
  start_time: string
  end_time: string
  is_locked: boolean
}

interface BookingWidgetProps {
  professionalId: string
  professionalName: string
}

export default function BookingWidget({ professionalId, professionalName }: BookingWidgetProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()))
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [booking, setBooking] = useState(false)
  const [booked, setBooked] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    async function fetchSlots() {
      setLoadingSlots(true)
      const start = selectedDate.toISOString()
      const end = addDays(selectedDate, 1).toISOString()

      const { data, error } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("professional_id", professionalId)
        .gte("start_time", start)
        .lt("start_time", end)
        .eq("is_locked", false)

      if (!error) {
        setSlots(data || [])
      }
      setLoadingSlots(false)
    }
    fetchSlots()
  }, [selectedDate, professionalId, supabase])

  const handleBooking = async () => {
    if (!user) {
      router.push(`/login?returnTo=/profissionais/${professionalId}`)
      return
    }

    if (!selectedSlot) return

    setBooking(true)
    
    // 1. Lock the slot (Simplified for now, just checking if still available)
    const { data: slotCheck } = await supabase
      .from("availability_slots")
      .select("is_locked")
      .eq("id", selectedSlot.id)
      .single()

    if (slotCheck?.is_locked) {
      alert("Desculpe, este horário acabou de ser reservado.")
      setBooking(false)
      return
    }

    // 2. Create the appointment
    const { error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        patient_id: user.id,
        professional_id: professionalId,
        appointment_date: selectedSlot.start_time,
        status: 'pending'
      })

    if (appointmentError) {
      alert("Erro ao agendar: " + appointmentError.message)
    } else {
      // 3. Mark slot as locked (In a real app, we'd probably delete it or use a better locking mechanism)
      await supabase
        .from("availability_slots")
        .update({ is_locked: true, locked_until: new Date(Date.now() + 10 * 60000).toISOString() })
        .eq("id", selectedSlot.id)

      setBooked(true)
    }
    setBooking(false)
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfDay(new Date()), i))

  if (booked) {
    return (
      <Card className="border-2 border-green-500 bg-green-50">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800">Agendamento Realizado!</h3>
          <p className="text-green-700">
            Sua consulta com <strong>{professionalName}</strong> foi reservada para o dia {format(selectedDate, "dd/MM")} às {format(new Date(selectedSlot!.start_time), "HH:mm")}.
          </p>
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => router.push("/dashboard")}>
            Ir para meus agendamentos
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-24 border-2 border-blue-100 shadow-xl shadow-blue-50">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" /> Agendar Consulta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Valor da consulta</span>
            <span className="text-xl font-bold text-blue-700">R$ 250,00</span>
          </div>
          
          <div className="space-y-3 pt-2">
            <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Selecione o dia</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {days.map((day) => (
                <Button 
                  key={day.toISOString()} 
                  variant="outline" 
                  onClick={() => {
                    setSelectedDate(day)
                    setSelectedSlot(null)
                  }}
                  className={`h-14 min-w-16 flex flex-col gap-0 flex-shrink-0 ${isSameDay(selectedDate, day) ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : ""}`}
                >
                  <span className="text-[10px] uppercase">{format(day, "eee", { locale: ptBR })}</span>
                  <span className="text-lg font-bold">{format(day, "dd")}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Horários disponíveis</p>
            {loadingSlots ? (
              <div className="flex justify-center py-4"><Loader2 className="animate-spin text-blue-600" /></div>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <Button 
                    key={slot.id} 
                    variant="outline" 
                    onClick={() => setSelectedSlot(slot)}
                    className={`text-sm py-2 px-0 transition-colors ${selectedSlot?.id === slot.id ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50"}`}
                  >
                    {format(new Date(slot.start_time), "HH:mm")}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed italic">
                Nenhum horário disponível para este dia.
              </p>
            )}
          </div>
        </div>

        <Button 
          className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 font-bold"
          disabled={!selectedSlot || booking}
          onClick={handleBooking}
        >
          {booking ? <Loader2 className="animate-spin mr-2" /> : null}
          {booking ? "Agendando..." : "Confirmar Agendamento"}
        </Button>
        
        <p className="text-[10px] text-center text-gray-400 px-4">
          {!user ? "Você precisará fazer login para agendar." : "Pagamento realizado após a consulta ou via app."}
        </p>
      </CardContent>
    </Card>
  )
}
