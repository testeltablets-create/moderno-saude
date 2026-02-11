import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, MessageSquare, MapPin, Star, ShieldCheck } from "lucide-react"
import BookingWidget from "@/components/BookingWidget"
import { Metadata } from "next"

interface ProfessionalProfilePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProfessionalProfilePageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, specialty, bio")
    .eq("id", id)
    .single()

  if (!profile) return { title: "Profissional não encontrado" }

  return {
    title: `${profile.full_name} | ${profile.specialty} no Moderno Saúde`,
    description: profile.bio?.substring(0, 160) || `Agende sua consulta com ${profile.full_name}, especialista em ${profile.specialty}.`,
  }
}

export default async function ProfessionalProfilePage({ params }: ProfessionalProfilePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !profile) {
    notFound()
  }

  // Fetch reviews for this professional
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles!patient_id(full_name, avatar_url)")
    .eq("professional_id", id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl border p-8 flex flex-col md:flex-row gap-8">
              <div className="w-32 h-32 md:w-48 md:h-48 relative rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 italic">Sem foto</div>
                )}
              </div>
              
              <div className="flex-grow space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                      {profile.is_verified && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verificado
                        </Badge>
                      )}
                    </div>
                    <p className="text-blue-600 font-semibold text-lg uppercase tracking-wider">
                      {profile.specialty} • {profile.professional_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    <span className="text-2xl font-bold text-yellow-700">{profile.rating_avg || "5.0"}</span>
                    <span className="text-gray-500 text-sm">({profile.reviews_count || 0} avaliações)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{profile.location_neighborhood}, {profile.location_city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-gray-400" />
                    <span>Registro: {profile.registry_number}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-bold text-lg mb-2">Sobre</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {profile.bio || "Este profissional ainda não adicionou uma biografia."}
                  </p>
                </div>
              </div>
            </section>

            {/* Feed/Galeria (Placeholder) */}
            <section className="bg-white rounded-2xl border p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" /> Feed & Atividades
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm italic">
                    Galeria #{i}
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-white rounded-2xl border p-8">
              <h3 className="text-xl font-bold mb-6">Avaliações dos Pacientes</h3>
              <div className="space-y-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                            {review.profiles?.avatar_url && (
                              <Image src={review.profiles.avatar_url} alt={review.profiles.full_name} fill className="object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{review.profiles?.full_name || "Paciente"}</p>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-center py-4">Ainda não há avaliações para este profissional.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="space-y-6">
            <BookingWidget 
              professionalId={profile.id} 
              professionalName={profile.full_name} 
            />

            <Card className="border-gray-200">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm">Dúvidas?</p>
                  <p className="text-xs text-gray-500">Fale com o profissional via WhatsApp</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}
