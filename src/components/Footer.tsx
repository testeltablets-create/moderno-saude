export function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-600">Moderno Saúde</h3>
            <p className="text-sm text-gray-500">
              Conectando você aos melhores profissionais de saúde de forma simples e segura.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Para Pacientes</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Buscar Dentistas</li>
              <li>Buscar Médicos</li>
              <li>Buscar Psicólogos</li>
              <li>Agendamento Online</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Para Profissionais</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Cadastrar Consultório</li>
              <li>Planos e Preços</li>
              <li>SaaS Dentista Moderno</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Central de Ajuda</li>
              <li>Termos de Uso</li>
              <li>Privacidade</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Moderno Saúde. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
