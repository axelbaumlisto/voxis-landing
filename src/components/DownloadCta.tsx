"use client";

import { useState } from "react";
import { Download, Star } from "lucide-react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";
import DownloadDialog from "./DownloadDialog";
import { REPO_URL } from "../lib/downloads";

export default function DownloadCta({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const [dlOpen, setDlOpen] = useState(false);
  const t = isRu
    ? { heading: "Готовы писать со скоростью мысли?", sub: "Бесплатно и с открытым исходным кодом.", dl: "Скачать Voxis", star: "Поставить звезду" }
    : { heading: "Ready to write at lightspeed?", sub: "Free and open source.", dl: "Download Voxis", star: "Star on GitHub" };

  return (
    <section className="section bg-black relative z-10 border-t border-white/5">
      <Container width="prose" className="flex flex-col items-center text-center gap-[var(--space-lg)]">
        <SectionHeading title={t.heading} subtitle={t.sub} className="mb-0" subtitleClassName="mt-[var(--space-sm)]" />
        <div className="flex flex-col sm:flex-row gap-[var(--space-sm)]">
          <button type="button" onClick={() => setDlOpen(true)} className="btn-base btn-primary">
            <Download className="w-5 h-5" /> {t.dl}
          </button>
          <a href={REPO_URL} className="btn-base btn-secondary">
            <Star className="w-5 h-5" /> {t.star}
          </a>
        </div>
      </Container>

      <DownloadDialog open={dlOpen} onClose={() => setDlOpen(false)} lang={lang} />
    </section>
  );
}
