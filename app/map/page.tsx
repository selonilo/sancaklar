"use client"

import type React from "react"
// useMemo'yu import etmemiştik, ekledim.
import { useEffect, useState, useRef, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Crown,
  Home,
  Trophy,
  Users,
  Swords,
  Shield,
  ArrowLeft,
} from "lucide-react"

interface Village {
  id: string
  name: string
  owner: string
  score: number
  x: number // Grid coordinate
  y: number // Grid coordinate
  isPlayer: boolean
  alliance?: string
}

// getVillageImage, getVillageAppearance, drawVillage fonksiyonları (Değişiklik yok)
const getVillageImage = (score: number): string => {
  if (score >= 800) {
    return "/medieval-empire-fortress-with-multiple-towers-and-.jpg"
  } else if (score >= 600) {
    return "/medieval-kingdom-castle-with-flag-towers-and-forti.jpg"
  } else if (score >= 400) {
    return "/medieval-stone-castle-with-defensive-walls-and-gat.jpg"
  } else if (score >= 200) {
    return "/medieval-town-with-wooden-walls-and-watchtower.jpg"
  } else {
    return "/small-medieval-village-with-simple-wooden-fence.jpg"
  }
}

const getVillageAppearance = (score: number) => {
  if (score >= 800) {
    return { type: "empire", label: "İmparatorluk", color: "#fbbf24", size: 32 }
  } else if (score >= 600) {
    return { type: "kingdom", label: "Krallık", color: "#a855f7", size: 28 }
  } else if (score >= 400) {
    return { type: "castle", label: "Kale", color: "#3b82f6", size: 24 }
  } else if (score >= 200) {
    return { type: "town", label: "Kasaba", color: "#10b981", size: 20 }
  } else {
    return { type: "village", label: "Köy", color: "#6b7280", size: 16 }
  }
}

