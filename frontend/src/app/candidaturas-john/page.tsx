'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building2, MapPin, Calendar, Clock } from "lucide-react"

interface Application {
  id: number;
  vaga: string;
  empresa: string;
  localizacao: string;
  dataAplicacao: string;
  status: string;
  tipo: string;
}

export default function Candidaturas() {
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [applications, setApplications] = useState<Application[]>([])
  const [error, setError] = useState('')
  const applicantEmail = "john@example.com" // Email fixo do candidato

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:8000/applicants/${applicantEmail}/applications`)

        if (!response.ok) {
          throw new Error(`Failed to fetch applications: ${response.status}`)
        }

        const data = await response.json()
        setApplications(data)
      } catch (err) {
        console.error('Error fetching applications:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch applications')
      }
    }

    fetchApplications()
  }, [applicantEmail])

  const applicationsFiltradas = applications.filter(application =>
    filtroStatus === "todos" || application.status === filtroStatus
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
        <Link className="flex items-center justify-center" href="/candidato-john">
          <Briefcase className="h-6 w-6" />
          <span className="sr-only">Diversity Jobs</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/candidato-john">
            Início
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/perfil">
            Perfil
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/jobs">
            Vagas
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
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
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-between items-center mb-6">
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="Em análise">Em análise</SelectItem>
                      <SelectItem value="Entrevista agendada">Entrevista agendada</SelectItem>
                      <SelectItem value="Aprovado">Aprovado</SelectItem>
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
                    {applicationsFiltradas.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">{application.vaga}</div>
                          <div className="text-sm text-gray-500">{application.tipo}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4 text-gray-500" />
                            {application.empresa}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                            {application.localizacao}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            {new Date(application.dataAplicacao).toLocaleDateString('pt-BR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
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
