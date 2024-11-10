'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building2, MapPin, Calendar, Clock, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Dados simulados para as vagas da empresa
const vagasEmpresa = [
  {
    id: 1,
    titulo: "Engenheiro de Software Senior",
    localizacao: "São Paulo, SP",
    dataCriacao: "2024-03-01",
    status: "Aberta",
    tipo: "Tempo integral",
    candidatos: 15,
  },
  {
    id: 2,
    titulo: "Designer UX/UI",
    localizacao: "Remoto",
    dataCriacao: "2024-02-28",
    status: "Em revisão",
    tipo: "Contrato",
    candidatos: 8,
  },
  {
    id: 3,
    titulo: "Analista de Dados",
    localizacao: "Rio de Janeiro, RJ",
    dataCriacao: "2024-02-25",
    status: "Fechada",
    tipo: "Tempo integral",
    candidatos: 20,
  },
  {
    id: 4,
    titulo: "Gerente de Produto",
    localizacao: "Belo Horizonte, MG",
    dataCriacao: "2024-03-02",
    status: "Aberta",
    tipo: "Tempo integral",
    candidatos: 5,
  },
  {
    id: 5,
    titulo: "Desenvolvedor Frontend",
    localizacao: "São Paulo, SP",
    dataCriacao: "2024-02-20",
    status: "Em revisão",
    tipo: "Estágio",
    candidatos: 12,
  },
]

export default function DashboardEmpresa() {
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [novaVaga, setNovaVaga] = useState({
    titulo: "",
    descricao: "",
    localizacao: "",
    faixaSalarial: "",
    requisitos: "",
    prazo: "",
    metodoAplicacao: "",
    tiposDeficiencia: {
      fisica: false,
      visual: false,
      auditiva: false,
      intelectual: false,
      multipla: false,
    },
  })

  const vagasFiltradas = vagasEmpresa.filter(vaga => 
    filtroStatus === "todos" || vaga.status === filtroStatus
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

  const handleCheckboxChange = (name: string) => {
    setNovaVaga(prev => ({
      ...prev,
      tiposDeficiencia: {
        ...prev.tiposDeficiencia,
        [name]: !prev.tiposDeficiencia[name as keyof typeof prev.tiposDeficiencia],
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você faria a chamada para o backend Python
    // Exemplo de como seria a chamada usando fetch:
    /*
    try {
      const response = await fetch('/api/criar-vaga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...novaVaga,
          companyId: 'ID_DA_EMPRESA', // Este valor seria dinâmico baseado na empresa logada
          dataCriacao: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        // Atualizar o estado local ou recarregar os dados
        console.log('Vaga criada com sucesso!');
      } else {
        console.error('Erro ao criar vaga');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
    */
    console.log('Dados da nova vaga:', novaVaga)
    // Resetar o formulário após o envio
    setNovaVaga({
      titulo: "",
      descricao: "",
      localizacao: "",
      faixaSalarial: "",
      requisitos: "",
      prazo: "",
      metodoAplicacao: "",
      tiposDeficiencia: {
        fisica: false,
        visual: false,
        auditiva: false,
        intelectual: false,
        multipla: false,
      },
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Building2 className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">TechCorp</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Candidatos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Relatórios
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Configurações
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Dashboard de Vagas
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
                  <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="titulo">Título da Vaga</Label>
                      <Input
                        id="titulo"
                        name="titulo"
                        value={novaVaga.titulo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="descricao">Descrição da Vaga</Label>
                      <Textarea
                        id="descricao"
                        name="descricao"
                        value={novaVaga.descricao}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="localizacao">Localização</Label>
                      <Input
                        id="localizacao"
                        name="localizacao"
                        value={novaVaga.localizacao}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="faixaSalarial">Faixa Salarial</Label>
                      <Input
                        id="faixaSalarial"
                        name="faixaSalarial"
                        value={novaVaga.faixaSalarial}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="requisitos">Requisitos</Label>
                      <Textarea
                        id="requisitos"
                        name="requisitos"
                        value={novaVaga.requisitos}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="prazo">Prazo de Inscrição</Label>
                      <Input
                        id="prazo"
                        name="prazo"
                        type="date"
                        value={novaVaga.prazo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="metodoAplicacao">Método de Aplicação</Label>
                      <Input
                        id="metodoAplicacao"
                        name="metodoAplicacao"
                        value={novaVaga.metodoAplicacao}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Tipos de Deficiência</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(novaVaga.tiposDeficiencia).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              checked={value}
                              onCheckedChange={() => handleCheckboxChange(key)}
                            />
                            <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" className="col-span-2">Criar Vaga</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Vagas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
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
                  <Button variant="outline">Exportar Relatório</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaga</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Candidatos</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vagasFiltradas.map((vaga) => (
                      <TableRow key={vaga.id}>
                        <TableCell>
                          <div className="font-medium">{vaga.titulo}</div>
                          <div className="text-sm text-gray-500">{vaga.tipo}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                            {vaga.localizacao}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            {new Date(vaga.dataCriacao).toLocaleDateString('pt-BR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(vaga.status)}>
                            {vaga.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                            {vaga.candidatos}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Editar</Button>
                          <Button variant="ghost" size="sm">Ver Candidatos</Button>
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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 TechCorp. Todos os direitos reservados.</p>
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