const drawVillage = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    score: number,
    isPlayer: boolean,
    isSelected: boolean,
    isHovered: boolean
) => {
  const baseSize = 35

  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)"
  ctx.beginPath()
  ctx.ellipse(
      x,
      y + baseSize * 0.5,
      baseSize * 0.8,
      baseSize * 0.2,
      0,
      0,
      Math.PI * 2
  )
  ctx.fill()

  let wallRadius = baseSize * 0.6
  let wallThickness = 4
  let wallColor = "#8b7355" // Açık kahverengi

  if (score >= 800) {
    wallRadius = Math.min(baseSize * 0.85, 18)
    wallThickness = 12 // Çok kalın
    wallColor = "#2a2a2a" // Siyaha yakın (demir)
  } else if (score >= 600) {
    wallRadius = Math.min(baseSize * 0.75, 18)
    wallThickness = 10
    wallColor = "#3a3a3a" // Koyu gri (demir)
  } else if (score >= 400) {
    wallRadius = Math.min(baseSize * 0.68, 18)
    wallThickness = 8
    wallColor = "#4a4a4a" // Orta gri (taş/demir)
  } else if (score >= 200) {
    wallRadius = Math.min(baseSize * 0.62, 18)
    wallThickness = 6
    wallColor = "#6a5a4a" // Koyu kahverengi (taş)
  } else {
    wallRadius = Math.min(baseSize * 0.58, 18)
    wallThickness = 4
    wallColor = "#8b7355" // Açık kahverengi (ahşap)
  }

  // Draw stone/iron wall with metallic effect
  ctx.strokeStyle = wallColor
  ctx.lineWidth = wallThickness
  ctx.beginPath()
  ctx.arc(x, y, wallRadius, 0, Math.PI * 2)
  ctx.stroke()

  // Metallic highlight for higher level walls
  if (score >= 400) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = wallThickness * 0.15
    ctx.beginPath()
    ctx.arc(
        x - wallRadius * 0.2,
        y - wallRadius * 0.2,
        wallRadius,
        Math.PI * 0.8,
        Math.PI * 1.2
    )
    ctx.stroke()
  }

  // Stone/metal texture on wall
  const numStones = Math.floor(wallRadius * 1.2)
  for (let i = 0; i < numStones; i++) {
    const angle = (Math.PI * 2 * i) / numStones
    const stoneX = x + Math.cos(angle) * wallRadius
    const stoneY = y + Math.sin(angle) * wallRadius

    ctx.fillStyle =
        i % 2 === 0 ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.15)"
    ctx.fillRect(stoneX - 2, stoneY - wallThickness / 2, 4, wallThickness)
  }

  // Wall inner shadow for depth
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
  ctx.lineWidth = wallThickness * 0.25
  ctx.beginPath()
  ctx.arc(x, y, wallRadius - wallThickness * 0.35, 0, Math.PI * 2)
  ctx.stroke()

  // Wall outer highlight
  ctx.strokeStyle =
      score >= 400 ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.2)"
  ctx.lineWidth = wallThickness * 0.2
  ctx.beginPath()
  ctx.arc(x, y, wallRadius + wallThickness * 0.35, 0, Math.PI * 2)
  ctx.stroke()

  // Central building (main hall) - ONLY building inside the walls
  const mainSize =
      score >= 800 ? 14 : score >= 600 ? 12 : score >= 400 ? 10 : score >= 200 ? 8 : 6
  ctx.fillStyle = "#9a8a7a"
  ctx.fillRect(x - mainSize / 2, y - mainSize / 2, mainSize, mainSize * 1.2)

  // Main building stone texture
  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)"
  ctx.lineWidth = 1
  ctx.strokeRect(x - mainSize / 2, y - mainSize / 2, mainSize, mainSize * 0.4)
  ctx.strokeRect(x - mainSize / 2, y - mainSize * 0.1, mainSize, mainSize * 0.4)

  // Main building roof
  ctx.fillStyle =
      score >= 800
          ? "#ffd700"
          : score >= 600
              ? "#a855f7"
              : score >= 400
                  ? "#4a7a9a"
                  : "#8b4513"
  ctx.beginPath()
  ctx.moveTo(x - mainSize / 2, y - mainSize / 2)
  ctx.lineTo(x, y - mainSize * 1.2)
  ctx.lineTo(x + mainSize / 2, y - mainSize / 2)
  ctx.closePath()
  ctx.fill()

  // Flag on main building
  if (score >= 400) {
    ctx.strokeStyle = "#3a2a1a"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x, y - mainSize * 1.2)
    ctx.lineTo(x, y - mainSize * 1.8)
    ctx.stroke()

    ctx.fillStyle = isPlayer ? "#fbbf24" : "#dc2626"
    ctx.beginPath()
    ctx.moveTo(x, y - mainSize * 1.8)
    ctx.lineTo(x + 8, y - mainSize * 1.65)
    ctx.lineTo(x, y - mainSize * 1.5)
    ctx.closePath()
    ctx.fill()
  }

  // Selection/hover indicator
  if (isSelected || isHovered) {
    ctx.strokeStyle = isPlayer
        ? "#fbbf24"
        : isSelected
            ? "#3b82f6"
            : "#60a5fa"
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(x, y, wallRadius + 8, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // Player star
  if (isPlayer) {
    ctx.fillStyle = "#fbbf24"
    ctx.font = "bold 24px sans-serif"
    ctx.textAlign = "center"
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)"
    ctx.lineWidth = 4
    ctx.strokeText("★", x, y - wallRadius - 10)
    ctx.fillText("★", x, y - wallRadius - 10)
  }
}

