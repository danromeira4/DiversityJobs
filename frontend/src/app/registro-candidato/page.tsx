'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Mail, Phone, MapPin, Linkedin, Calendar, GraduationCap, Plus, Trash2, Lock } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function PerfilCandidato() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    localizacao: '',
    linkedin: '',
    grupoSocial: '',
    resumoProfissional: '',
    habilidades: [] as string[]
  })

  const [experiencias, setExperiencias] = useState([
    { id: 1, tempo: 'Jan 2020 - Presente', empresa: 'TechBrasil' },
    { id: 2, tempo: 'Mar 2018 - Dez 2019', empresa: 'WebSolutions' }
  ])

  const [formacoes, setFormacoes] = useState([
    { id: 1, tempo: '2018', instituicao: 'Universidade Federal de São Paulo' },
    { id: 2, tempo: '2021', instituicao: 'FGV' }
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      grupoSocial: value
    }))
  }

  const adicionarExperiencia = () => {
    setExperiencias([...experiencias, { id: Date.now(), tempo: '', empresa: '' }])
  }

  const adicionarFormacao = () => {
    setFormacoes([...formacoes, { id: Date.now(), tempo: '', instituicao: '' }])
  }

  const removerExperiencia = (id: number) => {
    setExperiencias(experiencias.filter(exp => exp.id !== id))
  }

  const removerFormacao = (id: number) => {
    setFormacoes(formacoes.filter(form => form.id !== id))
  }

  const handleSubmit = async () => {
    const habilidadesList = formData.habilidades.length ? 
      formData.habilidades : 
      formData.habilidades.toString().split(',').map(skill => skill.trim())

    const payload = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      telefone: formData.telefone,
      localizacao: formData.localizacao,
      linkedin: formData.linkedin,
      grupoSocial: formData.grupoSocial,
      resumoProfissional: formData.resumoProfissional,
      experiencias: experiencias.map(exp => ({
        tempo: exp.tempo,
        empresa: exp.empresa
      })),
      formacoes: formacoes.map(form => ({
        tempo: form.tempo,
        instituicao: form.instituicao
      })),
      habilidades: habilidadesList
    }
    try {
      const response = await fetch('http://localhost:8000/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        router.push('/') // Redirect to home page on success
      } else {
        const errorData = await response.json()
        console.error('Failed to create applicant:', errorData.detail)
        // Show error to user
        alert(`Error: ${errorData.detail}`)
      }
    } catch (error) {
      console.error('Error creating applicant:', error)
      // Show network/unexpected error to user
      alert('An unexpected error occurred. Please try again later.')
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
            Vagas
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Sobre Nós
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contato
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
            Perfil do Candidato
          </h1>
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input 
                    id="nome" 
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="flex">
                    <Mail className="w-4 h-4 mr-2 mt-3 text-gray-500" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu.email@exemplo.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <div className="flex">
                    <Lock className="w-4 h-4 mr-2 mt-3 text-gray-500" />
                    <Input 
                      id="senha"
                      type="password"
                      placeholder="Digite sua senha"
                      value={formData.senha}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="flex">
                    <Phone className="w-4 h-4 mr-2 mt-3 text-gray-500" />
                    <Input 
                      id="telefone" 
                      type="tel" 
                      placeholder="(11) 98765-4321"
                      value={formData.telefone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização</Label>
                  <div className="flex">
                    <MapPin className="w-4 h-4 mr-2 mt-3 text-gray-500" />
                    <Input 
                      id="localizacao" 
                      placeholder="São Paulo, SP"
                      value={formData.localizacao}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="flex">
                    <Linkedin className="w-4 h-4 mr-2 mt-3 text-gray-500" />
                    <Input 
                      id="linkedin" 
                      placeholder="linkedin.com/in/seuperfil"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grupo-social">Grupo Social</Label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger id="grupo-social">
                      <SelectValue placeholder="Selecione seu grupo social" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lgbtqia+">LGBTQIA+</SelectItem>
                      <SelectItem value="mulheres-em-tech">Mulheres</SelectItem>
                      <SelectItem value="pessoas-negras">Pessoas com Cor</SelectItem>
                      <SelectItem value="pcd">Pessoas com Deficiência</SelectItem>
                      <SelectItem value="pcd">Neurodivergentes</SelectItem>
                      <SelectItem value="50+">Profissionais 50+</SelectItem>
                    </SelectContent>
                  </Select>
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
                    id="resumoProfissional"
                    placeholder="Escreva um breve resumo sobre sua experiência e objetivos profissionais" 
                    className="min-h-[100px]"
                    value={formData.resumoProfissional}
                    onChange={handleInputChange}
                  />
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-bold">Experiência Profissional</CardTitle>
                  <Button onClick={adicionarExperiencia} variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Adicionar experiência</span>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experiencias.map((exp) => (
                    <div key={exp.id} className="space-y-2 border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <Input 
                            placeholder="Período"
                            value={exp.tempo}
                            onChange={(e) => {
                              const newExps = experiencias.map(e => 
                                e.id === exp.id ? {...e, tempo: e.target.value} : e
                              )
                              setExperiencias(newExps)
                            }}
                          />
                          <Input 
                            placeholder="Empresa"
                            value={exp.empresa}
                            onChange={(e) => {
                              const newExps = experiencias.map(e =>
                                e.id === exp.id ? {...e, empresa: e.target.value} : e
                              )
                              setExperiencias(newExps)
                            }}
                          />
                        </div>
                        <Button onClick={() => removerExperiencia(exp.id)} variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover experiência</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-bold">Formação Acadêmica</CardTitle>
                  <Button onClick={adicionarFormacao} variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Adicionar formação</span>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formacoes.map((form) => (
                    <div key={form.id} className="space-y-2 border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <Input 
                            placeholder="Ano"
                            value={form.tempo}
                            onChange={(e) => {
                              const newForms = formacoes.map(f =>
                                f.id === form.id ? {...f, tempo: e.target.value} : f
                              )
                              setFormacoes(newForms)
                            }}
                          />
                          <Input 
                            placeholder="Instituição"
                            value={form.instituicao}
                            onChange={(e) => {
                              const newForms = formacoes.map(f =>
                                f.id === form.id ? {...f, instituicao: e.target.value} : f
                              )
                              setFormacoes(newForms)
                            }}
                          />
                        </div>
                        <Button onClick={() => removerFormacao(form.id)} variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover formação</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Habilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    id="habilidades"
                    placeholder="Liste suas principais habilidades técnicas e comportamentais (separadas por vírgula)" 
                    className="min-h-[100px]"
                    value={formData.habilidades.join(', ')}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        habilidades: e.target.value.split(',').map(skill => skill.trim())
                      }))
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmit}>Salvar Perfil</Button>
          </div>
        </div>
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