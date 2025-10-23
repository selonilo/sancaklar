"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Crown,
  Home,
  ShoppingBag,
  Swords,
  Warehouse,
  Hammer,
  Shield,
  Users,
  Coins,
  Wheat,
  Zap,
  Clock,
  Map,
  Trophy,
  ArrowLeft,
} from "lucide-react"

interface Building {
  id: string
  name: string
  level: number
  icon: any
  description: string
  color: string
  bgColor: string
  isUpgrading?: boolean
  upgradeTime?: number
  resources: {
    wood: number
    stone: number
    gold: number
  }
}

interface VillageResources {
  wood: number
  stone: number
  gold: number
  food: number
  population: number
  maxPopulation: number
}

const MAX_BUILDING_LEVEL = 10

const calculateVillageScore = (buildings: Building[]): number => {
  const totalScore = buildings.reduce((sum, building) => sum + building.level, 0)
  const maxScore = buildings.length * MAX_BUILDING_LEVEL
  return Math.round((totalScore / maxScore) * 1000)
}

export default function BuildingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const worldId = searchParams.get("world")
  const [user, setUser] = useState<string | null>(null)
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)

  const [resources, setResources] = useState<VillageResources>({
    wood: 500,
    stone: 300,
    gold: 200,
    food: 1000,
    population: 50,
    maxPopulation: 100,
  })

  const [buildings, setBuildings] = useState<Building[]>([
    {
      id: "main",
      name: "Ana Bina",
      level: 1,
      icon: Home,
      description: "Köyünüzün kalbi. Seviye arttıkça diğer binaları geliştirebilirsiniz.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      resources: { wood: 100, stone: 80, gold: 50 },
    },
    {
      id: "market",
      name: "Pazar",
      level: 1,
      icon: ShoppingBag,
      description: "Kaynak ticareti yapın ve ekonominizi güçlendirin.",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      resources: { wood: 80, stone: 60, gold: 40 },
    },
    {
      id: "barracks",
      name: "Kışla",
      level: 1,
      icon: Swords,
      description: "Asker eğitin ve ordunuzu büyütün.",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      resources: { wood: 120, stone: 100, gold: 60 },
    },
    {
      id: "stable",
      name: "Ahır",
      level: 1,
      icon: Warehouse,
      description: "Süvari birlikleri yetiştirin.",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      resources: { wood: 150, stone: 80, gold: 70 },
    },
    {
      id: "workshop",
      name: "Atölye",
      level: 1,
      icon: Hammer,
      description: "Kuşatma silahları ve gelişmiş ekipmanlar üretin.",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      resources: { wood: 200, stone: 150, gold: 100 },
    },
    {
      id: "wall",
      name: "Sur",
      level: 1,
      icon: Shield,
      description: "Köyünüzü düşman saldırılarından koruyun.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      resources: { wood: 100, stone: 200, gold: 80 },
    },
  ])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/auth/login")
    } else {
      setUser(storedUser)
    }

    if (!worldId) {
      router.push("/worlds")
    }
  }, [router, worldId])

  const [villageScore, setVillageScore] = useState(0)

  useEffect(() => {
    setVillageScore(calculateVillageScore(buildings))
  }, [buildings])

  const handleUpgrade = (buildingId: string) => {
    const building = buildings.find((b) => b.id === buildingId)
    if (!building) return

    if (building.level >= MAX_BUILDING_LEVEL) return

    if (
      resources.wood >= building.resources.wood &&
      resources.stone >= building.resources.stone &&
      resources.gold >= building.resources.gold
    ) {
      setResources({
        ...resources,
        wood: resources.wood - building.resources.wood,
        stone: resources.stone - building.resources.stone,
        gold: resources.gold - building.resources.gold,
      })

      setBuildings(
        buildings.map((b) =>
          b.id === buildingId
            ? {
                ...b,
                level: b.level + 1,
                isUpgrading: true,
                upgradeTime: 60,
              }
            : b,
        ),
      )

      setTimeout(() => {
        setBuildings((prev) => prev.map((b) => (b.id === buildingId ? { ...b, isUpgrading: false } : b)))
      }, 3000)
    }
  }

  if (!user || !worldId) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold tracking-wider text-foreground">SANCAKLAR</span>
              </div>
              <Badge variant="outline" className="text-foreground">
                Köy: {user}
              </Badge>
              <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                <Trophy className="h-3 w-3 mr-1" />
                {villageScore} Puan
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push(`/village?world=${worldId}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Köy Görünümü
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push(`/map?world=${worldId}`)}>
                <Map className="h-4 w-4 mr-2" />
                Harita
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push("/worlds")}>
                Dünyalar
              </Button>
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

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-6">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Hammer className="h-4 w-4 text-amber-600" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Odun</span>
                <span className="text-sm font-bold text-foreground">{resources.wood}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Taş</span>
                <span className="text-sm font-bold text-foreground">{resources.stone}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Altın</span>
                <span className="text-sm font-bold text-foreground">{resources.gold}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Wheat className="h-4 w-4 text-green-600" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Gıda</span>
                <span className="text-sm font-bold text-foreground">{resources.food}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Nüfus</span>
                <span className="text-sm font-bold text-foreground">
                  {resources.population}/{resources.maxPopulation}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Zap className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Güç</span>
                <span className="text-sm font-bold text-foreground">1,250</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Binalar</h1>
          <p className="text-muted-foreground">Binalarını geliştir ve köyünü güçlendir</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building) => {
            const Icon = building.icon
            const canUpgrade =
              building.level < MAX_BUILDING_LEVEL &&
              resources.wood >= building.resources.wood &&
              resources.stone >= building.resources.stone &&
              resources.gold >= building.resources.gold

            return (
              <Card
                key={building.id}
                className={`group cursor-pointer border-border/50 bg-card/95 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 ${
                  selectedBuilding === building.id ? "border-primary ring-2 ring-primary/20" : ""
                }`}
                onClick={() => setSelectedBuilding(building.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${building.bgColor}`}>
                      <Icon className={`h-6 w-6 ${building.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-foreground">
                      Seviye {building.level}/{MAX_BUILDING_LEVEL}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {building.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{building.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {building.isUpgrading ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Geliştiriliyor...</span>
                        <Clock className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                      <Progress value={33} className="h-2" />
                    </div>
                  ) : building.level >= MAX_BUILDING_LEVEL ? (
                    <div className="text-center py-4">
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        <Trophy className="h-3 w-3 mr-1" />
                        Maksimum Seviye
                      </Badge>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                          Sonraki Seviye Maliyeti:
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col items-center rounded bg-muted/50 p-2">
                            <Hammer className="mb-1 h-4 w-4 text-amber-600" />
                            <span className="text-xs font-bold text-foreground">{building.resources.wood}</span>
                          </div>
                          <div className="flex flex-col items-center rounded bg-muted/50 p-2">
                            <Shield className="mb-1 h-4 w-4 text-gray-500" />
                            <span className="text-xs font-bold text-foreground">{building.resources.stone}</span>
                          </div>
                          <div className="flex flex-col items-center rounded bg-muted/50 p-2">
                            <Coins className="mb-1 h-4 w-4 text-yellow-500" />
                            <span className="text-xs font-bold text-foreground">{building.resources.gold}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        className={`w-full font-semibold ${
                          canUpgrade
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (canUpgrade) handleUpgrade(building.id)
                        }}
                        disabled={!canUpgrade}
                      >
                        {canUpgrade ? "Geliştir" : "Yetersiz Kaynak"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
