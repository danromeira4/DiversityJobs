'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building2, MapPin, Calendar, Clock, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function DashboardEmpresa() {
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [vagasEmpresa, setVagasEmpresa] = useState([])
  const [businessEmail, setBusinessEmail] = useState("business@example.com")
  const [novaVaga, setNovaVaga] = useState({
    business_email: "business@example.com", // Changed from business_id to business_email
    job_title: "",
    job_description: "",
    location: "",
    salary_range: "",
    requirements: "",
    application_deadline: "",
    application_process: "",
    disability_type: "",
    posted_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:8000/businesses/${businessEmail}/jobs`)
        if (response.ok) {
          const jobs = await response.json()
          setVagasEmpresa(jobs)
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
      }
    }

    fetchJobs()
  }, [businessEmail])

  const vagasFiltradas = vagasEmpresa.filter(vaga => 
    filtroStatus === "todos" || vaga.status === filtroStatus
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberta":
        return "bg-green-100 text-green-800"
      case "Em revisão":
        return "bg-yellow-100 text-yellow-800"
      case "Fechada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNovaVaga(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (type: string) => {
    setNovaVaga(prev => ({
      ...prev,
      disability_type: type
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Update business_email before submitting
    const jobData = {
      ...novaVaga,
      business_email: businessEmail
    }
    
    try {
      const response = await fetch('http://localhost:8000/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      if (response.ok) {
        try {
          // Refresh jobs list
          const jobsResponse = await fetch(`http://localhost:8000/businesses/${businessEmail}/jobs`)
          if (!jobsResponse.ok) {
            throw new Error(`Failed to fetch jobs: ${jobsResponse.status} ${jobsResponse.statusText}`)
          }
          const jobs = await jobsResponse.json()
          setVagasEmpresa(jobs)

          // Reset form
          setNovaVaga({
            business_email: businessEmail,
            job_title: "",
            job_description: "", 
            location: "",
            salary_range: "",
            requirements: "",
            application_deadline: "",
            application_process: "",
            disability_type: "",
            posted_date: new Date().toISOString().split('T')[0]
          })
        } catch (error) {
          console.error('Error refreshing jobs list:', error)
        }
      } else {
        const errorData = await response.json().catch(() => null)
        console.error('Error creating job:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Building2 className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">TechCorp</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Candidatos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Relatórios
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Configurações
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Dashboard de Vagas
                </h1>
                <div className="flex items-center gap-2">
                  <Label htmlFor="email-input">Email da Empresa:</Label>
                  <Input
                    id="email-input"
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="w-[300px]"
                  />
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Criar Nova Vaga
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Vaga</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="business_email">Email da Empresa</Label>
                      <Input
                        id="business_email"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="job_title">Título da Vaga</Label>
                      <Input
                        id="job_title"
                        name="job_title"
                        value={novaVaga.job_title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="job_description">Descrição da Vaga</Label>
                      <Textarea
                        id="job_description"
                        name="job_description"
                        value={novaVaga.job_description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Localização</Label>
                      <Input
                        id="location"
                        name="location"
                        value={novaVaga.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary_range">Faixa Salarial</Label>
                      <Input
                        id="salary_range"
                        name="salary_range"
                        value={novaVaga.salary_range}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="requirements">Requisitos</Label>
                      <Textarea
                        id="requirements"
                        name="requirements"
                        value={novaVaga.requirements}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="application_deadline">Prazo de Inscrição</Label>
                      <Input
                        id="application_deadline"
                        name="application_deadline"
                        type="date"
                        value={novaVaga.application_deadline}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="application_process">Método de Aplicação</Label>
                      <Input
                        id="application_process"
                        name="application_process"
                        value={novaVaga.application_process}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Tipos de Deficiência</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['fisica', 'visual', 'auditiva', 'intelectual', 'multipla'].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={novaVaga.disability_type === type}
                              onCheckedChange={() => handleCheckboxChange(type)}
                            />
                            <Label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" className="col-span-2">Criar Vaga</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Vagas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="Aberta">Aberta</SelectItem>
                      <SelectItem value="Em revisão">Em revisão</SelectItem>
                      <SelectItem value="Fechada">Fechada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">Exportar Relatório</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaga</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vagasFiltradas.map((vaga) => (
                      <TableRow key={vaga.job_id}>
                        <TableCell>
                          <div className="font-medium">{vaga.job_title}</div>
                          <div className="text-sm text-gray-500">{vaga.job_type}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                            {vaga.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            {new Date(vaga.posted_date).toLocaleDateString('pt-BR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(vaga.status || 'Aberta')}>
                            {vaga.status || 'Aberta'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Editar</Button>
                          <Button variant="ghost" size="sm">Ver Candidatos</Button>
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
        <p className="text-xs text-gray-500">© 2024 TechCorp. Todos os direitos reservados.</p>
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