'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Mail, Phone, MapPin, Linkedin, Calendar, GraduationCap, Plus, Trash2 } from "lucide-react"

export default function PerfilCandidato() {
  const [experiencias, setExperiencias] = useState([
    { id: 1, cargo: 'Desenvolvedor Full Stack', empresa: 'TechBrasil', periodo: 'Jan 2020 - Presente', descricao: 'Desenvolvimento de aplicações web utilizando React e Node.js.' },
    { id: 2, cargo: 'Desenvolvedor Front-end', empresa: 'WebSolutions', periodo: 'Mar 2018 - Dez 2019', descricao: 'Criação de interfaces responsivas e acessíveis com HTML, CSS e JavaScript.' }
  ])

  const [formacoes, setFormacoes] = useState([
    { id: 1, curso: 'Ciência da Computação', instituicao: 'Universidade Federal de São Paulo', ano: '2018' },
    { id: 2, curso: 'MBA em Gestão de Projetos', instituicao: 'FGV', ano: '2021' }
  ])

  const adicionarExperiencia = () => {
    setExperiencias([...experiencias, { id: Date.now(), cargo: '', empresa: '', periodo: '', descricao: '' }])
  }

  const adicionarFormacao = () => {
    setFormacoes([...formacoes, { id: Date.now(), curso: '', instituicao: '', ano: '' }])
  }

  const removerExperiencia = (id: number) => {
    setExperiencias(experiencias.filter(exp => exp.id !== id))
  }

  const removerFormacao = (id: number) => {
    setFormacoes(formacoes.filter(form => form.id !== id))
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
                  <Input id="nome" placeholder="Seu nome completo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="flex">
                    <Mail className="w-4 h-4 mr-2 mt-3 text-gray-500" />
                    <Input id="email" type="email" placeholder="seu.email@exemplo.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="flex">
                    <Phone className="w-4 h-4 mr-2 mt-3 text-gray-500" />
                    <Input id="telefone" type="tel" placeholder="(11) 98765-4321" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização</Label>
                  <div className="flex">
                    <MapPin className="w-4 h-4 mr-2 mt-3 text-gray-500" />
                    <Input id="localizacao" placeholder="São Paulo, SP" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="flex">
                    <Linkedin className="w-4 h-4 mr-2 mt-3 text-gray-500" />
                    <Input id="linkedin" placeholder="linkedin.com/in/seuperfil" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grupo-social">Grupo Social</Label>
                  <Select>
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
                  <Textarea placeholder="Escreva um breve resumo sobre sua experiência e objetivos profissionais" className="min-h-[100px]" />
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
                          <h3 className="font-semibold">{exp.cargo}</h3>
                          <p className="text-sm text-gray-500">{exp.empresa}</p>
                        </div>
                        <Button onClick={() => removerExperiencia(exp.id)} variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover experiência</span>
                        </Button>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {exp.periodo}
                      </div>
                      <p className="text-sm">{exp.descricao}</p>
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
                          <h3 className="font-semibold">{form.curso}</h3>
                          <p className="text-sm text-gray-500">{form.instituicao}</p>
                        </div>
                        <Button onClick={() => removerFormacao(form.id)} variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover formação</span>
                        </Button>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        {form.ano}
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
                  <Textarea placeholder="Liste suas principais habilidades técnicas e comportamentais" className="min-h-[100px]" />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <Button>Salvar Perfil</Button>
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