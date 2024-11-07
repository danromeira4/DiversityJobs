'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building2, MapPin, Calendar, Clock } from "lucide-react"

// Dados simulados para as candidaturas
const candidaturas = [
  {
    id: 1,
    vaga: "Engenheiro de Software",
    empresa: "TechCorp",
    localizacao: "São Paulo, SP",
    dataAplicacao: "2024-03-01",
    status: "Em análise",
    tipo: "Híbrido",
  },
  {
    id: 2,
    vaga: "Designer UX",
    empresa: "DesignHub",
    localizacao: "Rio de Janeiro, RJ",
    dataAplicacao: "2024-02-28",
    status: "Entrevista agendada",
    tipo: "Remoto",
  },
  {
    id: 3,
    vaga: "Analista de Dados",
    empresa: "DataDriven",
    localizacao: "Belo Horizonte, MG",
    dataAplicacao: "2024-02-25",
    status: "Aprovado",
    tipo: "Híbrido",
  },
  {
    id: 4,
    vaga: "Gerente de Produto",
    empresa: "InovaTech",
    localizacao: "Curitiba, PR",
    dataAplicacao: "2024-03-02",
    status: "Rejeitado",
    tipo: "Presencial",
  },
  {
    id: 5,
    vaga: "Desenvolvedor Frontend",
    empresa: "WebSolutions",
    localizacao: "Porto Alegre, RS",
    dataAplicacao: "2024-02-20",
    status: "Em análise",
    tipo: "Presencial",
  },
]

export default function Candidaturas() {
  const [filtroStatus, setFiltroStatus] = useState("todos")

  const candidaturasFiltradas = candidaturas.filter(candidatura => 
    filtroStatus === "todos" || candidatura.status === filtroStatus
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em análise":
        return "bg-yellow-100 text-yellow-800"
      case "Entrevista agendada":
        return "bg-blue-100 text-blue-800"
      case "Rejeitado":
        return "bg-red-100 text-red-800"
      case "Aprovado":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Briefcase className="h-6 w-6" />
          <span className="sr-only">Diversity Jobs</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Início
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Buscar Vagas
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Perfil
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Sair
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
              Minhas Candidaturas
            </h1>
            <Card>
              <CardHeader>
                <CardTitle>Acompanhe suas candidaturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="Em análise">Em análise</SelectItem>
                      <SelectItem value="Entrevista agendada">Entrevista agendada</SelectItem>
                      <SelectItem value="Aprovado para próxima fase">Aprovado para próxima fase</SelectItem>
                      <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">Exportar Relatório</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaga</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Data de Aplicação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidaturasFiltradas.map((candidatura) => (
                      <TableRow key={candidatura.id}>
                        <TableCell>
                          <div className="font-medium">{candidatura.vaga}</div>
                          <div className="text-sm text-gray-500">{candidatura.tipo}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4 text-gray-500" />
                            {candidatura.empresa}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                            {candidatura.localizacao}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            {new Date(candidatura.dataAplicacao).toLocaleDateString('pt-BR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(candidatura.status)}>
                            {candidatura.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Ver Detalhes</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  Última atualização: {new Date().toLocaleString('pt-BR')}
                </div>
                <Button variant="outline">Atualizar</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Diversity Jobs. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Política de Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
}