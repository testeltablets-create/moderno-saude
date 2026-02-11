"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    fullName: "",
    userType: "patient",
    professionalType: "",
    specialty: "",
    registryNumber: "",
    bio: "",
    city: "",
    neighborhood: ""
  })

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
        // Check if profile already exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          
        if (profile && profile.full_name) {
          router.push("/dashboard")
        }
      }
      setLoading(false)
    }
    checkUser()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: formData.fullName,
      professional_type: formData.userType === 'professional' ? formData.professionalType : 'outros',
      specialty: formData.specialty,
      registry_number: formData.registryNumber,
      bio: formData.bio,
      location_city: formData.city,
      location_neighborhood: formData.neighborhood,
      updated_at: new Date().toISOString()
    })

    if (error) {
      alert("Erro ao salvar: " + error.message)
    } else {
      router.push("/dashboard")
    }
    setSubmitting(false)
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bem-vindo ao Moderno Saúde</CardTitle>
          <CardDescription>Complete seu perfil para começar.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input 
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <Label>Você é um...</Label>
              <RadioGroup 
                defaultValue="patient" 
                value={formData.userType}
                onValueChange={(val) => setFormData({...formData, userType: val})}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient" className="font-normal">Paciente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional" className="font-normal">Profissional de Saúde</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.userType === 'professional' && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Área de Atuação</Label>
                    <Select onValueChange={(val) => setFormData({...formData, professionalType: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dentista">Dentista</SelectItem>
                        <SelectItem value="medico">Médico(a)</SelectItem>
                        <SelectItem value="psicologo">Psicólogo(a)</SelectItem>
                        <SelectItem value="fisioterapeuta">Fisioterapeuta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidade Principal</Label>
                    <Input 
                      id="specialty"
                      placeholder="Ex: Ortodontia, Cardiologia"
                      value={formData.specialty}
                      onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registry">Registro Profissional (CRO/CRM/CRP)</Label>
                  <Input 
                    id="registry"
                    required
                    value={formData.registryNumber}
                    onChange={(e) => setFormData({...formData, registryNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia / Sobre você</Label>
                  <Textarea 
                    id="bio"
                    placeholder="Fale um pouco sobre sua experiência e atendimento..."
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input 
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input 
                  id="neighborhood"
                  required
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {submitting ? "Salvando..." : "Concluir Perfil"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
