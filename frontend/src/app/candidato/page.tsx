import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Mail, Phone, MapPin, Linkedin, Calendar, GraduationCap } from "lucide-react"

// Mock data for the candidate profile
const candidateProfile = {
  nome: "Maria Silva",
  email: "maria.silva@email.com",
  telefone: "(11) 98765-4321",
  localizacao: "São Paulo, SP",
  linkedin: "linkedin.com/in/mariasilva",
  grupoSocial: ["Mulheres", ", LGBTQIA+"] ,
  resumoProfissional: "Desenvolvedora Full Stack com 5 anos de experiência, especializada em React e Node.js. Apaixonada por criar soluções inovadoras e promover a diversidade no setor de tecnologia.",
  experiencias: [
    { id: 1, cargo: "Desenvolvedora Full Stack Sênior", empresa: "Google", periodo: "Jan 2020 - Presente", descricao: "Liderança no desenvolvimento de aplicações web escaláveis utilizando React, Node.js e AWS." },
    { id: 2, cargo: "Desenvolvedora Front-end", empresa: "Microsoft", periodo: "Mar 2018 - Dez 2019", descricao: "Criação de interfaces responsivas e acessíveis com foco em usabilidade e performance." }
  ],
  formacoes: [
    { id: 1, curso: "Sistemas de Informação", instituicao: "Universidade de São Paulo", ano: "2018" },
    { id: 2, curso: "MBA em Gestão de Projetos de TI", instituicao: "FGV", ano: "2021" }
  ],
  habilidades: ["React", "Node.js", "TypeScript", "AWS", "Docker", "GraphQL", "Agile Methodologies", "Team Leadership"]
}

export default function VisualizarPerfilCandidato() {
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Perfil do Candidato
            </h1>
            <Button asChild>
              <Link href="/editar-perfil">Editar Perfil</Link>
            </Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <Card className="p-6">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt={candidateProfile.nome} />
                    <AvatarFallback>{candidateProfile.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl font-bold">{candidateProfile.nome}</CardTitle>
                    <Badge>{candidateProfile.grupoSocial}</Badge>
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
                  <span>{candidateProfile.telefone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{candidateProfile.localizacao}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-4 h-4 text-gray-500" />
                  <Link href={`https://${candidateProfile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {candidateProfile.linkedin}
                  </Link>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Resumo Profissional</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{candidateProfile.resumoProfissional}</p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Experiência Profissional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidateProfile.experiencias.map((exp) => (
                    <div key={exp.id} className="space-y-2 border-b pb-4 last:border-b-0">
                      <h3 className="font-semibold">{exp.cargo}</h3>
                      <p className="text-sm text-gray-500">{exp.empresa}</p>
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
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Formação Acadêmica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidateProfile.formacoes.map((form) => (
                    <div key={form.id} className="space-y-2 border-b pb-4 last:border-b-0">
                      <h3 className="font-semibold">{form.curso}</h3>
                      <p className="text-sm text-gray-500">{form.instituicao}</p>
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
                  <div className="flex flex-wrap gap-2">
                    {candidateProfile.habilidades.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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