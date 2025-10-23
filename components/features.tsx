import { Card } from "@/components/ui/card"
import { Swords, Castle, Users, Map, Trophy, Shield } from "lucide-react"

const features = [
  {
    icon: Castle,
    title: "Krallığını Kur",
    description: "Kendi krallığını inşa et, şehirlerini geliştir ve ekonomini güçlendir.",
  },
  {
    icon: Swords,
    title: "Stratejik Savaşlar",
    description: "Ordunu yönet, taktikler geliştir ve düşmanlarını yenilgiye uğrat.",
  },
  {
    icon: Users,
    title: "İttifaklar",
    description: "Diğer oyuncularla ittifak kur ve birlikte büyük savaşlara katıl.",
  },
  {
    icon: Map,
    title: "Geniş Harita",
    description: "Orta Çağ Anadolu'sunu keşfet, toprakları fethet ve imparatorluğunu genişlet.",
  },
  {
    icon: Trophy,
    title: "Turnuvalar",
    description: "Haftalık turnuvalara katıl, en iyi stratejist ol ve ödüller kazan.",
  },
  {
    icon: Shield,
    title: "Savunma Sistemi",
    description: "Kaleni güçlendir, surlar inşa et ve krallığını düşman saldırılarından koru.",
  },
]

export function Features() {
  return (
    <section id="ozellikler" className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Oyun Özellikleri
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Sancaklar, gerçek bir Orta Çağ deneyimi sunmak için tasarlanmış zengin özelliklerle dolu.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">{feature.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
