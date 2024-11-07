'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Briefcase, MapPin, Building2, Search, Filter, X } from "lucide-react"

// Dados simulados para as vagas
const jobListings = [
  {
    id: 1,
    title: "Engenheiro de Software",
    company: "TechCorp",
    location: "Belo Horizonte, MG",
    type: "Remoto",
    tags: ["LGBTQIA+", "Mulheres"],
    description: "Estamos procurando um engenheiro de software talentoso para se juntar à nossa equipe dinâmica...",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    benefits: ["Plano de saúde", "Vale refeição", "Horário flexível", "Home office"],
    salary: "R$ 8.000 - R$ 12.000",
  },
  {
    id: 2,
    title: "Gerente de Marketing",
    company: "Globo",
    location: "Rio de Janeiro, RJ",
    type: "Híbrido",
    tags: ["Pessoas Negras"],
    description: "Buscamos um gerente de marketing experiente para liderar nossas estratégias de crescimento...",
    skills: ["Marketing digital", "SEO", "Análise de dados", "Gestão de equipe"],
    benefits: ["Plano de saúde e odontológico", "Vale transporte", "Bônus anual"],
    salary: "R$ 10.000 - R$ 15.000",
  },
  {
    id: 3,
    title: "Designer UX",
    company: "DesignHub",
    location: "São Paulo, SP",
    type: "Híbrido",
    tags: ["Pessoas com Deficiência", "Neurodiversidade"],
    description: "Procuramos um designer UX criativo para melhorar a experiência do usuário em nossos produtos...",
    skills: ["Figma", "Adobe XD", "Pesquisa de usuário", "Prototipagem"],
    benefits: ["Equipamento fornecido", "Cursos de aperfeiçoamento", "Horário flexível"],
    salary: "R$ 6.000 - R$ 9.000",
  },
  {
    id: 4,
    title: "Analista de Dados",
    company: "DataDriven",
    location: "Belo Horizonte, MG",
    type: "Remoto",
    tags: ["Mulheres", "Pessoas Negras"],
    description: "Estamos à procura de um analista de dados perspicaz para transformar dados brutos em insights...",
    skills: ["SQL", "Python", "Tableau", "Machine Learning"],
    benefits: ["Plano de saúde", "Vale alimentação", "Dia de trabalho remoto"],
    salary: "R$ 4.000 - R$ 6.000 (proporcional)",
  },
  {
    id: 5,
    title: "Especialista em Suporte ao Cliente",
    company: "ServiceFirst",
    location: "Porto Alegre, RS",
    type: "Presencial",
    tags: ["LGBTQIA+"],
    description: "Procuramos um especialista em suporte ao cliente empático e orientado para soluções...",
    skills: ["Atendimento ao cliente", "Resolução de problemas", "CRM", "Comunicação escrita e verbal"],
    benefits: ["Plano de saúde", "Vale refeição", "Plano de carreira"],
    salary: "R$ 3.500 - R$ 5.000",
  },
  {
    id: 6,
    title: "Engenheiro Quimico",
    company: "Bayer",
    location: "Cascavel, PR",
    type: "Remoto",
    tags: ["Profissional 50+"],
    description: "Precisamos de um profissional experiente na área de engenharia químico para supervisionar os processos da nossa indústria.",
    skills: ["Química", "Gestão"],
    benefits: ["Gym pass", "Vale refeição", "Plano de saúde", "Day Off"],
    salary: "R$5000",
  }
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedJob, setSelectedJob] = useState<typeof jobListings[0] | null>(null)

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleJobTypeChange = (value: string) => {
    // Se "all" for selecionado, define um array com todos os tipos
    setSelectedJobType(value === "all" ? "" : value);
  };

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesJobType = selectedJobType === "" || job.type === selectedJobType
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => job.tags.includes(tag))
    return matchesSearch && matchesJobType && matchesTags
  })

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
            Sobre Nós
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Recursos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contato
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
              Encontre Seu Espaço Inclusivo
            </h1>
            <div className="grid gap-6 lg:grid-cols-[1fr_3fr]">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Filtros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-type">Tipo de Trabalho</Label>
                    <Select onValueChange={handleJobTypeChange}>
                      <SelectTrigger id="job-type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Tipos</SelectItem>
                        <SelectItem value="Presencial">Presencial</SelectItem>
                        <SelectItem value="Híbrido">Híbrido</SelectItem>
                        <SelectItem value="Remoto">Remoto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Grupos de Diversidade</Label>
                    <div className="space-y-2">
                      {["LGBTQIA+", "Mulheres", "Pessoas Negras", "Pessoas com Deficiência", "Neurodiversidade", "Profissional 50+"].map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={tag}
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={() => handleTagToggle(tag)}
                          />
                          <label
                            htmlFor={tag}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Search className="text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar vagas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button>
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Card key={job.id}>
                      <CardHeader>
                        <CardTitle>{job.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Building2 className="mr-1 h-4 w-4" />
                            {job.company}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {job.location}
                          </span>
                          <span>{job.type}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => setSelectedJob(job)}>Ver Detalhes</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{selectedJob?.title}</DialogTitle>
                              <DialogDescription>{selectedJob?.company} - {selectedJob?.location}</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Descrição</Label>
                                <p className="col-span-3">{selectedJob?.description}</p>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Habilidades</Label>
                                <div className="col-span-3 flex flex-wrap gap-2">
                                  {selectedJob?.skills.map((skill, index) => (
                                    <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Benefícios</Label>
                                <ul className="col-span-3 list-disc list-inside">
                                  {selectedJob?.benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Salário</Label>
                                <p className="col-span-3">{selectedJob?.salary}</p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Candidatar-se</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
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