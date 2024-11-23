'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Calendar, Clock, Users, Edit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"

interface Job {
  job_id: number
  business_id: number
  job_title: string
  job_description: string
  location: string
  salary_range: string
  requirements: string
  posted_date: string
  application_deadline: string
  application_process: string
  social_group: string[]
  status: string
}

interface Candidate {
  id: number
  name: string
  email: string
  applicationDate: string
  status: string
}

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const [job, setJob] = useState<Job | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/jobs/${resolvedParams.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch job details')
        }
        const data = await response.json()
        setJob(data)
      } catch (error) {
        console.error('Error fetching job details:', error)
      }
    }

    const fetchCandidates = async () => {
      setCandidates([
        { id: 1, name: "João Silva", email: "joao@example.com", applicationDate: "2023-05-15", status: "Em análise" },
        { id: 2, name: "Maria Santos", email: "maria@example.com", applicationDate: "2023-05-16", status: "Entrevista" },
        { id: 3, name: "Carlos Oliveira", email: "carlos@example.com", applicationDate: "2023-05-17", status: "Recusado" },
      ])
    }

    fetchJobDetails()
    fetchCandidates()
  }, [resolvedParams])

  const handleStatusChange = async (newStatus: string) => {
     if (!job) return

     try {
       const response = await fetch(`http://localhost:8000/jobs/${job.job_id}`, {
         method: 'PATCH',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ status: newStatus }),
       })

       if (!response.ok) {
         throw new Error('Failed to update job status')
       }

       setJob((prevJob) => prevJob ? { ...prevJob, status: newStatus } : null)
     } catch (error) {
       console.error('Error updating job status:', error)
     }
   }

  const handleEdit = async (updatedJob: Partial<Job>) => {
    if (!job) return

    try {
      const response = await fetch(`http://localhost:8000/jobs/${job.job_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJob),
      })

      if (!response.ok) {
        throw new Error('Failed to update job')
      }

      const updatedJobData = await response.json()
      setJob(updatedJobData)
      setIsDialogOpen(false)
      
      // Reload the page after successful update
      router.refresh()
    } catch (error) {
      console.error('Error updating job:', error)
    }
  }

  if (!job) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/vagas-criadas" className="inline-flex items-center mb-6 text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para o Dashboard
      </Link>
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{job.job_title}</CardTitle>
          <Badge className={job.status === 'Aberta' ? 'bg-green-100 text-green-800' : job.status === 'Fechada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
            {job.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span>Publicado em: {new Date(job.posted_date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <span>Prazo: {new Date(job.application_deadline).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              <span>Grupos: {job.social_group && job.social_group.length > 0 ? job.social_group.join(', ') : 'Nenhum grupo especificado'}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Descrição da Vaga</h3>
              <p>{job.job_description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Requisitos</h3>
              <p>{job.requirements}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Faixa Salarial</h3>
              <p>{job.salary_range}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Processo de Candidatura</h3>
              <p>{job.application_process}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />Editar Vaga
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Vaga</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const updatedJob = {
                    job_title: formData.get('job_title') as string,
                    job_description: formData.get('job_description') as string,
                    location: formData.get('location') as string,
                    salary_range: formData.get('salary_range') as string,
                    requirements: formData.get('requirements') as string,
                    application_deadline: formData.get('application_deadline') as string,
                    application_process: formData.get('application_process') as string,
                    social_group: formData.getAll('social_group') as string[],
                  }
                  handleEdit(updatedJob)
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="job_title">Título da Vaga</Label>
                    <Input id="job_title" name="job_title" defaultValue={job.job_title} />
                  </div>
                  <div>
                    <Label htmlFor="job_description">Descrição da Vaga</Label>
                    <Textarea id="job_description" name="job_description" defaultValue={job.job_description} />
                  </div>
                  <div>
                    <Label htmlFor="location">Localização</Label>
                    <Input id="location" name="location" defaultValue={job.location} />
                  </div>
                  <div>
                    <Label htmlFor="salary_range">Faixa Salarial</Label>
                    <Input id="salary_range" name="salary_range" defaultValue={job.salary_range} />
                  </div>
                  <div>
                    <Label htmlFor="requirements">Requisitos</Label>
                    <Textarea id="requirements" name="requirements" defaultValue={job.requirements} />
                  </div>
                  <div>
                    <Label htmlFor="application_deadline">Prazo de Inscrição</Label>
                    <Input id="application_deadline" name="application_deadline" type="date" defaultValue={job.application_deadline} />
                  </div>
                  <div>
                    <Label htmlFor="application_process">Processo de Candidatura</Label>
                    <Textarea id="application_process" name="application_process" defaultValue={job.application_process} />
                  </div>
                  <div>
                    <Label htmlFor="social_group">Grupos Sociais</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["LGBTQIA+", "Mulheres", "Pessoas Negras", "PCD", "Neurodiversidade", "Profissional 50+", "Outros"].map((group) => (
                        <div key={group} className="flex items-center space-x-2">
                          <Checkbox
                            id={group}
                            name="social_group"
                            value={group}
                            defaultChecked={job.social_group ? job.social_group.includes(group) : false}
                          />
                          <Label htmlFor={group}>{group}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status">Status da Vaga</Label>
                    <Select onValueChange={(value) => handleStatusChange(value)} defaultValue={job.status}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Alterar Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aberta">Aberta</SelectItem>
                        <SelectItem value="Em revisão">Em revisão</SelectItem>
                        <SelectItem value="Fechada">Fechada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full mt-4">Salvar Alterações</Button>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />Editar Vaga
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Candidatos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Data de Candidatura</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{new Date(candidate.applicationDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{candidate.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Ver Detalhes</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

