import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Stethoscope, Briefcase, BrainCircuit } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Saúde moderna ao seu alcance.
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            Encontre e agende consultas com dentistas, médicos e psicólogos em minutos.
          </p>
          
          <div className="bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-grow flex items-center px-4 gap-2 border-b md:border-b-0 md:border-r">
              <Search className="text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Qual especialidade ou profissional?" 
                className="border-0 focus-visible:ring-0 text-gray-800 placeholder:text-gray-400"
              />
            </div>
            <div className="flex-grow flex items-center px-4 gap-2">
              <MapPin className="text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Em qual cidade ou bairro?" 
                className="border-0 focus-visible:ring-0 text-gray-800 placeholder:text-gray-400"
              />
            </div>
            <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-lg px-8 py-6 h-auto rounded-lg">
              Buscar agora
            </Button>
          </div>
        </div>
      </section>

      {/* Categorias Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Encontre por especialidade
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-blue-50">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Odontologia</h3>
                <p className="text-gray-500 mb-6 text-sm">Cuidado completo para o seu sorriso com os melhores especialistas.</p>
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">Ver Dentistas</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-50">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <Stethoscope className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Medicina</h3>
                <p className="text-gray-500 mb-6 text-sm">Clínicos e especialistas prontos para cuidar da sua saúde integral.</p>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">Ver Médicos</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-50">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <BrainCircuit className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Psicologia</h3>
                <p className="text-gray-500 mb-6 text-sm">Apoio profissional para o seu bem-estar mental e emocional.</p>
                <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">Ver Psicólogos</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Por que escolher o Moderno Saúde?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mt-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
              <div>
                <h4 className="font-bold mb-2">Reviews Auditados</h4>
                <p className="text-sm text-gray-600">Somente pacientes comprovados podem avaliar os profissionais.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
              <div>
                <h4 className="font-bold mb-2">Agendamento Real</h4>
                <p className="text-sm text-gray-600">Sem ligações. Escolha o horário e agende direto pelo site.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
              <div>
                <h4 className="font-bold mb-2">Profissionais Verificados</h4>
                <p className="text-sm text-gray-600">Validamos o registro profissional de cada especialista.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
              <div>
                <h4 className="font-bold mb-2">Multidisciplinar</h4>
                <p className="text-sm text-gray-600">Resolva todas as suas necessidades de saúde em um só lugar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
