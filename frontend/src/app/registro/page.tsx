'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Mail, Phone, MapPin, Linkedin, Lock, Plus, Trash2 } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function RegistroUsuario() {
  const router = useRouter()
  const [userType, setUserType] = useState('applicant') // Tipo de usuário: candidato ou empresa
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    localizacao: '',
    linkedin: '',
    businessName: '', // Nome da empresa (somente para empresas)
    businessDescription: '', // Descrição da empresa
    industry: '', // Setor de atuação da empresa
    resumoProfissional: '', // Apenas para candidatos
    habilidades: [] as string[], // Apenas para candidatos
    disabilityType: '', // Apenas para candidatos
  })

  const [experiencias, setExperiencias] = useState([
    { id: 1, tempo: '', empresa: '' },
  ])
  const [formacoes, setFormacoes] = useState([
    { id: 1, tempo: '', instituicao: '' },
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const adicionarExperiencia = () => {
    setExperiencias([...experiencias, { id: Date.now(), tempo: '', empresa: '' }])
  }

  const removerExperiencia = (id: number) => {
    setExperiencias(experiencias.filter((exp) => exp.id !== id))
  }

  const adicionarFormacao = () => {
    setFormacoes([...formacoes, { id: Date.now(), tempo: '', instituicao: '' }])
  }

  const removerFormacao = (id: number) => {
    setFormacoes(formacoes.filter((form) => form.id !== id))
  }

  const handleSubmit = async () => {
    const payload = {
      user_type: userType,
      email: formData.email,
      password_hash: formData.senha,
      name: formData.nome,
      phone_number: formData.telefone,
      address: formData.localizacao,
      linkedin: formData.linkedin,
      business_name: userType === 'business' ? formData.businessName : null,
      business_description: userType === 'business' ? formData.businessDescription : null,
      industry: userType === 'business' ? formData.industry : null,
      resumo_profissional: userType === 'applicant' ? formData.resumoProfissional : null,
      habilidades: userType === 'applicant' ? formData.habilidades : null,
      disability_type: userType === 'applicant' ? formData.disabilityType : null,
      experiencias: userType === 'applicant' ? experiencias : null,
      formacoes: userType === 'applicant' ? formacoes : null,
    }

    try {
      const response = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push('/') // Redireciona para a página inicial
      } else {
        const errorData = await response.json()
        console.error('Erro ao registrar usuário:', errorData.detail)
        alert(`Erro: ${errorData.detail}`)
      }
    } catch (error) {
      console.error('Erro inesperado:', error)
      alert('Erro inesperado. Tente novamente mais tarde.')
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Início
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
            Registro de Usuário
          </h1>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Selecione o Tipo de Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Tipo de Usuário</Label>
              <Select onValueChange={setUserType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applicant">Candidato</SelectItem>
                  <SelectItem value="business">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="p-6 mt-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" placeholder="Seu nome completo" value={formData.nome} onChange={handleInputChange} />
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu.email@exemplo.com" value={formData.email} onChange={handleInputChange} />
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" placeholder="Digite sua senha" value={formData.senha} onChange={handleInputChange} />
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" type="tel" placeholder="(11) 98765-4321" value={formData.telefone} onChange={handleInputChange} />
              <Label htmlFor="localizacao">Localização</Label>
              <Input id="localizacao" placeholder="São Paulo, SP" value={formData.localizacao} onChange={handleInputChange} />
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" placeholder="linkedin.com/in/seuperfil" value={formData.linkedin} onChange={handleInputChange} />
            </CardContent>
          </Card>

          {userType === 'applicant' && (
            <>
              <Card className="p-6 mt-6">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Resumo Profissional</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="resumoProfissional"
                    placeholder="Escreva um breve resumo sobre sua experiência e objetivos profissionais"
                    value={formData.resumoProfissional}
                    onChange={handleInputChange}
                  />
                </CardContent>
              </Card>
              <Card className="p-6 mt-6">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Experiência Profissional</CardTitle>
                  <Button onClick={adicionarExperiencia} variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {experiencias.map((exp) => (
                    <div key={exp.id}>
                      <Input
                        placeholder="Período"
                        value={exp.tempo}
                        onChange={(e) => {
                          const updatedExperiences = experiencias.map((item) =>
                            item.id === exp.id ? { ...item, tempo: e.target.value } : item
                          )
                          setExperiencias(updatedExperiences)
                        }}
                      />
                      <Input
                        placeholder="Empresa"
                        value={exp.empresa}
                        onChange={(e) => {
                          const updatedExperiences = experiencias.map((item) =>
                            item.id === exp.id ? { ...item, empresa: e.target.value } : item
                          )
                          setExperiencias(updatedExperiences)
                        }}
                      />
                      <Button onClick={() => removerExperiencia(exp.id)} variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {userType === 'business' && (
            <Card className="p-6 mt-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Informações da Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="businessName">Nome da Empresa</Label>
                <Input id="businessName" placeholder="Nome da empresa" value={formData.businessName} onChange={handleInputChange} />
                <Label htmlFor="businessDescription">Descrição da Empresa</Label>
                <Textarea
                  id="businessDescription"
                  placeholder="Descreva brevemente a missão, visão e objetivos da sua empresa"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                />
                <Label htmlFor="industry">Setor de Atuação</Label>
                <Input id="industry" placeholder="Ex: Tecnologia, Saúde, Varejo" value={formData.industry} onChange={handleInputChange} />
              </CardContent>
            </Card>
          )}

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSubmit}>Registrar</Button>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Diversity Jobs. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
