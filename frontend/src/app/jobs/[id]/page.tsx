'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Building2, Calendar, Clock, DollarSign, FileText, Users } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

interface Job {
  job_id: number
  business_id: number
  social_group: string[]
  job_title: string
  job_description: string
  location: string
  salary_range: string
  requirements: string
  posted_date: string
  application_deadline: string
  application_process: string
}

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Email fixo "john@example.com"
  const applicantEmail = "ana.souza1@email.com"
  //const applicantEmail = "carlos.lima@email.com"
  //const applicantEmail = "joao.pereira@email.com"

  useEffect(() => {
    if (!resolvedParams.id) return
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:8000/jobs/${resolvedParams.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch job details')
        }
        const data = await response.json()

        setJob({
          job_id: data.job_id,
          business_id: data.business_id,
          social_group: data.social_group || [],
          job_title: data.job_title || "Título não disponível",
          job_description: data.job_description || "Descrição não disponível",
          location: data.location || "Localização não especificada",
          salary_range: data.salary_range || "Não informado",
          requirements: data.requirements || "Não especificado",
          posted_date: data.posted_date || "",
          application_deadline: data.application_deadline || "",
          application_process: data.application_process || "Processo não especificado"
        })
      } catch (error) {
        console.error('Error fetching job details:', error)
        router.push('/jobs') // Redireciona em caso de erro
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()
  }, [resolvedParams.id, router])

  const handleApply = async () => {
    if (!job) {
      alert("Dados inválidos. Por favor, verifique a vaga.")
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/jobs/${job.job_id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicant_email: applicantEmail }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Falha ao se candidatar")
      }

      alert("Candidatura realizada com sucesso!")

      // Redirecionar para a página de vagas
      router.push('/jobs')
    } catch (error) {
      console.error("Error applying for job:", error)
      alert(`Erro: ${(error as Error).message}`)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!job) {
    return <div className="text-center text-2xl mt-10">Vaga não encontrada</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <div className="bg-primary text-primary-foreground p-6 rounded-t-lg">
            <h1 className="text-3xl font-bold text-center mb-2">{job.job_title}</h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center">
                <Building2 className="mr-2 h-4 w-4" />
                Empresa ID: {job.business_id}
              </span>
              <span className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {job.location}
              </span>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-6">
              <JobDetailSection icon={<FileText />} title="Descrição" content={job.job_description} />
              <JobDetailSection icon={<Users />} title="Grupos de Diversidade" content={
                <div className="flex flex-wrap gap-2">
                  {job.social_group.map((group, index) => (
                    <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {group}
                    </span>
                  ))}
                </div>
              } />
              <JobDetailSection icon={<FileText />} title="Requisitos" content={job.requirements} />
              <JobDetailSection icon={<DollarSign />} title="Benefícios" content={job.salary_range} />
              <JobDetailSection icon={<Calendar />} title="Data de Publicação" content={job.posted_date} />
              <JobDetailSection icon={<Clock />} title="Prazo para Aplicação" content={job.application_deadline} />
              <JobDetailSection icon={<FileText />} title="Processo de Aplicação" content={job.application_process} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center p-6 bg-muted">
            <Button size="lg" className="w-full sm:w-auto" onClick={handleApply}>
              Candidatar-se
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function JobDetailSection({ icon, title, content }: { icon: React.ReactNode, title: string, content: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-1">
        {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-primary" })}
      </div>
      <div className="flex-grow">
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <div className="text-muted-foreground">{content}</div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <div className="flex justify-center space-x-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-5 w-5" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-6">
          <Skeleton className="h-10 w-full sm:w-64" />
        </CardFooter>
      </Card>
    </div>
  )
}
