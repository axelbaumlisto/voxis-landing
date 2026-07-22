import { Download, Star } from "lucide-react";
import Container from "./ui/Container";

export default function DownloadCta({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? { heading: "Готовы писать со скоростью мысли?", sub: "Бесплатно и с открытым исходным кодом.", dl: "Скачать Voxis", star: "Звезда на GitHub" }
    : { heading: "Ready to write at lightspeed?", sub: "Free and open source.", dl: "Download Voxis", star: "Star on GitHub" };

  return (
    <section className="w-full bg-black py-[var(--space-4xl)] relative z-10 border-t border-white/5">
      <Container width="prose" className="flex flex-col items-center text-center gap-[var(--space-lg)]">
        <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">{t.heading}</h2>
        <p className="text-[var(--color-muted-2)] text-lg">{t.sub}</p>
        <div className="flex flex-col sm:flex-row gap-[var(--space-sm)]">
          <a href="https://github.com/axelbaumlisto/voxis/releases" className="btn-base btn-primary">
            <Download className="w-5 h-5" /> {t.dl}
          </a>
          <a href="https://github.com/axelbaumlisto/voxis" className="btn-base btn-secondary">
            <Star className="w-5 h-5" /> {t.star}
          </a>
        </div>
      </Container>
    </section>
  );
}
