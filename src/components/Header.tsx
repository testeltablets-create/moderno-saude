"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">Moderno Saúde</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/busca" className="hover:text-blue-600">Buscar Profissionais</Link>
          <Link href="/como-funciona" className="hover:text-blue-600">Como funciona</Link>
          <Link href="/contato" className="hover:text-blue-600">Contato</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/cadastro">Cadastrar-se</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
