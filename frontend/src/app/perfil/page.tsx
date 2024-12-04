'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Briefcase, Mail, Phone, MapPin, Linkedin, Calendar, GraduationCap, Plus, Trash } from 'lucide-react'

interface Experience {
  empresa: string;
  cargo: string;
  tempo: string;
  descricao: string;
}

interface Education {
  instituicao: string;
  curso: string;
  tempo: string;
}

interface CandidateProfile {
  email: string;
  nome: string;
  senha: string;
  telefone: string | null;
  localizacao: string | null;
  linkedin: string | null;
  grupoSocial: string[];
  resumoProfissional: string | null;
  experiencias: Experience[];
  formacoes: Education[];
  habilidades: string[];
}

const socialGroups = ["LGBTQIA+", "Mulheres", "Pessoas Negras", "PCD", "Neurodiversidade", "Profissional 50+", "Outros"];

export default function PerfilCandidato() {
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCandidateData = async () => {
      const email = "ana.souza1@email.com" // Fixed candidate email
      setError('')

      try {
        const response = await fetch(`http://localhost:8000/applicants/${email}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch candidate data: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setCandidateProfile(data)
      } catch (err) {
        console.error('Error fetching candidate:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch candidate data')
        setCandidateProfile(null)
      }
    }

    fetchCandidateData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!candidateProfile) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/applicants/${candidateProfile.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateProfile),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to update profile: ${response.status} ${response.statusText}. ${errorData.message || ''}`)
      }

      const updatedProfile = await response.json()
      setCandidateProfile(updatedProfile)
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (candidateProfile) {
      setCandidateProfile({ ...candidateProfile, [e.target.name]: e.target.value })
    }
  }

  const handleSocialGroupChange = (group: string) => {
    if (candidateProfile) {
      const updatedGroups = candidateProfile.grupoSocial.includes(group)
        ? candidateProfile.grupoSocial.filter(g => g !== group)
        : [...candidateProfile.grupoSocial, group]
      setCandidateProfile({ ...candidateProfile, grupoSocial: updatedGroups })
    }
  }

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    if (candidateProfile) {
      const updatedExperiences = [...candidateProfile.experiencias]
      updatedExperiences[index] = { ...updatedExperiences[index], [field]: value }
      setCandidateProfile({ ...candidateProfile, experiencias: updatedExperiences })
    }
  }

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    if (candidateProfile) {
      const updatedEducation = [...candidateProfile.formacoes]
      updatedEducation[index] = { ...updatedEducation[index], [field]: value }
      setCandidateProfile({ ...candidateProfile, formacoes: updatedEducation })
    }
  }

  const handleSkillChange = (index: number, value: string) => {
    if (candidateProfile) {
      const updatedSkills = [...candidateProfile.habilidades]
      updatedSkills[index] = value
      setCandidateProfile({ ...candidateProfile, habilidades: updatedSkills })
    }
  }

  const addExperience = () => {
    if (candidateProfile) {
      setCandidateProfile({
        ...candidateProfile,
        experiencias: [...candidateProfile.experiencias, { empresa: '', cargo: '', tempo: '', descricao: '' }]
      })
    }
  }

  const removeExperience = (index: number) => {
    if (candidateProfile) {
      const updatedExperiences = candidateProfile.experiencias.filter((_, i) => i !== index)
      setCandidateProfile({ ...candidateProfile, experiencias: updatedExperiences })
    }
  }

  const addEducation = () => {
    if (candidateProfile) {
      setCandidateProfile({
        ...candidateProfile,
        formacoes: [...candidateProfile.formacoes, { instituicao: '', curso: '', tempo: '' }]
      })
    }
  }

  const removeEducation = (index: number) => {
    if (candidateProfile) {
      const updatedEducation = candidateProfile.formacoes.filter((_, i) => i !== index)
      setCandidateProfile({ ...candidateProfile, formacoes: updatedEducation })
    }
  }

  const addSkill = () => {
    if (candidateProfile) {
      setCandidateProfile({
        ...candidateProfile,
        habilidades: [...candidateProfile.habilidades, '']
      })
    }
  }

  const removeSkill = (index: number) => {
    if (candidateProfile) {
      const updatedSkills = candidateProfile.habilidades.filter((_, i) => i !== index)
      setCandidateProfile({ ...candidateProfile, habilidades: updatedSkills })
    }
  }

  if (!candidateProfile) {
    return <div>Carregando...</div>
  }

  return (
    <>
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
              <Button onClick={() => setIsEditing(!isEditing)} disabled={isLoading}>
                {isEditing ? "Cancelar Edição" : "Editar Perfil"}
              </Button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                  <Card className="p-6">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src="/placeholder.svg?height=80&width=80" alt={candidateProfile.nome} />
                          <AvatarFallback>{candidateProfile.nome.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-2xl font-bold">
                            <Input
                              name="nome"
                              value={candidateProfile.nome}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <Input
                            id="email"
                            name="email"
                            value={candidateProfile.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <Input
                            id="telefone"
                            name="telefone"
                            value={candidateProfile.telefone || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="localizacao">Localização</Label>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <Input
                            id="localizacao"
                            name="localizacao"
                            value={candidateProfile.localizacao || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="flex items-center space-x-2">
                          <Linkedin className="w-4 h-4 text-gray-500" />
                          <Input
                            id="linkedin"
                            name="linkedin"
                            value={candidateProfile.linkedin || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-6">
                    <Card className="p-6">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">Resumo Profissional</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          name="resumoProfissional"
                          value={candidateProfile.resumoProfissional || ""}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </CardContent>
                    </Card>
                    <Card className="p-6">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">Experiência Profissional</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {candidateProfile.experiencias.map((exp, index) => (
                          <div key={index} className="space-y-2 pb-4 border-b last:border-b-0">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`exp-empresa-${index}`}>Empresa</Label>
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeExperience(index)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input
                              id={`exp-empresa-${index}`}
                              value={exp.empresa}
                              onChange={(e) => handleExperienceChange(index, 'empresa', e.target.value)}
                            />
                            <Label htmlFor={`exp-cargo-${index}`}>Cargo</Label>
                            <Input
                              id={`exp-cargo-${index}`}
                              value={exp.cargo}
                              onChange={(e) => handleExperienceChange(index, 'cargo', e.target.value)}
                            />
                            <Label htmlFor={`exp-periodo-${index}`}>Período</Label>
                            <Input
                              id={`exp-tempo-${index}`}
                              value={exp.tempo}
                              onChange={(e) => handleExperienceChange(index, 'tempo', e.target.value)}
                            />
                            <Label htmlFor={`exp-descricao-${index}`}>Descrição</Label>
                            <Textarea
                              id={`exp-descricao-${index}`}
                              value={exp.descricao}
                              onChange={(e) => handleExperienceChange(index, 'descricao', e.target.value)}
                            />
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addExperience}>
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Experiência
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="p-6">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">Formação Acadêmica</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {candidateProfile.formacoes.map((form, index) => (
                          <div key={index} className="space-y-2 pb-4 border-b last:border-b-0">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`edu-instituicao-${index}`}>Instituição</Label>
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeEducation(index)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input
                              id={`edu-instituicao-${index}`}
                              value={form.instituicao}
                              onChange={(e) => handleEducationChange(index, 'instituicao', e.target.value)}
                            />
                            <Label htmlFor={`edu-curso-${index}`}>Curso</Label>
                            <Input
                              id={`edu-curso-${index}`}
                              value={form.curso}
                              onChange={(e) => handleEducationChange(index, 'curso', e.target.value)}
                            />
                            <Label htmlFor={`edu-periodo-${index}`}>Período</Label>
                            <Input
                              id={`edu-periodo-${index}`}
                              value={form.tempo}
                              onChange={(e) => handleEducationChange(index, 'tempo', e.target.value)}
                            />
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addEducation}>
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Formação
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="p-6">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">Habilidades</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {candidateProfile.habilidades.map((skill, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              value={skill}
                              onChange={(e) => handleSkillChange(index, e.target.value)}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addSkill}>
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Habilidade
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="p-6">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">Grupos Sociais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {socialGroups.map((group) => (
                            <div key={group} className="flex items-center space-x-2">
                              <Checkbox
                                id={`group-${group}`}
                                checked={candidateProfile.grupoSocial.includes(group)}
                                onCheckedChange={() => handleSocialGroupChange(group)}
                              />
                              <Label htmlFor={`group-${group}`}>{group}</Label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            ) : (
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
                        {candidateProfile.grupoSocial.map((group, index) => (
                          <Badge key={index} className="mr-2 mt-2">{group}</Badge>
                        ))}
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
                        <Link href={candidateProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                            <p className="text-sm text-gray-500">{exp.empresa}</p>
                            <p className="font-medium">{exp.cargo}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              {exp.tempo}
                            </div>
                            <p className="text-sm">{exp.descricao}</p>
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
                            <p className="text-sm text-gray-500">{form.instituicao}</p>
                            <p className="font-medium">{form.curso}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <GraduationCap className="w-4 h-4 mr-2" />
                              {form.tempo}
                            </div>
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
          <p className="text-xs text-gray-500">© 2024 Diversity Jobs. Todos os direitos reservados.</p>
        </footer>
      </div>
    </>
  )
}

