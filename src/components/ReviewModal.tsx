"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Loader2 } from "lucide-react"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: string
  professionalId: string
  professionalName: string
  patientId: string
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  appointmentId, 
  professionalId, 
  professionalName,
  patientId
}: ReviewModalProps) {
  const supabase = createClient()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    
    const { error } = await supabase.from("reviews").insert({
      appointment_id: appointmentId,
      patient_id: patientId,
      professional_id: professionalId,
      rating,
      comment,
      is_verified: true
    })

    if (error) {
      alert("Erro ao enviar avaliação: " + error.message)
    } else {
      // Update professional rating_avg (Simplified: in a real app this would be a trigger)
      // For now we just close and assume the user is happy
      onClose()
      alert("Obrigado pela sua avaliação!")
    }
    setSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar atendimento</DialogTitle>
          <DialogDescription>
            Como foi sua consulta com <strong>{professionalName}</strong>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-2">
            <Label>Sua nota</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-10 h-10 ${star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comentário (opcional)</Label>
            <Textarea 
              id="comment" 
              placeholder="Conte-nos mais sobre sua experiência..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-32"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancelar</Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleSubmit} 
            disabled={submitting}
          >
            {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            Enviar Avaliação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
