"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Crown, ArrowLeft, Swords, ShieldIcon, Users, Coins, Hammer } from "lucide-react"

interface Unit {
  name: string
  description: string
  cost: {
    wood: number
    stone: number
    gold: number
  }
  time: number
  attack: number
  defense: number
}

export default function BarracksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const worldId = searchParams.get("world")
  const [user, setUser] = useState<string | null>(null)

  const [resources] = useState({
    wood: 500,
    stone: 300,
    gold: 200,
    population: 50,
    maxPopulation: 100,
  })

  const units: Unit[] = [
    {
      name: "Mızrakçı",
      description: "Temel piyade birimi. Hızlı üretilir ve ucuzdur.",
      cost: { wood: 50, stone: 30, gold: 10 },
      time: 30,
      attack: 10,
      defense: 15,
    },
    {
      name: "Kılıçlı",
      description: "Güçlü saldırı gücüne sahip piyade birimi.",
      cost: { wood: 80, stone: 50, gold: 30 },
      time: 60,
      attack: 25,
      defense: 20,
    },
    {
      name: "Okçu",
      description: "Uzaktan saldırı yapabilen birim.",
      cost: { wood: 100, stone: 40, gold: 40 },
      time: 45,
      attack: 30,
      defense: 10,
    },
  ]

  const [trainAmount, setTrainAmount] = useState<{ [key: string]: number }>({})

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

  if (!user || !worldId) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push(`/village?world=${worldId}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Köye Dön
              </Button>
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold tracking-wider text-foreground">KIŞLA</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Hammer className="h-4 w-4 text-amber-600" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Odun</span>
                <span className="text-sm font-bold text-foreground">{resources.wood}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <ShieldIcon className="h-4 w-4 text-gray-500" />
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
              <Users className="h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Nüfus</span>
                <span className="text-sm font-bold text-foreground">
                  {resources.population}/{resources.maxPopulation}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-border/50 bg-card/95 backdrop-blur p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Swords className="h-6 w-6 text-red-500" />
              Asker Eğitimi
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Köyünüzü savunmak ve saldırılar düzenlemek için asker yetiştirin.
            </p>

            <div className="space-y-4">
              {units.map((unit) => (
                <Card key={unit.name} className="border-border/50 bg-muted/30 p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{unit.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{unit.description}</p>
                    </div>
                    <Badge variant="outline" className="text-foreground">
                      {unit.time}s
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Maliyet:</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Hammer className="h-3 w-3 text-amber-600" />
                        <span className="text-foreground">{unit.cost.wood}</span>
                        <ShieldIcon className="h-3 w-3 text-gray-500 ml-2" />
                        <span className="text-foreground">{unit.cost.stone}</span>
                        <Coins className="h-3 w-3 text-yellow-500 ml-2" />
                        <span className="text-foreground">{unit.cost.gold}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">İstatistikler:</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Swords className="h-3 w-3 text-red-500" />
                          <span className="text-foreground">{unit.attack}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShieldIcon className="h-3 w-3 text-blue-500" />
                          <span className="text-foreground">{unit.defense}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Miktar"
                      value={trainAmount[unit.name] || ""}
                      onChange={(e) =>
                        setTrainAmount({ ...trainAmount, [unit.name]: Number.parseInt(e.target.value) || 0 })
                      }
                      className="bg-background"
                    />
                    <Button className="whitespace-nowrap">Eğit</Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
