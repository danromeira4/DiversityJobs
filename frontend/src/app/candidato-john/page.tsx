import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Users, Building2, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/candidato-john">
          <Briefcase className="h-6 w-6" />
          <span className="sr-only">Diversity Jobs</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/perfil">
            Perfil
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/jobs">
            Vagas
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/candidaturas">
            Candidaturas
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Conectando Talentos Diversos com Empresas Inclusivas
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl">
                  O Diversity Jobs é sua plataforma para encontrar e criar oportunidades em um ambiente de trabalho inclusivo.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild className="bg-white text-purple-600 hover:bg-gray-100">
                  <Link href="/jobs">Buscar Vagas</Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-purple-600">
                  <Link href="/candidaturas">Acompanhar Candidaturas</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nossa Missão</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nossa missão é criar um mercado de trabalho mais inclusivo. Conectando talentos diversos com empresas comprometidas, estamos construindo um futuro onde todos tenham as mesmas oportunidades para alcançar o sucesso.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">O Que Nossos Usuários Dizem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 mb-4">
                    "O Diversity Jobs me ajudou a encontrar uma empresa que realmente valoriza minha perspectiva única. Nunca me senti tão bem-vindo e valorizado em minha carreira."
                  </p>
                  <p className="font-semibold">- Alex T., Engenheiro de Software</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 mb-4">
                    "Como empregadora, esta plataforma foi fundamental para nos ajudar a construir uma equipe diversa e talentosa. A qualidade dos candidatos é excelente."
                  </p>
                  <p className="font-semibold">- Sarah L., Diretora de RH</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 mb-4">
                    "Aprecio como o Diversity Jobs facilita encontrar empresas realmente comprometidas com a inclusão. Aqui é mais que apenas discurso."
                  </p>
                  <p className="font-semibold">- Miguel R., Especialista em Marketing</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-purple-600 px-3 py-1 text-sm text-white">
                  Para Candidatos
                </div>
                <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Encontre o Cargo Perfeito
                </h2>
                </div>
              <div className="flex flex-col items-start space-y-4">
                <Users className="h-12 w-12 text-purple-600" />
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Crie seu perfil, mostre suas habilidades e conecte-se com empregadores que valorizam diversidade e inclusão. Nossa plataforma facilita encontrar e se candidatar a vagas que estejam alinhadas com seus valores e metas de carreira.
                </p>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                  href="#"
                >
                  Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sobre o Diversity Jobs</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Somos mais que um quadro de empregos. O Diversity Jobs é um movimento em direção a um mercado de trabalho mais inclusivo e justo. Nossa plataforma foi criada para quebrar barreiras e criar oportunidades para todos.
                </p>
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
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
}
