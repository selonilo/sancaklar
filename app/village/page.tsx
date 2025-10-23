"use client"

import type React from "react"

import { useEffect, useState, useRef, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Crown,
  Home,
  Swords,
  Hammer,
  Shield,
  Users,
  Coins,
  Wheat,
  Zap,
  Trophy,
  Clock,
  Flag,
  ChevronRight,
} from "lucide-react"
import { Map as MapIcon } from "lucide-react"

interface Building {
  id: string
  x: number // Merkezin X koordinatı
  y: number // Tabanın Y koordinatı (Perspektif için önemli)
  width: number
  height: number
  name: string
  route: string
  type: string
}

export default function VillageOverviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const worldId = searchParams.get("world")
  const [user, setUser] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(
      null
  )
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const [resources] = useState({
    wood: 500,
    stone: 300,
    gold: 200,
    food: 1000,
    population: 50,
    maxPopulation: 100,
  })

  const [production] = useState({
    wood: 8,
    stone: 6,
    gold: 4,
  })

  const [villageScore] = useState(167)

  const buildings: Building[] = useMemo(
      () => [
        {
          id: "main_hall",
          x: 350,
          y: 320,
          width: 120,
          height: 140,
          name: "Ana Bina",
          route: "/village/buildings",
          type: "main",
        },
        {
          id: "market",
          x: 200,
          y: 430,
          width: 90,
          height: 100,
          name: "Pazar",
          route: "/village/market",
          type: "market",
        },
        {
          id: "barracks",
          x: 500,
          y: 430,
          width: 90,
          height: 100,
          name: "Kışla",
          route: "/village/barracks",
          type: "barracks",
        },
        {
          id: "stable",
          x: 230,
          y: 250,
          width: 80,
          height: 90,
          name: "Ahır",
          route: "/village/stable",
          type: "stable",
        },
        {
          id: "workshop",
          x: 470,
          y: 250,
          width: 80,
          height: 90,
          name: "Atölye",
          route: "/village/workshop",
          type: "workshop",
        },
      ],
      []
  )

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

  useEffect(() => {
    setImagesLoaded(true)
  }, [])

  const drawBuilding = (
      ctx: CanvasRenderingContext2D,
      building: Building,
      isHovered: boolean
  ) => {
    const { x, y, width, height } = building
    const drawX = x - width / 2
    const drawY = y - height

    // 1. Gölge
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    ctx.beginPath()
    ctx.ellipse(x, y, width / 2.2, width / 5, 0, 0, Math.PI * 2)
    ctx.fill()

    // 2. Vurgu (Hover)
    ctx.shadowBlur = 0
    ctx.shadowColor = "transparent"
    if (isHovered) {
      ctx.shadowColor = "#fbbf24"
      ctx.shadowBlur = 30
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }

    // 3. Bina Görseli
    ctx.save()
    const roofHeight = height * 0.4
    const bodyHeight = height * 0.6
    const bodyY = drawY + roofHeight
    const roofInset = width * 0.2

    switch (building.type) {
      case "main":
        ctx.fillStyle = "#a8a29e"
        ctx.fillRect(drawX, bodyY, width, bodyHeight)
        ctx.fillStyle = "#713f12"
        ctx.fillRect(drawX, bodyY, width, bodyHeight * 0.15)
        ctx.fillStyle = "#fcd34d"
        ctx.fillRect(
            x - width * 0.15,
            y - bodyHeight * 0.6,
            width * 0.3,
            bodyHeight * 0.55
        )
        ctx.fillStyle = "#5d4037"
        ctx.beginPath()
        ctx.moveTo(drawX - roofInset / 2, bodyY)
        ctx.lineTo(x, drawY)
        ctx.lineTo(drawX + width + roofInset / 2, bodyY)
        ctx.closePath()
        ctx.fill()
        break
      case "barracks":
        ctx.fillStyle = "#57534e"
        ctx.fillRect(drawX, bodyY, width, bodyHeight)
        ctx.fillStyle = "#dc2626"
        ctx.fillRect(drawX, bodyY, width, -roofHeight * 0.5)
        ctx.fillStyle = "#71717a"
        ctx.fillRect(x - 2, drawY, 4, roofHeight)
        ctx.fillStyle = "#ef4444"
        ctx.fillRect(x + 2, drawY, width * 0.3, height * 0.15)
        break
      case "market":
        ctx.fillStyle = "#d2b48c"
        ctx.fillRect(drawX, bodyY, width, bodyHeight)
        const stripeWidth = width / 6
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = i % 2 === 0 ? "#fef2f2" : "#fca5a5"
          ctx.beginPath()
          ctx.moveTo(drawX + i * stripeWidth, bodyY)
          ctx.lineTo(x, drawY)
          ctx.lineTo(drawX + (i + 1) * stripeWidth, bodyY)
          ctx.closePath()
          ctx.fill()
        }
        break
      case "stable":
        ctx.fillStyle = "#a16207"
        ctx.fillRect(drawX, bodyY, width, bodyHeight)
        ctx.fillStyle = "#5d4037"
        ctx.fillRect(drawX, bodyY + bodyHeight * 0.2, width, bodyHeight * 0.1)
        ctx.fillRect(drawX, bodyY + bodyHeight * 0.7, width, bodyHeight * 0.1)
        ctx.fillStyle = "#ca8a04"
        ctx.beginPath()
        ctx.moveTo(drawX, bodyY)
        ctx.lineTo(x, drawY)
        ctx.lineTo(drawX + width, bodyY)
        ctx.closePath()
        ctx.fill()
        break
      case "workshop":
        ctx.fillStyle = "#78716c"
        ctx.fillRect(drawX, bodyY, width, bodyHeight)
        ctx.fillStyle = "#44403c"
        ctx.beginPath()
        ctx.moveTo(drawX, bodyY)
        ctx.lineTo(x, drawY)
        ctx.lineTo(drawX + width, bodyY)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = "#57534e"
        ctx.fillRect(
            drawX + width * 0.7,
            drawY + roofHeight * 0.3,
            width * 0.2,
            -roofHeight * 0.5
        )
        break
      default:
        ctx.fillStyle = "#a855f7"
        ctx.fillRect(drawX, drawY, width, height)
    }

    ctx.restore()
    ctx.shadowBlur = 0
    ctx.shadowColor = "transparent"

    // 4. İsim Etiketi (Hover)
    if (isHovered) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)"
      ctx.fillRect(x - 50, y + 10, 100, 26)
      ctx.fillStyle = "#fbbf24"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(building.name, x, y + 28)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imagesLoaded) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 1. Arka Planı Çiz (Orta Çağ Köyü Zemini)
    ctx.clearRect(0, 0, width, height)

    // Gökyüzü (Daha soluk ve pastel tonlarda)
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height / 2)
    skyGradient.addColorStop(0, "#a2d2ff") // Açık mavi
    skyGradient.addColorStop(1, "#f0f8ff") // Neredeyse beyaz
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, width, height / 2)

    // Uzak tepeler / ufuk çizgisi (daha doğal ve kahverengi/yeşil tonlar)
    ctx.fillStyle = "#8b8378" // Gri-kahve dağlar
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width * 0.2, height / 2 - 50)
    ctx.lineTo(width * 0.4, height / 2 - 20)
    ctx.lineTo(width * 0.6, height / 2 - 80)
    ctx.lineTo(width * 0.8, height / 2 - 30)
    ctx.lineTo(width, height / 2 - 60)
    ctx.lineTo(width, height / 2)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "#7e786b" // Daha koyu ton
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width * 0.1, height / 2 - 30)
    ctx.lineTo(width * 0.3, height / 2 - 10)
    ctx.lineTo(width * 0.5, height / 2 - 60)
    ctx.lineTo(width * 0.7, height / 2 - 20)
    ctx.lineTo(width * 0.9, height / 2 - 50)
    ctx.lineTo(width, height / 2)
    ctx.closePath()
    ctx.fill()

    // Çayır / Toprak zemini (daha kahverengiye çalan, eski yol efekti)
    const groundGradient = ctx.createLinearGradient(0, height / 2, 0, height)
    groundGradient.addColorStop(0, "#c2b280") // Açık kahve / kirli sarı
    groundGradient.addColorStop(1, "#8b7355") // Koyu kahve
    ctx.fillStyle = groundGradient
    ctx.fillRect(0, height / 2, width, height / 2)

    // Yola benzer doku (daha belirgin, taşlı yol)
    ctx.globalAlpha = 0.3 // Hafif şeffaflık
    ctx.fillStyle = "#968b7d" // Gri-kahve taş rengi
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * width
      const y = height / 2 + Math.random() * (height / 2) // Sadece alt yarıda
      const size = 5 + Math.random() * 10 // Daha büyük ve düzensiz
      ctx.beginPath()
      ctx.ellipse(x, y, size, size / 2, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    // Köy Platosu / Yükseltisi
    const plateauX = width / 2
    const plateauY = 350
    const radiusX = 300
    const radiusY = 150
    const wallHeight = 25

    // Platonun alt gölgesi ve yan duvarı
    ctx.fillStyle = "#44403c"
    ctx.beginPath()
    ctx.ellipse(plateauX, plateauY + wallHeight, radiusX, radiusY, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#57534e"
    ctx.beginPath()
    ctx.ellipse(
        plateauX,
        plateauY + wallHeight / 2,
        radiusX,
        radiusY,
        0,
        0,
        Math.PI * 2
    )
    ctx.fill()

    // Surların çizimi
    const wallColor = "#8a7e70" // Surların ana rengi
    const battlementColor = "#736a5c" // Savaş siperleri rengi
    const battlementHeight = 15 // Savaş siperi yüksekliği
    const battlementWidth = 10 // Savaş siperi genişliği
    const battlementGap = 15 // Savaş siperleri arasındaki boşluk
    const wallThickness = 12 // Surların kalınlığı (ovalin dışından içeriye doğru)

    ctx.save()
    ctx.translate(plateauX, plateauY) // Koordinat sistemini plato merkezine taşı

    // Surların alt kısmı (daha koyu ton, derinlik vermek için)
    ctx.fillStyle = battlementColor
    ctx.beginPath()
    for (let i = 0; i < Math.PI * 2; i += Math.PI / 100) {
      const currentRadiusX = radiusX + wallThickness
      const currentRadiusY = radiusY + wallThickness / 2
      const px = currentRadiusX * Math.cos(i)
      const py = currentRadiusY * Math.sin(i) * 0.8
      if (i === 0) {
        ctx.moveTo(px, py + wallHeight)
      } else {
        ctx.lineTo(px, py + wallHeight)
      }
    }
    ctx.closePath()
    ctx.fill()

    // Surların ana gövdesi
    ctx.fillStyle = wallColor
    ctx.beginPath()
    for (let i = 0; i < Math.PI * 2; i += Math.PI / 100) {
      const currentRadiusX = radiusX + wallThickness
      const currentRadiusY = radiusY + wallThickness / 2
      const px = currentRadiusX * Math.cos(i)
      const py = currentRadiusY * Math.sin(i) * 0.8
      if (i === 0) {
        ctx.moveTo(px, py)
      } else {
        ctx.lineTo(px, py)
      }
    }
    ctx.closePath()
    ctx.fill()

    // Savaş siperleri (Battlementler) ve sivri uçlar
    ctx.fillStyle = battlementColor
    const numBattlements = Math.floor((Math.PI * 2 * (radiusX + wallThickness)) / (battlementWidth + battlementGap))
    for (let i = 0; i < numBattlements; i++) {
      const angle = (i / numBattlements) * Math.PI * 2
      const currentRadiusX = radiusX + wallThickness
      const currentRadiusY = radiusY + wallThickness / 2

      const x1 = currentRadiusX * Math.cos(angle - (battlementWidth / 2 / currentRadiusX))
      const y1 = currentRadiusY * Math.sin(angle - (battlementWidth / 2 / currentRadiusX)) * 0.8

      const x2 = currentRadiusX * Math.cos(angle + (battlementWidth / 2 / currentRadiusX))
      const y2 = currentRadiusY * Math.sin(angle + (battlementWidth / 2 / currentRadiusX)) * 0.8

      // Battlement dikdörtgeni
      ctx.fillRect(x1, y1 - battlementHeight, x2 - x1, battlementHeight)

      // Sivri uç eklemek (her battlement'ın ortasına)
      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2 - battlementHeight // Battlement'ın üst kenarının ortası

      ctx.beginPath()
      ctx.moveTo(midX, midY) // Battlement'ın üst ortası
      ctx.lineTo(midX - 5, midY - 10) // Sol sivri köşe
      ctx.lineTo(midX, midY - 20) // Sivri tepe
      ctx.lineTo(midX + 5, midY - 10) // Sağ sivri köşe
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore() // Koordinat sistemini geri al

    // Platonun ana yüzeyi (surların içinde kalan kısım)
    ctx.fillStyle = "#7a9a71" // Yeşilimsi ton
    ctx.beginPath()
    ctx.ellipse(plateauX, plateauY, radiusX, radiusY, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(plateauX, plateauY, radiusX, radiusY, 0, 0, Math.PI * 2)
    ctx.clip()
    ctx.globalAlpha = 0.2
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * radiusX * 2 + (plateauX - radiusX)
      const y = Math.random() * radiusY * 2 + (plateauY - radiusY)
      const size = 1 + Math.random() * 2
      ctx.fillStyle = i % 2 === 0 ? "#8ab07d" : "#6a9a61"
      ctx.fillRect(x, y, size, size)
    }
    ctx.globalAlpha = 1
    ctx.restore()

    // Binaları Y Eksenine Göre Sırala (Derinlik)
    const sortedBuildings = [...buildings].sort((a, b) => a.y - b.y)

    // Binaları Çiz (Yeni drawBuilding fonksiyonu ile)
    sortedBuildings.forEach((building) => {
      drawBuilding(ctx, building, building.id === hoveredBuildingId)
    })

    // Çevre Detayları (Ağaçlar kaldırıldı)

  }, [hoveredBuildingId, imagesLoaded, buildings])

  const getBuildingAtPos = (x: number, y: number): Building | null => {
    const sortedBuildings = [...buildings].sort((a, b) => b.y - a.y)
    for (const building of sortedBuildings) {
      const yBuffer = building.height * 0.2
      const hitboxXMin = building.x - building.width / 2
      const hitboxXMax = building.x + building.width / 2
      const hitboxYMin = building.y - building.height
      const hitboxYMax = building.y + yBuffer
      if (
          x >= hitboxXMin &&
          x <= hitboxXMax &&
          y >= hitboxYMin &&
          y <= hitboxYMax
      ) {
        return building
      }
    }
    return null
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const canvasX = mouseX * scaleX
    const canvasY = mouseY * scaleY

    const clickedBuilding = getBuildingAtPos(canvasX, canvasY)
    if (clickedBuilding) {
      router.push(`${clickedBuilding.route}?world=${worldId}`)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const canvasX = mouseX * scaleX
    const canvasY = mouseY * scaleY

    const hoveredBuilding = getBuildingAtPos(canvasX, canvasY)
    const newHoveredId = hoveredBuilding ? hoveredBuilding.id : null
    if (newHoveredId !== hoveredBuildingId) {
      setHoveredBuildingId(newHoveredId)
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
                  <span className="text-xl font-bold tracking-wider text-foreground">
                  SANCAKLAR
                </span>
                </div>
                <Badge variant="outline" className="text-foreground">
                  Köy: {user}
                </Badge>
                <Badge
                    variant="default"
                    className="bg-primary/20 text-primary border-primary/30"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  {villageScore} Puan
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/map?world=${worldId}`)}
                >
                  <MapIcon className="h-4 w-4 mr-2" />
                  Harita
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/worlds")}
                >
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
                  <span className="text-sm font-bold text-foreground">
                  {resources.wood}
                </span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Taş</span>
                  <span className="text-sm font-bold text-foreground">
                  {resources.stone}
                </span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Altın</span>
                  <span className="text-sm font-bold text-foreground">
                  {resources.gold}
                </span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Wheat className="h-4 w-4 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Gıda</span>
                  <span className="text-sm font-bold text-foreground">
                  {resources.food}
                </span>
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
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-border/50 bg-card/95 backdrop-blur p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {user}'nin Köyü ({villageScore} puan)
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Binalara tıklayarak detaylarını görün ve geliştirin
                  </p>
                </div>

                <div className="relative">
                  {!imagesLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">
                            Köy yükleniyor...
                          </p>
                        </div>
                      </div>
                  )}
                  <canvas
                      ref={canvasRef}
                      width={700}
                      height={600}
                      className="w-full h-auto aspect-[700/600] rounded-lg border border-border/50 cursor-pointer bg-gray-700"
                      onClick={handleCanvasClick}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseLeave={() => setHoveredBuildingId(null)}
                      style={{ opacity: imagesLoaded ? 1 : 0.3 }}
                  />
                  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur border border-border/50 rounded-lg px-3 py-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      Binalara tıklayın
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border/50 bg-card/95 backdrop-blur p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Üretim
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hammer className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-foreground">Odun</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                    {production.wood} saat başına
                  </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-foreground">Taş</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                    {production.stone} saat başına
                  </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-foreground">Altın</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                    {production.gold} saat başına
                  </span>
                  </div>
                </div>
              </Card>

              <Card className="border-border/50 bg-card/95 backdrop-blur p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Swords className="h-5 w-5 text-red-500" />
                  Birimler
                </h3>
                <div className="space-y-3">
                  <Button
                      variant="outline"
                      className="w-full justify-between bg-transparent"
                  >
                    <span>Hepsi</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                      variant="outline"
                      className="w-full justify-between bg-transparent"
                  >
                    <span>Asker Topla</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              <Card className="border-border/50 bg-card/95 backdrop-blur p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Flag className="h-5 w-5 text-primary" />
                  Aktif Etkiler
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Şimdi kalıntı atayin</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Hemen bayrak ata</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
  )
}