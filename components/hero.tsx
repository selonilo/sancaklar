import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/medieval-battlefield-with-banners-and-castles-at-s.jpg"
          alt="Medieval battlefield"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
          <Crown className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Yeni Sezon Başladı</span>
        </div>

        <h1 className="mb-6 max-w-5xl text-balance text-6xl font-bold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
          SANCAĞINI
          <br />
          <span className="text-primary">DALGALANDIR</span>
        </h1>

        <p className="mb-12 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Orta Çağ'ın en büyük strateji oyununda krallığını kur, ordunu yönet ve düşmanlarını yenilgiye uğrat. Sancağın
          altında zafer seni bekliyor.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/auth/login">
            <Button
              size="lg"
              className="h-14 bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Ücretsiz Başla
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-14 border-border px-8 text-lg font-semibold bg-transparent">
            Oynanışı İzle
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-border/40 pt-12 md:gap-16">
          <div className="flex flex-col items-center">
            <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">500K+</div>
            <div className="text-sm text-muted-foreground md:text-base">Aktif Oyuncu</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">50+</div>
            <div className="text-sm text-muted-foreground md:text-base">Krallık</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">1M+</div>
            <div className="text-sm text-muted-foreground md:text-base">Savaş</div>
          </div>
        </div>
      </div>
    </section>
  )
}