const Minimap = ({
                   villages,
                   offset,
                   canvasWidth,
                   canvasHeight,
                   gridSize,
                   worldSize,
                   onMinimapClick,
                 }: {
  villages: Village[]
  offset: { x: number; y: number }
  canvasWidth: number
  canvasHeight: number
  gridSize: number
  worldSize: number
  onMinimapClick: (x: number, y: number) => void
}) => {
  const minimapRef = useRef<HTMLCanvasElement>(null)
  const minimapSize = 200

  useEffect(() => {
    const canvas = minimapRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, minimapSize, minimapSize)

    // Background
    ctx.fillStyle = "#3a5a31"
    ctx.fillRect(0, 0, minimapSize, minimapSize)

    // Grid lines - every 50 grid cells (50 out of 1000)
    ctx.strokeStyle = "rgba(139, 92, 46, 0.4)"
    ctx.lineWidth = 1
    const gridStep = minimapSize / 20 // 20 divisions for 1000 grid cells (every 50 cells)
    for (let i = 0; i <= 20; i++) {
      ctx.beginPath()
      ctx.moveTo(i * gridStep, 0)
      ctx.lineTo(i * gridStep, minimapSize)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * gridStep)
      ctx.lineTo(minimapSize, i * gridStep)
      ctx.stroke()
    }

    // Finer grid lines - every 10 grid cells
    ctx.strokeStyle = "rgba(139, 92, 46, 0.15)"
    ctx.lineWidth = 0.5
    const fineGridStep = minimapSize / 100 // 100 divisions for 1000 grid cells (every 10 cells)
    for (let i = 0; i <= 100; i++) {
      if (i % 5 !== 0) {
        // Skip every 5th line (already drawn above)
        ctx.beginPath()
        ctx.moveTo(i * fineGridStep, 0)
        ctx.lineTo(i * fineGridStep, minimapSize)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i * fineGridStep)
        ctx.lineTo(minimapSize, i * fineGridStep)
        ctx.stroke()
      }
    }

    villages.forEach((village) => {
      const minimapX = (village.x / worldSize) * minimapSize
      const minimapY = (village.y / worldSize) * minimapSize

      ctx.fillStyle = village.isPlayer ? "#ffffff" : "#8b7355"

      // Draw as square instead of circle
      const squareSize = village.isPlayer ? 4 : 3
      ctx.fillRect(
          minimapX - squareSize / 2,
          minimapY - squareSize / 2,
          squareSize,
          squareSize
      )

      if (village.isPlayer) {
        ctx.strokeStyle = "#fbbf24"
        ctx.lineWidth = 2
        ctx.strokeRect(
            minimapX - squareSize / 2,
            minimapY - squareSize / 2,
            squareSize,
            squareSize
        )
      }
    })

    // Viewport indicator
    const viewportX = (-offset.x / (worldSize * gridSize)) * minimapSize
    const viewportY = (-offset.y / (worldSize * gridSize)) * minimapSize
    const viewportWidth = (canvasWidth / (worldSize * gridSize)) * minimapSize
    const viewportHeight = (canvasHeight / (worldSize * gridSize)) * minimapSize

    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.setLineDash([4, 4])
    ctx.strokeRect(viewportX, viewportY, viewportWidth, viewportHeight)
    ctx.setLineDash([])

    // Border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, minimapSize, minimapSize)
  }, [villages, offset, canvasWidth, canvasHeight, gridSize, worldSize])

  const handleMinimapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = minimapRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Convert minimap coordinates to world coordinates
    const worldX = (clickX / minimapSize) * worldSize
    const worldY = (clickY / minimapSize) * worldSize

    onMinimapClick(worldX, worldY)
  }

  return (
      <div className="absolute top-4 right-4 rounded-lg border-2 border-border/50 bg-card/95 backdrop-blur p-2 shadow-lg">
        <canvas
            ref={minimapRef}
            width={minimapSize}
            height={minimapSize}
            className="rounded cursor-pointer"
            onClick={handleMinimapClick}
        />
        <p className="text-[10px] text-center text-muted-foreground mt-1">
          Minimap
        </p>
      </div>
  )
}

