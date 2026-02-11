"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut, User, Calendar, Home, Settings, Search } from "lucide-react"
import Link from "next/link"
import PatientDashboard from "@/components/PatientDashboard"
import ProfessionalDashboard from "@/components/ProfessionalDashboard"

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

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" /></div>

  const isProfessional = profile?.professional_type !== 'outros'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold text-blue-600">Moderno Saúde</Link>
        </div>
        <nav className="flex-grow px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
            <Home className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/busca" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Search className="w-5 h-5" /> Buscar
          </Link>
          <Link href="/perfil" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <User className="w-5 h-5" /> Meu Perfil
          </Link>
          <Link href="/configuracoes" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Settings className="w-5 h-5" /> Configurações
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8">
          <div className="md:hidden font-bold text-blue-600">Moderno Saúde</div>
          <div className="hidden md:block text-sm text-gray-500">
            Painel do {isProfessional ? 'Profissional' : 'Paciente'}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold leading-tight">{profile?.full_name}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{profile?.specialty || 'Paciente'}</div>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              {profile?.full_name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Olá, {profile?.full_name.split(' ')[0]}!</h1>
            <p className="text-gray-500">
              {isProfessional 
                ? "Veja como está sua agenda para os próximos dias." 
                : "Acompanhe seus agendamentos e histórico de consultas."}
            </p>
          </div>

          {isProfessional ? (
            <ProfessionalDashboard userId={user.id} />
          ) : (
            <PatientDashboard userId={user.id} />
          )}
        </div>
      </main>
    </div>
  )
}
