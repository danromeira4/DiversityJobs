'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Briefcase, MapPin, Building2, Search, Filter, X } from "lucide-react"

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  tags: string[]
  description: string
  skills: string[]
  benefits: string[]
  salary: string
}

export default function JobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedCity, setSelectedCity] = useState("")

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:8000/jobs')
        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }
        const data = await response.json()
        setJobs(data)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      }
    }

    fetchJobs()
  }, [])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleJobTypeChange = (value: string) => {
    setSelectedJobType(value === "all" ? "" : value)
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesJobType = selectedJobType === "" || job.type === selectedJobType
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => job.tags.includes(tag))
    const matchesCity = selectedCity === "" || job.location === selectedCity
  
    return matchesSearch && matchesJobType && matchesTags && matchesCity
  })
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/candidato-john">
          <Briefcase className="h-6 w-6" />
          <span className="sr-only">Diversity Jobs</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Sair
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
                    <Label htmlFor="city">Cidade</Label>
                    <Select onValueChange={(value) => setSelectedCity(value === "all" ? "" : value)}>
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Selecione a cidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Cidades</SelectItem>
                        {[...new Set(jobs.map((job) => job.location))].map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Grupos de Diversidade</Label>
                    <div className="space-y-2">
                      {["LGBTQIA+", "Mulheres", "Pessoas Negras", "PCD", "Neurodiversidade", "Profissional 50+","Outros"].map((tag) => (
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
                            <Button onClick={() => router.push(`/jobs/${job.id}`)}>Ver Detalhes</Button>
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