import { Button } from "@/components/ui/button"
import { Sword, Menu } from "lucide-react"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Sword className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-wider text-foreground">SANCAKLAR</span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#oyun"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Oyun
          </a>
          <a
            href="#ozellikler"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Özellikler
          </a>
          <a
            href="#modlar"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Oyun Modları
          </a>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Şimdi Oyna
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  )
}
