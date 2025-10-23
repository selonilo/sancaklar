import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import Link from "next/link"

export function CallToAction() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <div className="absolute inset-0 opacity-10">
            <img
              src="/medieval-banners-and-flags-pattern.jpg"
              alt="Background pattern"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative z-10 px-8 py-20 text-center md:px-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Ücretsiz Oyna</span>
            </div>

            <h2 className="mb-6 text-balance text-4xl font-bold tracking-tight text-card-foreground md:text-5xl lg:text-6xl">
              Sancağını Dalgalandırmanın
              <br />
              <span className="text-primary">Zamanı Geldi</span>
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Hemen kaydol ve Orta Çağ'ın en büyük strateji oyununda yerini al. İlk 1000 oyuncuya özel başlangıç paketi
              hediye!
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="h-14 bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Hemen Başla
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-border px-8 text-lg font-semibold bg-transparent"
              >
                Discord'a Katıl
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/40 pt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-wider text-foreground">SANCAKLAR</span>
            </div>

            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">
                Gizlilik
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                Şartlar
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                Destek
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                İletişim
              </a>
            </div>

            <p className="text-sm text-muted-foreground">© 2025 Sancaklar. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </section>
  )
}
