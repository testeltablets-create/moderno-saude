"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ChevronRight, 
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ReviewModal from "./ReviewModal"

export default function PatientDashboard({ userId }: { userId: string }) {
  const supabase = createClient()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  useEffect(() => {
    async function fetchAppointments() {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          profiles:professional_id (
            id,
            full_name,
            specialty,
            professional_type,
            avatar_url,
            location_city,
            location_neighborhood
          )
        `)
        .eq("patient_id", userId)
        .order("appointment_date", { ascending: false })

      if (!error) {
        setAppointments(data || [])
      }
      setLoading(false)
    }
    fetchAppointments()
  }, [userId, supabase])

  const openReviewModal = (app: any) => {
    setSelectedAppointment(app)
    setIsReviewModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Confirmado</Badge>
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">Pendente</Badge>
      case 'cancelled': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">Cancelado</Badge>
      case 'completed': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">Concluído</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{appointments.filter(a => a.status !== 'cancelled').length}</div>
              <div className="text-sm text-gray-500">Total de Consultas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" /> Histórico de Agendamentos
        </h2>

        {loading ? (
          <div className="flex justify-center py-12"><AlertCircle className="animate-spin" /></div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((app) => (
              <Card key={app.id} className="hover:border-blue-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
                        {app.profiles?.avatar_url && (
                          <img src={app.profiles.avatar_url} alt={app.profiles.full_name} className="object-cover w-full h-full" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{app.profiles?.full_name}</h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-sm text-blue-600 font-medium mb-2">{app.profiles?.specialty}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(app.appointment_date), "dd/MM/yyyy")}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(app.appointment_date), "HH:mm")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-end gap-2">
                      <Button variant="outline" size="sm" className="w-full md:w-auto">
                        Ver detalhes
                      </Button>
                      {(app.status === 'completed' || app.status === 'confirmed') && (
                        <Button 
                          size="sm" 
                          className="bg-yellow-500 hover:bg-yellow-600 text-white w-full md:w-auto"
                          onClick={() => openReviewModal(app)}
                        >
                          <Star className="w-3 h-3 mr-1" /> Avaliar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border rounded-2xl italic text-gray-400">
            Você ainda não realizou nenhum agendamento.
          </div>
        )}
      </section>

      {selectedAppointment && (
        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          appointmentId={selectedAppointment.id}
          professionalId={selectedAppointment.professional_id}
          professionalName={selectedAppointment.profiles?.full_name}
          patientId={userId}
        />
      )}
    </div>
  )
}
