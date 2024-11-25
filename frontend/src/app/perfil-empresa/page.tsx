'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Mail, Phone, MapPin, Linkedin } from "lucide-react"

interface BusinessProfile {
  user_id: number;
  name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  linkedin: string | null;
  business_name: string | null;
  profile_photo_url: string | null;
}

export default function VisualizarPerfilEmpresa() {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBusinessData = async () => {
      const email = "tech@company.com" // Email fixo da empresa
      setError('')

      try {
        const response = await fetch(`http://localhost:8000/businesses/${email}`)
        console.log('Response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`Failed to fetch business data: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Business data:', data)

        // Validate data matches expected BusinessProfile interface
        if (!data.user_id || !data.name || !data.email) {
          throw new Error('Invalid business data format')
        }

        setBusinessProfile(data)
      } catch (err) {
        console.error('Error fetching business:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch business data')
        setBusinessProfile(null)
      }
    }

    fetchBusinessData()
  }, [])

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
              Perfil da Empresa
            </h1>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {businessProfile && (
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
              <Card className="p-6">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={businessProfile.profile_photo_url || "/placeholder.svg"} alt={businessProfile.business_name || businessProfile.name} />
                      <AvatarFallback>{businessProfile.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl font-bold">{businessProfile.business_name || businessProfile.name}</CardTitle>
                      <Badge>Empresa</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{businessProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{businessProfile.phone_number || "Não informado"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{businessProfile.address || "Não informado"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Linkedin className="w-4 h-4 text-gray-500" />
                    {businessProfile.linkedin ? (
                      <Link href={`https://${businessProfile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {businessProfile.linkedin}
                      </Link>
                    ) : (
                      <span>Não informado</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Diversity Jobs. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
