import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { GameModes } from "@/components/game-modes"
import { CallToAction } from "@/components/call-to-action"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Features />
      <GameModes />
      <CallToAction />
    </main>
  )
}
