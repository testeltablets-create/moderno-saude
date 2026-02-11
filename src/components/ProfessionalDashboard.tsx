"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { format, isToday, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ProfessionalDashboard({ userId }: { userId: string }) {
  const supabase = createClient()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAppointments() {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patient:patient_id (
            full_name,
            avatar_url
          )
        `)
        .eq("professional_id", userId)
        .order("appointment_date", { ascending: true })

      if (!error) {
        setAppointments(data || [])
      }
      setLoading(false)
    }
    fetchAppointments()
  }, [userId, supabase])

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
    
    if (!error) {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a))
    }
  }

  const upcoming = appointments.filter(a => (isToday(new Date(a.appointment_date)) || isFuture(new Date(a.appointment_date))) && a.status !== 'cancelled')

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{upcoming.length}</div>
              <div className="text-sm text-gray-500">Próximas Consultas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{new Set(appointments.map(a => a.patient_id)).size}</div>
              <div className="text-sm text-gray-500">Pacientes Totais</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">R$ 0</div>
              <div className="text-sm text-gray-500">Ganhos do Mês</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agenda */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Agenda Recente
          </h2>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(0, 10).map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center bg-gray-50 p-2 rounded-lg border min-w-16">
                          <div className="text-[10px] uppercase text-gray-400 font-bold">{format(new Date(app.appointment_date), "MMM", { locale: ptBR })}</div>
                          <div className="text-xl font-bold text-blue-600">{format(new Date(app.appointment_date), "dd")}</div>
                        </div>
                        <div>
                          <p className="font-bold">{app.patient?.full_name || "Paciente"}</p>
                          <p className="text-xs text-gray-500">{format(new Date(app.appointment_date), "HH:mm")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {app.status === 'pending' ? (
                          <>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleUpdateStatus(app.id, 'cancelled')}>
                              <XCircle className="w-5 h-5" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-green-500 hover:text-green-600" onClick={() => handleUpdateStatus(app.id, 'confirmed')}>
                              <CheckCircle2 className="w-5 h-5" />
                            </Button>
                          </>
                        ) : (
                          <Badge variant={app.status === 'confirmed' ? 'default' : 'secondary'}>
                            {app.status === 'confirmed' ? 'Confirmado' : app.status}
                          </Badge>
                        )}
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border rounded-2xl italic text-gray-400">
              Nenhuma consulta agendada ainda.
            </div>
          )}
        </div>

        {/* Sidebar: Availability (Simple placeholder) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Disponibilidade
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Configurar Horários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-gray-500">Acesse as configurações para definir seus horários de atendimento e pausas.</p>
              <Button variant="outline" className="w-full text-xs" disabled>
                Gerenciar Slots (Em breve)
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-200" /> Seja Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-blue-100">Desbloqueie gestão completa de agenda, relatórios financeiros e maior destaque na busca.</p>
              <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold" asChild>
                <a href="https://www.asaas.com/checkout/mock" target="_blank" rel="noopener noreferrer">
                  Upgrade por R$ 49/mês
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
