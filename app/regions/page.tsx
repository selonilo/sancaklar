"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Compass, Mountain, Waves, Sun, Snowflake, Wind, Flame, Leaf } from "lucide-react"

interface Region {
  id: string
  name: string
  subtitle: string
  description: string
  icon: any
  color: string
  bgColor: string
  borderColor: string
  advantages: string[]
}

const REGIONS: Region[] = [
  {
    id: "north",
    name: "Kuzey",
    subtitle: "Sonsuz Kış",
    description:
      "Buzul dağları ve karlı ovalarla kaplı sert topraklar. Sadece en güçlü savaşçılar burada hayatta kalabilir.",
    icon: Snowflake,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    advantages: ["Savunma +15%", "Kış direnci", "Kaynak bonusu: Demir"],
  },
  {
    id: "south",
    name: "Güney",
    subtitle: "Altın Çöller",
    description: "Sıcak çöller ve bereketli vahalar. Ticaret yollarının kesiştiği zengin topraklar.",
    icon: Sun,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    advantages: ["Ticaret +20%", "Altın üretimi", "Hızlı birlik eğitimi"],
  },
  {
    id: "east",
    name: "Doğu",
    subtitle: "Yükselen Güneş",
    description: "Dağlık araziler ve stratejik geçitler. Savunması kolay, fethi zor topraklar.",
    icon: Mountain,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    advantages: ["Dağ savunması +25%", "Taş üretimi", "Kale bonusu"],
  },
  {
    id: "west",
    name: "Batı",
    subtitle: "Fırtınalı Kıyılar",
    description: "Deniz kıyıları ve limanlar. Deniz ticareti ve donanma gücünün merkezi.",
    icon: Waves,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    advantages: ["Deniz ticareti +30%", "Donanma bonusu", "Balık kaynağı"],
  },
  {
    id: "northeast",
    name: "Kuzeydoğu",
    subtitle: "Rüzgar Bozkırları",
    description: "Geniş ovalar ve süvari birlikleri için ideal araziler. Hızlı saldırılar için mükemmel.",
    icon: Wind,
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    advantages: ["Süvari hızı +20%", "Geniş topraklar", "At üretimi"],
  },
  {
    id: "northwest",
    name: "Kuzeybatı",
    subtitle: "Sis Ormanları",
    description: "Yoğun ormanlar ve gizli yollar. Pusu ve gizli saldırılar için ideal.",
    icon: Leaf,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    advantages: ["Gizlenme +25%", "Odun üretimi", "Okçu bonusu"],
  },
  {
    id: "southeast",
    name: "Güneydoğu",
    subtitle: "Ateş Dağları",
    description: "Volkanik topraklar ve zengin maden yatakları. Güçlü silahlar için gerekli kaynaklar.",
    icon: Flame,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    advantages: ["Silah üretimi +20%", "Maden bonusu", "Saldırı gücü +10%"],
  },
  {
    id: "southwest",
    name: "Güneybatı",
    subtitle: "Yeşil Vadiler",
    description: "Bereketli topraklar ve bol su kaynakları. Tarım ve nüfus artışı için ideal.",
    icon: Leaf,
    color: "text-lime-400",
    bgColor: "bg-lime-500/10",
    borderColor: "border-lime-500/30",
    advantages: ["Tarım +30%", "Nüfus artışı +15%", "Gıda üretimi"],
  },
]

export default function RegionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const worldId = searchParams.get("world")
  const [user, setUser] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

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

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId)
  }

  const handleConfirm = () => {
    if (selectedRegion && worldId) {
      // Save region selection
      localStorage.setItem(`world_${worldId}_region`, selectedRegion)
      // Navigate to village
      router.push(`/village?world=${worldId}`)
    }
  }

  if (!user || !worldId) return null

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
            <Button variant="ghost" size="sm" onClick={() => router.push("/worlds")}>
              Geri
            </Button>
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">{user}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Compass className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Bölge Seçimi</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Bölgeni Seç</h1>
          <p className="text-lg text-muted-foreground">
            Her bölgenin kendine özgü avantajları var. Strateji tarzına uygun bölgeyi seç.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {REGIONS.map((region) => {
            const Icon = region.icon
            const isSelected = selectedRegion === region.id

            return (
              <Card
                key={region.id}
                className={`group cursor-pointer border-border/50 bg-card/95 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 ${
                  isSelected ? "border-primary ring-2 ring-primary/20" : ""
                }`}
                onClick={() => handleRegionSelect(region.id)}
              >
                <CardHeader>
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${region.bgColor}`}
                  >
                    <Icon className={`h-6 w-6 ${region.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {region.name}
                  </CardTitle>
                  <CardDescription className={`font-semibold ${region.color}`}>{region.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{region.description}</p>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Avantajlar:</p>
                    {region.advantages.map((advantage, index) => (
                      <div key={index} className={`flex items-center gap-2 rounded px-2 py-1 ${region.bgColor}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${region.color.replace("text-", "bg-")}`} />
                        <span className="text-xs text-foreground">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {selectedRegion && (
          <div className="mt-12 flex justify-center">
            <Button
              size="lg"
              onClick={handleConfirm}
              className="h-14 bg-primary px-12 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Bölgeyi Onayla ve Devam Et
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