const MapCanvas = ({
                     villages,
                     selectedVillage,
                     onVillageClick,
                   }: {
  villages: Village[]
  selectedVillage: Village | null
  onVillageClick: (village: Village | null) => void
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredVillage, setHoveredVillage] = useState<Village | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  // --- DÜZELTME: dragStart state'i artık 4 değer tutuyor ---
  const [dragStart, setDragStart] = useState({
    mouseX: 0,
    mouseY: 0,
    offsetX: 0,
    offsetY: 0,
  })

  const [terrainFeatures] = useState(() => {
    const features: Array<{
      type: "tree" | "rock" | "grass" | "bush" | "flower" | "mountain"
      x: number
      y: number
      size: number
      variant: number
    }> = []
    for (let i = 0; i < 2000; i++) {
      const rand = Math.random()
      const type =
          rand < 0.25
              ? "tree"
              : rand < 0.35
                  ? "rock"
                  : rand < 0.5
                      ? "grass"
                      : rand < 0.65
                          ? "bush"
                          : rand < 0.75
                              ? "flower"
                              : "mountain"
      features.push({
        type,
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        size:
            type === "tree"
                ? 12 + Math.random() * 18
                : type === "rock"
                    ? 6 + Math.random() * 12
                    : type === "bush"
                        ? 5 + Math.random() * 10
                        : type === "mountain"
                            ? 20 + Math.random() * 40
                            : 3 + Math.random() * 5,
        variant: Math.floor(Math.random() * 3),
      })
    }
    return features
  })

  const GRID_SIZE = 40
  const WORLD_SIZE = 1000

  // --- YENİ FONKSİYON: Tıklama koordinatlarını ölçeklendirmek için ---
  const getScaledCoords = (
      e: React.MouseEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    // (İçsel Çözünürlük / Görünen CSS Boyutu)
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    // (Tıklama - Canvas Sol Kenarı) * Ölçek
    const canvasX = (e.clientX - rect.left) * scaleX
    const canvasY = (e.clientY - rect.top) * scaleY

    return { x: canvasX, y: canvasY }
  }

  // getVillageHitboxRadius fonksiyonunu useEffect'ten önce tanımla
  // (Çünkü useEffect içinde ve event handler'larda kullanılıyor)
  const getVillageHitboxRadius = (score: number): number => {
    const baseSize = 35
    let wallRadius = baseSize * 0.6
    let wallThickness = 4 // Calculate wallThickness for accurate hitbox

    if (score >= 800) {
      wallRadius = Math.min(baseSize * 0.85, 18)
      wallThickness = 12
    } else if (score >= 600) {
      wallRadius = Math.min(baseSize * 0.75, 18)
      wallThickness = 10
    } else if (score >= 400) {
      wallRadius = Math.min(baseSize * 0.68, 18)
      wallThickness = 8
    } else if (score >= 200) {
      wallRadius = Math.min(baseSize * 0.62, 18)
      wallThickness = 6
    } else {
      wallRadius = Math.min(baseSize * 0.58, 18)
      wallThickness = 4
    }

    // Hitbox'ı biraz daha cömert yap
    return wallRadius + wallThickness / 2 + 8
  }


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const playerVillage = villages.find((v) => v.isPlayer)
    if (playerVillage && offset.x === 0 && offset.y === 0) {
      const width = canvas.width
      const height = canvas.height
      setOffset({
        x: width / 2 - playerVillage.x * GRID_SIZE - GRID_SIZE / 2,
        y: height / 2 - playerVillage.y * GRID_SIZE - GRID_SIZE / 2,
      })
    }
  }, [villages, offset.x, offset.y]) // Bağımlılıklara GRID_SIZE eklendi

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width
    )
    gradient.addColorStop(0, "#5a7a51")
    gradient.addColorStop(0.3, "#4a6a41")
    gradient.addColorStop(0.6, "#3a5a31")
    gradient.addColorStop(1, "#2a4a21")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Grass texture with more variety
    ctx.globalAlpha = 0.15
    for (let i = 0; i < 800; i++) {
      const x = (i * 137 + offset.x * 0.05) % width
      const y = (i * 211 + offset.y * 0.05) % height
      const size = 1 + (i % 6)
      const colorVariant = i % 6
      ctx.fillStyle =
          colorVariant === 0
              ? "#6a8a61"
              : colorVariant === 1
                  ? "#5a7a51"
                  : colorVariant === 2
                      ? "#4a6a41"
                      : colorVariant === 3
                          ? "#7a9a71"
                          : colorVariant === 4
                              ? "#5a8a51"
                              : "#6a7a61"
      ctx.fillRect(x, y, size, size)
    }
    ctx.globalAlpha = 1

    terrainFeatures.forEach((feature) => {
      if (
          feature.x < 0 ||
          feature.x > WORLD_SIZE ||
          feature.y < 0 ||
          feature.y > WORLD_SIZE
      )
        return

      const screenX = feature.x * GRID_SIZE + offset.x
      const screenY = feature.y * GRID_SIZE + offset.y

      if (
          screenX < -100 ||
          screenX > width + 100 ||
          screenY < -100 ||
          screenY > height + 100
      )
        return

      const size = feature.size

      if (feature.type === "tree") {
        // Tree trunk
        ctx.fillStyle =
            feature.variant === 0
                ? "#5d4037"
                : feature.variant === 1
                    ? "#6d5047"
                    : "#4d3027"
        ctx.fillRect(
            screenX - size * 0.12,
            screenY - size * 0.15,
            size * 0.24,
            size * 0.45
        )

        // Tree foliage - multiple layers
        const foliageColors = ["#2d5016", "#3d6026", "#1d4006"]
        ctx.fillStyle = foliageColors[feature.variant]
        ctx.beginPath()
        ctx.arc(screenX, screenY - size * 0.35, size * 0.55, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#3d6026"
        ctx.beginPath()
        ctx.arc(
            screenX - size * 0.25,
            screenY - size * 0.25,
            size * 0.4,
            0,
            Math.PI * 2
        )
        ctx.fill()
        ctx.beginPath()
        ctx.arc(
            screenX + size * 0.25,
            screenY - size * 0.25,
            size * 0.4,
            0,
            Math.PI * 2
        )
        ctx.fill()

        ctx.fillStyle = "#4d7036"
        ctx.beginPath()
        ctx.arc(screenX, screenY - size * 0.5, size * 0.35, 0, Math.PI * 2)
        ctx.fill()
      } else if (feature.type === "rock") {
        const rockColors = ["#7d7d7d", "#8d8d8d", "#6d6d6d"]
        ctx.fillStyle = rockColors[feature.variant]
        ctx.beginPath()
        ctx.ellipse(screenX, screenY, size * 0.7, size * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#6d6d6d"
        ctx.beginPath()
        ctx.ellipse(
            screenX - size * 0.25,
            screenY,
            size * 0.35,
            size * 0.28,
            0,
            0,
            Math.PI * 2
        )
        ctx.fill()

        ctx.fillStyle = "#5d5d5d"
        ctx.beginPath()
        ctx.ellipse(
            screenX + size * 0.2,
            screenY + size * 0.15,
            size * 0.3,
            size * 0.22,
            0,
            0,
            Math.PI * 2
        )
        ctx.fill()
      } else if (feature.type === "bush") {
        const bushColors = ["#4a7a41", "#5a8a51", "#3a6a31"]
        ctx.fillStyle = bushColors[feature.variant]
        ctx.beginPath()
        ctx.arc(screenX, screenY, size * 0.45, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#5a8a51"
        ctx.beginPath()
        ctx.arc(screenX - size * 0.25, screenY, size * 0.35, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(screenX + size * 0.25, screenY, size * 0.35, 0, Math.PI * 2)
        ctx.fill()
      } else if (feature.type === "flower") {
        // Small colorful flowers
        const flowerColors = ["#ff6b9d", "#ffd93d", "#6bcf7f"]
        ctx.fillStyle = flowerColors[feature.variant]
        ctx.beginPath()
        ctx.arc(screenX, screenY, size * 0.4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#fbbf24"
        ctx.beginPath()
        ctx.arc(screenX, screenY, size * 0.15, 0, Math.PI * 2)
        ctx.fill()
      } else if (feature.type === "mountain") {
        const mountainColors = ["#6d5a47", "#7d6a57", "#5d4a37"]
        ctx.fillStyle = mountainColors[feature.variant]

        // Mountain shape - triangle
        ctx.beginPath()
        ctx.moveTo(screenX, screenY - size * 0.6)
        ctx.lineTo(screenX - size * 0.5, screenY + size * 0.2)
        ctx.lineTo(screenX + size * 0.5, screenY + size * 0.2)
        ctx.closePath()
        ctx.fill()

        // Mountain shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
        ctx.beginPath()
        ctx.moveTo(screenX, screenY - size * 0.6)
        ctx.lineTo(screenX + size * 0.5, screenY + size * 0.2)
        ctx.lineTo(screenX, screenY + size * 0.2)
        ctx.closePath()
        ctx.fill()

        // Snow cap for larger mountains
        if (size > 40) {
          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.moveTo(screenX, screenY - size * 0.6)
          ctx.lineTo(screenX - size * 0.15, screenY - size * 0.35)
          ctx.lineTo(screenX + size * 0.15, screenY - size * 0.35)
          ctx.closePath()
          ctx.fill()
        }
      } else {
        ctx.fillStyle = "#5a8a51"
        ctx.fillRect(screenX, screenY, size * 0.25, size * 0.25)
      }
    })

    ctx.strokeStyle = "rgba(139, 92, 46, 0.12)"
    ctx.lineWidth = 1

    const startX = Math.floor(-offset.x / GRID_SIZE)
    const startY = Math.floor(-offset.y / GRID_SIZE)
    const endX = startX + Math.ceil(width / GRID_SIZE) + 1
    const endY = startY + Math.ceil(height / GRID_SIZE) + 1

    for (let x = startX; x < endX; x++) {
      const screenX = x * GRID_SIZE + offset.x
      if (screenX >= 0 && screenX <= width) {
        ctx.beginPath()
        ctx.moveTo(screenX, 0)
        ctx.lineTo(screenX, height)
        ctx.stroke()

        if (x % 5 === 0) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.font = "11px monospace"
          ctx.textAlign = "center"
          ctx.fillText(`${x}`, screenX, 15)
        }
      }
    }

    for (let y = startY; y < endY; y++) {
      const screenY = y * GRID_SIZE + offset.y
      if (screenY >= 0 && screenY <= height) {
        ctx.beginPath()
        ctx.moveTo(0, screenY)
        ctx.lineTo(width, screenY)
        ctx.stroke()

        if (y % 5 === 0) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.font = "11px monospace"
          ctx.textAlign = "right"
          ctx.fillText(`${y}`, 35, screenY + 4)
        }
      }
    }

    // Draw villages
    villages.forEach((village) => {
      const screenX = village.x * GRID_SIZE + GRID_SIZE / 2 + offset.x
      const screenY = village.y * GRID_SIZE + GRID_SIZE / 2 + offset.y

      if (
          screenX < -GRID_SIZE * 2 ||
          screenX > width + GRID_SIZE * 2 ||
          screenY < -GRID_SIZE * 2 ||
          screenY > height + GRID_SIZE * 2
      ) {
        return
      }

      const isSelected = selectedVillage?.id === village.id
      const isHovered = hoveredVillage?.id === village.id

      drawVillage(
          ctx,
          screenX,
          screenY,
          village.score,
          village.isPlayer,
          isSelected,
          isHovered
      )

      // Village name
      ctx.fillStyle = "white"
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "center"
      ctx.strokeStyle = "rgba(0, 0, 0, 0.9)"
      ctx.lineWidth = 3
      ctx.strokeText(village.name, screenX, screenY + 42)
      ctx.fillText(village.name, screenX, screenY + 42)

      // Enemy marker
      if (!village.isPlayer) {
        ctx.fillStyle = "#ef4444"
        ctx.beginPath()
        ctx.arc(screenX + 28, screenY - 28, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#7f1d1d"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })
  }, [
    villages,
    selectedVillage,
    hoveredVillage,
    offset,
    terrainFeatures,
    GRID_SIZE,
    WORLD_SIZE,
  ]) // GRID_SIZE ve WORLD_SIZE bağımlılıkları eklendi

  // --- DÜZELTME: handleMouseDown artık ölçeklenmiş koordinatları ve offset'i saklıyor ---
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x: scaledX, y: scaledY } = getScaledCoords(e)
    setIsDragging(true)
    setDragStart({
      mouseX: scaledX,
      mouseY: scaledY,
      offsetX: offset.x,
      offsetY: offset.y,
    })
  }

  // --- DÜZELTME: handleMouseMove ölçeklenmiş koordinatları kullanıyor ---
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x: scaledX, y: scaledY } = getScaledCoords(e)

    if (isDragging) {
      // Sürükleme deltasını (farkını) ölçeklenmiş koordinatlara göre hesapla
      const deltaX = scaledX - dragStart.mouseX
      const deltaY = scaledY - dragStart.mouseY

      // Deltayı, sürüklemeye başladığın andaki offset'e ekle
      setOffset({
        x: dragStart.offsetX + deltaX,
        y: dragStart.offsetY + deltaY,
      })
    } else {
      // Hover (üzerine gelme) mantığı
      const hoveredVillage = villages.find((v) => {
        const screenX = v.x * GRID_SIZE + GRID_SIZE / 2 + offset.x
        const screenY = v.y * GRID_SIZE + GRID_SIZE / 2 + offset.y
        const hitboxRadius = getVillageHitboxRadius(v.score)

        // Ölçeklenmiş fare koordinatlarını (scaledX) canvas koordinatlarıyla (screenX) karşılaştır
        const dx = scaledX - screenX
        const dy = scaledY - screenY
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance < hitboxRadius
      })

      setHoveredVillage(hoveredVillage || null)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // --- DÜZELTME: handleClick ölçeklenmiş koordinatları kullanıyor ---
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x: scaledX, y: scaledY } = getScaledCoords(e)

    // Sürükleme sonrası tıklamayı engellemek için küçük bir mesafe kontrolü
    const dx_drag = scaledX - dragStart.mouseX
    const dy_drag = scaledY - dragStart.mouseY
    const dragDistance = Math.sqrt(dx_drag * dx_drag + dy_drag * dy_drag)

    // Eğer fare 5 pikselden fazla kaydıysa, bunu bir tıklama olarak sayma
    if (dragDistance > 5 && isDragging) {
      return
    }

    // Tıklama mantığı
    const clickedVillage = villages.find((v) => {
      const screenX = v.x * GRID_SIZE + GRID_SIZE / 2 + offset.x
      const screenY = v.y * GRID_SIZE + GRID_SIZE / 2 + offset.y
      const hitboxRadius = getVillageHitboxRadius(v.score)

      // Ölçeklenmiş fare koordinatlarını (scaledX) canvas koordinatlarıyla (screenX) karşılaştır
      const dx = scaledX - screenX
      const dy = scaledY - screenY
      const distance = Math.sqrt(dx * dx + dy * dy)

      return distance < hitboxRadius
    })

    if (clickedVillage) {
      onVillageClick(clickedVillage)
    } else {
      onVillageClick(null)
    }
  }

  const handleMinimapClick = (worldX: number, worldY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.width
    const height = canvas.height

    // Center the clicked position
    setOffset({
      x: width / 2 - worldX * GRID_SIZE,
      y: height / 2 - worldY * GRID_SIZE,
    })
  }

  // Bu fonksiyonu yukarı taşıdık (useEffect'ten önceye)
  // const getVillageHitboxRadius = ...

  return (
      <div className="relative">
        <canvas
            ref={canvasRef}
            width={1000}
            height={800}
            // h-full ve w-full'u aspect-square ile değiştirdim,
            // çünkü 1000x800 bir kare (square) değil.
            // w-full ve h-auto (veya aspect ratio) daha mantıklı olabilir.
            // Orijinal kodda w-full h-full vardı, ancak konteyneri aspect-square idi.
            // Konteynerin (parent) stilini baz alarak w-full h-full bırakıyorum.
            className="w-full h-full rounded-lg cursor-move border border-border/50"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setIsDragging(false)
              setHoveredVillage(null)
            }}
            onClick={handleClick}
        />

        <Minimap
            villages={villages}
            offset={offset}
            canvasWidth={1000}
            canvasHeight={800}
            gridSize={GRID_SIZE}
            worldSize={WORLD_SIZE}
            onMinimapClick={handleMinimapClick}
        />

        {hoveredVillage && !isDragging && (
            <div
                className="absolute bg-card/95 backdrop-blur border border-border/50 rounded-lg px-3 py-2 pointer-events-none"
                style={{
                  left: "50%",
                  top: "20px",
                  transform: "translateX(-50%)",
                }}
            >
              <p className="text-sm font-semibold text-foreground">
                {hoveredVillage.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {hoveredVillage.owner} • {hoveredVillage.score} puan
              </p>
            </div>
        )}
      </div>
  )
}

