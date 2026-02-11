"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Filter, Loader2 } from "lucide-react"
import Image from "next/image"

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q") || ""
  const l = searchParams.get("l") || ""

  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchResults() {
      setLoading(true)
      let query = supabase
        .from("profiles")
        .select("*")
        .neq("professional_type", "outros")

      if (q) {
        query = query.or(`full_name.ilike.%${q}%,specialty.ilike.%${q}%`)
      }
      if (l) {
        query = query.or(`location_city.ilike.%${l}%,location_neighborhood.ilike.%${l}%`)
      }

      const { data, error } = await query
      
      if (!error) {
        setResults(data || [])
      }
      setLoading(false)
    }
    fetchResults()
  }, [q, l, supabase])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow flex items-center bg-white border rounded-lg px-4 gap-2">
          <Search className="text-gray-400 w-5 h-5" />
          <Input 
            placeholder="Especialidade ou nome..." 
            className="border-0 focus-visible:ring-0" 
            defaultValue={q}
          />
        </div>
        <div className="flex-grow flex items-center bg-white border rounded-lg px-4 gap-2">
          <MapPin className="text-gray-400 w-5 h-5" />
          <Input 
            placeholder="Localização..." 
            className="border-0 focus-visible:ring-0"
            defaultValue={l}
          />
        </div>
        <Button className="bg-blue-600">Filtrar</Button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filtros */}
        <aside className="hidden lg:block w-64 space-y-6">
          <div className="font-bold flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtros
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="dentista" /> <label htmlFor="dentista">Dentistas</label>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="medico" /> <label htmlFor="medico">Médicos</label>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" id="psicologo" /> <label htmlFor="psicologo">Psicólogos</label>
              </div>
            </div>
          </div>
        </aside>

        {/* Results List */}
        <div className="flex-grow space-y-4">
          <h2 className="text-xl font-bold mb-4">
            {loading ? "Buscando..." : `${results.length} profissionais encontrados`}
          </h2>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : (
            results.map((prof) => (
              <Card key={prof.id} className="overflow-hidden hover:border-blue-300 transition-colors">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-48 bg-gray-100 relative">
                    {prof.avatar_url ? (
                      <Image src={prof.avatar_url} alt={prof.full_name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 italic">Sem foto</div>
                    )}
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold">{prof.full_name}</h3>
                          {prof.is_verified && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Verificado</Badge>}
                        </div>
                        <p className="text-blue-600 font-medium text-sm uppercase tracking-wider">{prof.specialty || prof.professional_type}</p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Star className="w-4 h-4 fill-current" />
                        {prof.rating_avg || "5.0"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {prof.location_neighborhood}, {prof.location_city}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Próximo horário: Hoje 14:00</p>
                      <Button className="bg-blue-600">Ver Perfil e Agendar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-20 border rounded-xl bg-gray-50">
              <p className="text-gray-500">Nenhum profissional encontrado com esses filtros.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
