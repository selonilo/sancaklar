import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const modes = [
  {
    title: "Kampanya Modu",
    description: "Tarihi olayları yeniden yaşa ve Orta Çağ Anadolu'sunda kendi hikayeni yaz.",
    image: "/medieval-campaign-map-with-armies.jpg",
    badge: "Tek Oyunculu",
  },
  {
    title: "Çok Oyunculu",
    description: "Binlerce oyuncuyla aynı dünyada savaş, ittifaklar kur ve hakimiyeti ele geçir.",
    image: "/medieval-multiplayer-battle-scene.jpg",
    badge: "Çevrimiçi",
  },
  {
    title: "Turnuva Modu",
    description: "Haftalık turnuvalarda en iyi stratejistlerle yarış ve büyük ödüller kazan.",
    image: "/medieval-tournament-arena.jpg",
    badge: "Rekabetçi",
  },
]

export function GameModes() {
  return (
    <section id="modlar" className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Oyun Modları
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Her oyun tarzına uygun farklı modlarla dolu bir deneyim.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {modes.map((mode, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-border bg-card transition-all hover:border-primary/50"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={mode.image || "/placeholder.svg"}
                  alt={mode.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                    {mode.badge}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-2xl font-bold text-card-foreground">{mode.title}</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">{mode.description}</p>
                <Button
                  variant="outline"
                  className="w-full border-border hover:border-primary hover:bg-primary/10 bg-transparent"
                >
                  Daha Fazla Bilgi
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
