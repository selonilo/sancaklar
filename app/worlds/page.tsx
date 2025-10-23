"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, Swords, Globe } from "lucide-react"

interface World {
  id: string
  name: string
  playerCount: number
  maxPlayers: number
  speed: string
  startDate: string
  status: "active" | "starting" | "ending"
}

const WORLDS: World[] = [
  {
    id: "1",
    name: "Altın Çağ",
    playerCount: 8432,
    maxPlayers: 10000,
    speed: "1x",
    startDate: "15 Ocak 2025",
    status: "active",
  },
  {
    id: "2",
    name: "Kızıl Sancak",
    playerCount: 6821,
    maxPlayers: 10000,
    speed: "2x",
    startDate: "1 Şubat 2025",
    status: "active",
  },
  {
    id: "3",
    name: "Demir Taht",
    playerCount: 2145,
    maxPlayers: 10000,
    speed: "3x",
    startDate: "10 Şubat 2025",
    status: "starting",
  },
  {
    id: "4",
    name: "Ejderha Kalesi",
    playerCount: 9876,
    maxPlayers: 10000,
    speed: "1x",
    startDate: "1 Aralık 2024",
    status: "ending",
  },
]

export default function WorldsPage() {
  const router = useRouter()
  const [user, setUser] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/auth/login")
    } else {
      setUser(storedUser)
    }
  }, [router])

  const handleWorldSelect = (worldId: string) => {
    // Check if user has played in this world before
    const hasPlayedBefore = localStorage.getItem(`world_${worldId}_region`)

    if (hasPlayedBefore) {
      // Go directly to village
      router.push(`/village?world=${worldId}`)
    } else {
      // Go to region selection
      router.push(`/regions?world=${worldId}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/30"
      case "starting":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30"
      case "ending":
        return "bg-orange-500/10 text-orange-500 border-orange-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif"
      case "starting":
        return "Yakında Başlıyor"
      case "ending":
        return "Sona Eriyor"
      default:
        return status
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-wider text-foreground">SANCAKLAR</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Hoş geldin, <span className="text-foreground font-semibold">{user}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.clear()
                router.push("/auth/login")
              }}
            >
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Dünya Seçimi</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Bir Dünya Seç</h1>
          <p className="text-lg text-muted-foreground">Fetih yolculuğuna başlamak için bir dünya seçin</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {WORLDS.map((world) => (
            <Card
              key={world.id}
              className="group cursor-pointer border-border/50 bg-card/95 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              onClick={() => handleWorldSelect(world.id)}
            >
              <CardHeader>
                <div className="mb-3 flex items-start justify-between">
                  <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {world.name}
                  </CardTitle>
                  <Badge className={getStatusColor(world.status)}>{getStatusText(world.status)}</Badge>
                </div>
                <CardDescription className="text-muted-foreground">Başlangıç: {world.startDate}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Oyuncu Sayısı</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {world.playerCount.toLocaleString()} / {world.maxPlayers.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    <Swords className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Oyun Hızı</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{world.speed}</span>
                </div>

                <div className="pt-2">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Doluluk</span>
                    <span className="font-semibold text-foreground">
                      {Math.round((world.playerCount / world.maxPlayers) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(world.playerCount / world.maxPlayers) * 100}%` }}
                    />
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Dünyaya Gir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
