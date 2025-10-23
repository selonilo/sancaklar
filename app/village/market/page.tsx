"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Crown, ArrowLeft, Coins, Hammer, Shield, TrendingUp, TrendingDown } from "lucide-react"

export default function MarketPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const worldId = searchParams.get("world")
  const [user, setUser] = useState<string | null>(null)

  const [resources] = useState({
    wood: 500,
    stone: 300,
    gold: 200,
  })

  const [tradeAmount, setTradeAmount] = useState({
    wood: 0,
    stone: 0,
  })

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
                <span className="text-xl font-bold tracking-wider text-foreground">PAZAR</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-border/50 bg-card/95 backdrop-blur p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Kaynak Ticareti</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Kaynaklarınızı altınla alıp satabilirsiniz. Piyasa fiyatları sürekli değişmektedir.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/50 bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Hammer className="h-5 w-5 text-amber-600" />
                    <h3 className="font-bold text-foreground">Odun</h3>
                  </div>
                  <Badge variant="outline" className="text-foreground">
                    Stok: {resources.wood}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-foreground">Satın Al</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">1 Odun = 2 Altın</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-foreground">Sat</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">1 Odun = 1 Altın</span>
                  </div>

                  <Input
                    type="number"
                    placeholder="Miktar"
                    value={tradeAmount.wood || ""}
                    onChange={(e) => setTradeAmount({ ...tradeAmount, wood: Number.parseInt(e.target.value) || 0 })}
                    className="bg-background"
                  />

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="default">
                      Satın Al
                    </Button>
                    <Button className="flex-1 bg-transparent" variant="outline">
                      Sat
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="border-border/50 bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gray-500" />
                    <h3 className="font-bold text-foreground">Taş</h3>
                  </div>
                  <Badge variant="outline" className="text-foreground">
                    Stok: {resources.stone}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-foreground">Satın Al</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">1 Taş = 3 Altın</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-foreground">Sat</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">1 Taş = 2 Altın</span>
                  </div>

                  <Input
                    type="number"
                    placeholder="Miktar"
                    value={tradeAmount.stone || ""}
                    onChange={(e) => setTradeAmount({ ...tradeAmount, stone: Number.parseInt(e.target.value) || 0 })}
                    className="bg-background"
                  />

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="default">
                      Satın Al
                    </Button>
                    <Button className="flex-1 bg-transparent" variant="outline">
                      Sat
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          <Card className="border-border/50 bg-card/95 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              Mevcut Altın
            </h3>
            <div className="text-3xl font-bold text-primary">{resources.gold}</div>
          </Card>
        </div>
      </main>
    </div>
  )
}