export default function MapPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const worldId = searchParams.get("world")
  const [user, setUser] = useState<string | null>(null)
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null)

  // villages state'ini useMemo içine aldım, 'user'a bağımlı hale getirdim.
  const villages: Village[] = useMemo(() => {
    const baseVillages: Omit<Village, "name" | "owner" | "isPlayer">[] = [
      {
        id: "1",
        score: 850,
        x: 50,
        y: 30,
        alliance: "Doğu İttifakı",
      },
      {
        id: "2",
        score: 720,
        x: 51,
        y: 30,
        alliance: "Doğu İttifakı",
      },
      { id: "3", score: 580, x: 30, y: 60 },
      { id: "4", score: 420, x: 31, y: 60 },
      { id: "5", score: 650, x: 20, y: 40, alliance: "Batı Birliği" },
      { id: "6", score: 490, x: 60, y: 80 },
      { id: "7", score: 380, x: 40, y: 20 },
      { id: "8", score: 290, x: 41, y: 20 },
      { id: "9", score: 180, x: 25, y: 75 },
      { id: "10", score: 120, x: 26, y: 75 },
      { id: "11", score: 550, x: 70, y: 50 },
      { id: "12", score: 780, x: 71, y: 50 },
      { id: "13", score: 340, x: 35, y: 45 },
      { id: "14", score: 620, x: 55, y: 65 },
      { id: "15", score: 450, x: 45, y: 35 },
    ]

    const allVillages: Village[] = baseVillages.map((v, i) => ({
      ...v,
      name: `Köy ${i + 1}`, // Generic name,
      owner: `Oyuncu ${i + 1}`, // Generic owner
      isPlayer: false,
    }))

    // Oyuncu köyünü ekle
    allVillages.push({
      id: "player",
      name: user ? `${user}'in Köyü` : "Benim Köyüm",
      owner: user || "Sen",
      score: 167,
      x: 50,
      y: 50,
      isPlayer: true,
    })

    return allVillages
  }, [user]) // Artık 'user' değiştiğinde villages listesi de güncellenecek

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
                <div className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold tracking-wider text-foreground">
                  SANCAKLAR
                </span>
                </div>
                <Badge variant="outline" className="text-foreground">
                  Harita
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/village?world=${worldId}`)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Köyüme Dön
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
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-border/50 bg-card/95 backdrop-blur">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">
                      Dünya Haritası
                    </h2>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        {villages.length} Köy
                      </Badge>
                    </div>
                  </div>

                  <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border/50">
                    <MapCanvas
                        villages={villages}
                        selectedVillage={selectedVillage}
                        onVillageClick={setSelectedVillage}
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {[
                      {
                        label: "Köy",
                        score: "0-199",
                        color: "from-gray-600 to-gray-800",
                      },
                      {
                        label: "Kasaba",
                        score: "200-399",
                        color: "from-green-600 to-green-700",
                      },
                      {
                        label: "Kale",
                        score: "400-599",
                        color: "from-blue-500 to-blue-600",
                      },
                      {
                        label: "Krallık",
                        score: "600-799",
                        color: "from-purple-500 to-purple-600",
                      },
                      {
                        label: "İmparatorluk",
                        score: "800-1000",
                        color: "from-yellow-500 to-orange-600",
                      },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-2 rounded-lg bg-muted/50 p-2"
                        >
                          <div
                              className={`h-4 w-4 rounded-full bg-gradient-to-br ${item.color}`}
                          />
                          <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">
                          {item.label}
                        </span>
                            <span className="text-[10px] text-muted-foreground">
                          {item.score}
                        </span>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-border/50 bg-card/95 backdrop-blur sticky top-24">
                <CardContent className="p-6">
                  {selectedVillage ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-foreground">
                              {selectedVillage.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Sahibi: {selectedVillage.owner}
                            </p>
                          </div>
                          {selectedVillage.isPlayer && (
                              <Badge
                                  variant="default"
                                  className="bg-primary text-primary-foreground"
                              >
                                Senin Köyün
                              </Badge>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-5 w-5 text-primary" />
                              <span className="text-sm font-semibold text-foreground">
                            Puan
                          </span>
                            </div>
                            <span className="text-lg font-bold text-primary">
                          {selectedVillage.score}
                        </span>
                          </div>

                          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                            <div className="flex items-center gap-2">
                              <Shield className="h-5 w-5 text-blue-500" />
                              <span className="text-sm font-semibold text-foreground">
                            Seviye
                          </span>
                            </div>
                            <span className="text-lg font-bold text-foreground">
                          {getVillageAppearance(selectedVillage.score).label}
                        </span>
                          </div>

                          {selectedVillage.alliance && (
                              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                <div className="flex items-center gap-2">
                                  <Users className="h-5 w-5 text-purple-500" />
                                  <span className="text-sm font-semibold text-foreground">
                              İttifak
                            </span>
                                </div>
                                <span className="text-sm font-bold text-foreground">
                            {selectedVillage.alliance}
                          </span>
                              </div>
                          )}

                          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                            <div className="flex items-center gap-2">
                              <Swords className="h-5 w-5 text-red-500" />
                              <span className="text-sm font-semibold text-foreground">
                            Konum
                          </span>
                            </div>
                            <span className="text-sm font-mono text-foreground">
                          {selectedVillage.x}|{selectedVillage.y}
                        </span>
                          </div>
                        </div>

                        {selectedVillage.isPlayer ? (
                            <Button
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                onClick={() =>
                                    router.push(`/village?world=${worldId}`)
                                }
                            >
                              Köyüme Git
                            </Button>
                        ) : (
                            <div className="space-y-2">
                              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                                <Swords className="h-4 w-4 mr-2" />
                                Saldır
                              </Button>
                              <Button
                                  variant="outline"
                                  className="w-full bg-transparent"
                              >
                                Mesaj Gönder
                              </Button>
                            </div>
                        )}
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Home className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Haritadan bir köy seçin
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Detayları görmek için köylere tıklayın
                        </p>
                      </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-6 border-border/50 bg-card/95 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                En Güçlü Köyler
              </h3>
              <div className="space-y-2">
                {villages
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10)
                    .map((village, index) => {
                      const appearance = getVillageAppearance(village.score)
                      return (
                          <div
                              key={village.id}
                              className={`flex items-center justify-between rounded-lg p-3 transition-colors cursor-pointer ${
                                  village.isPlayer
                                      ? "bg-primary/10 border border-primary/30"
                                      : "bg-muted/50 hover:bg-muted/70"
                              }`}
                              onClick={() => setSelectedVillage(village)}
                          >
                            <div className="flex items-center gap-3">
                        <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                                index === 0
                                    ? "bg-yellow-500 text-yellow-950"
                                    : index === 1
                                        ? "bg-gray-400 text-gray-900"
                                        : index === 2
                                            ? "bg-amber-600 text-amber-950"
                                            : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {index + 1}
                        </span>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {village.name} {village.isPlayer && "★"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {village.owner}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-foreground">
                                {appearance.label}
                              </Badge>
                              <span className="text-lg font-bold text-primary">
                          {village.score}
                        </span>
                            </div>
                          </div>
                      )
                    })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
  )
}