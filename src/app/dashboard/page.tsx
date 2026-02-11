"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut, User, Calendar } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      
      if (!profile || !profile.full_name) {
        router.push("/onboarding")
      } else {
        setProfile(profile)
      }
      setLoading(false)
    }
    getData()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Olá, {profile?.full_name}!</h1>
          <p className="text-gray-500">Bem-vindo ao seu painel de controle.</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200">
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500">Agendamentos</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium">{profile?.professional_type === 'outros' ? 'Paciente' : 'Profissional'}</div>
            <div className="text-xs text-gray-400">Tipo de Conta</div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-white p-8 rounded-xl border text-center">
        <p className="text-gray-400">Novas funcionalidades de agendamento e perfil social em breve!</p>
      </div>
    </div>
  )
}
