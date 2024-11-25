'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Mail, Phone, MapPin, Linkedin, Calendar, GraduationCap } from "lucide-react"

interface Experience {
  tempo: string;
  empresa: string;
}

interface Education {
  tempo: string;
  instituicao: string;
}

interface CandidateProfile {
  user_id: number;
  nome: string;
  email: string;
  telefone: string | null;
  localizacao: string | null;
  linkedin: string | null;
  grupoSocial: string[];
  resumoProfissional: string | null;
  experiencias: Experience[];
  formacoes: Education[];
  habilidades: string[];
}

export default function VisualizarPerfilCandidato() {
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCandidateData = async () => {
      const email = "john@example.com" // Email fixo do candidato
      setError('')

      try {
        const response = await fetch(`http://localhost:8000/applicants/${email}`)
        console.log('Response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`Failed to fetch candidate data: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Candidate data:', data)

        // Validate data matches expected CandidateProfile interface
        if (!data.user_id || !data.nome || !data.email) {
          throw new Error('Invalid candidate data format')
        }

        setCandidateProfile(data)
      } catch (err) {
        console.error('Error fetching candidate:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch candidate data')
        setCandidateProfile(null)
      }
    }

    fetchCandidateData()
  }, [])

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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/jobs">
            Vagas
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/candidaturas-john">
            Candidaturas
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Sair
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Perfil do Candidato
            </h1>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {candidateProfile && (
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
              <Card className="p-6">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" alt={candidateProfile.nome} />
                      <AvatarFallback>{candidateProfile.nome.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl font-bold">{candidateProfile.nome}</CardTitle>
                      <Badge>{candidateProfile.grupoSocial[0]}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{candidateProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{candidateProfile.telefone || "Não informado"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{candidateProfile.localizacao || "Não informado"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Linkedin className="w-4 h-4 text-gray-500" />
                    {candidateProfile.linkedin ? (
                      <Link href={`https://${candidateProfile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {candidateProfile.linkedin}
                      </Link>
                    ) : (
                      <span>Não informado</span>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Resumo Profissional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{candidateProfile.resumoProfissional || "Não informado"}</p>
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Experiência Profissional</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {candidateProfile.experiencias.length > 0 ? (
                      candidateProfile.experiencias.map((exp: Experience, index: number) => (
                        <div key={index} className="space-y-2 border-b pb-4 last:border-b-0">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            {exp.tempo}
                          </div>
                          <p className="text-sm text-gray-500">{exp.empresa}</p>
                        </div>
                      ))
                    ) : (
                      <p>Nenhuma experiência profissional informada</p>
                    )}
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Formação Acadêmica</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {candidateProfile.formacoes.length > 0 ? (
                      candidateProfile.formacoes.map((form: Education, index: number) => (
                        <div key={index} className="space-y-2 border-b pb-4 last:border-b-0">
                          <div className="flex items-center text-sm text-gray-500">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            {form.tempo}
                          </div>
                          <p className="text-sm text-gray-500">{form.instituicao}</p>
                        </div>
                      ))
                    ) : (
                      <p>Nenhuma formação acadêmica informada</p>
                    )}
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Habilidades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {candidateProfile.habilidades.length > 0 ? (
                        candidateProfile.habilidades.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))
                      ) : (
                        <p>Nenhuma habilidade informada</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Diversity </p>
      </footer>
    </div>
  )}
