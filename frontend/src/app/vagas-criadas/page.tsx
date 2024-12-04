'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building2, MapPin, Calendar, Clock, Plus, Search, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function DashboardEmpresa() {
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroNome, setFiltroNome] = useState("")
  const [filtroGruposSociais, setFiltroGruposSociais] = useState<string[]>([])
  const [vagasEmpresa, setVagasEmpresa] = useState([])
  const businessEmail = "tech@company.com"
  //const businessEmail = "retail@store.com" // Email fixo do business
  const [novaVaga, setNovaVaga] = useState({
    business_email: businessEmail,
    job_title: "",
    job_description: "",
    location: "",
    salary_range: "",
    requirements: "",
    application_deadline: "",
    application_process: "",
    social_group: [] as string[],
    posted_date: new Date().toISOString().split('T')[0]
  })

  const gruposSociais = ["LGBTQIA+", "Mulheres", "Pessoas Negras", "PCD", "Neurodiversidade", "Profissional 50+", "Outros"]

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:8000/businesses/${businessEmail}/jobs`)
        if (response.ok) {
          const jobs = await response.json()
          setVagasEmpresa(jobs)
        } else {
          console.error('Failed to fetch jobs:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
      }
    }

    fetchJobs()
  }, [businessEmail])

  const vagasFiltradas = vagasEmpresa.filter(vaga =>
    (filtroStatus === "todos" || vaga.status === filtroStatus) &&
    (filtroNome === "" || vaga.job_title.toLowerCase().includes(filtroNome.toLowerCase())) &&
    (filtroGruposSociais.length === 0 || filtroGruposSociais.some(grupo => vaga.social_group.includes(grupo)))
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
    setNovaVaga((prev) => {
      const isSelected = prev.social_group.includes(type)
      return {
        ...prev,
        social_group: isSelected
          ? prev.social_group.filter((item) => item !== type)
          : [...prev.social_group, type]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaVaga),
      })

      if (response.ok) {
        const jobsResponse = await fetch(`http://localhost:8000/businesses/${businessEmail}/jobs`)
        if (jobsResponse.ok) {
          const jobs = await jobsResponse.json()
          setVagasEmpresa(jobs)
          setNovaVaga({
            business_email: businessEmail,
            job_title: "",
            job_description: "",
            location: "",
            salary_range: "",
            requirements: "",
            application_deadline: "",
            application_process: "",
            social_group: [],
            posted_date: new Date().toISOString().split('T')[0]
          })
        } else {
          console.error('Failed to refresh jobs:', jobsResponse.status, jobsResponse.statusText)
        }
      } else {
        const errorData = await response.json().catch(() => null)
        console.error('Error creating job:', errorData)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleGrupoSocialChange = (grupo: string) => {
    setFiltroGruposSociais(prev =>
      prev.includes(grupo)
        ? prev.filter(g => g !== grupo)
        : [...prev, grupo]
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/empresa">
          <Building2 className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">Empresas</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/empresa">
            Início
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/vagas-criadas">
            Minhas Vagas
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Sair
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Minhas Vagas
              </h1>
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="job_title" placeholder="Título da Vaga" value={novaVaga.job_title} onChange={handleInputChange} required />
                    <Textarea name="job_description" placeholder="Descrição" value={novaVaga.job_description} onChange={handleInputChange} required />
                    <Input name="location" placeholder="Localização" value={novaVaga.location} onChange={handleInputChange} required />
                    <Input name="salary_range" placeholder="Faixa Salarial" value={novaVaga.salary_range} onChange={handleInputChange} required />
                    <Textarea name="requirements" placeholder="Requisitos" value={novaVaga.requirements} onChange={handleInputChange} required />
                    <Input name="application_deadline" type="date" value={novaVaga.application_deadline} onChange={handleInputChange} required />
                    <Input name="application_process" placeholder="Processo de Aplicação" value={novaVaga.application_process} onChange={handleInputChange} required />
                    <div className="grid grid-cols-3 gap-2">
                      {gruposSociais.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={type} checked={novaVaga.social_group.includes(type)} onCheckedChange={() => handleCheckboxChange(type)} />
                          <Label htmlFor={type}>{type}</Label>
                        </div>
                      ))}
                    </div>
                    <Button type="submit">Criar</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Vagas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      placeholder="Buscar por nome da vaga"
                      value={filtroNome}
                      onChange={(e) => setFiltroNome(e.target.value)}
                      className="w-full"
                    />
                  </div>
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
                  <Select
                    onValueChange={(value) => handleGrupoSocialChange(value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Grupos Sociais" />
                    </SelectTrigger>
                    <SelectContent>
                      {gruposSociais.map((grupo) => (
                        <SelectItem key={grupo} value={grupo}>
                          {grupo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {filtroGruposSociais.map((grupo) => (
                      <Badge key={grupo} variant="secondary" className="px-2 py-1">
                        {grupo}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-auto p-0"
                          onClick={() => handleGrupoSocialChange(grupo)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline">Exportar Relatório</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaga</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Grupos Sociais</TableHead>
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
                          <div className="flex flex-wrap gap-2">
                            {vaga.social_group.map((group: string, index: number) => (
                              <Badge key={index} className="bg-blue-100 text-blue-800">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link href={`/vagas-criadas/${vaga.job_id}`}>
                            <Button variant="ghost" size="sm">Editar</Button>
                          </Link>
                          <Link href={`/vagas-criadas/${vaga.job_id}`}>
                            <Button variant="ghost" size="sm">Ver Candidatos</Button>
                          </Link>
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
      <footer className="py-6 px-4 border-t">
        <p className="text-center text-sm text-gray-500">© 2024 TechCorp. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

