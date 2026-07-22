import { ImageIcon } from "lucide-react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

export default function Showcase({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? { heading: "Voxis в действии", sub: "Оверлей поверх любого приложения", cap1: "Оверлей записи", cap2: "История транскрипций", cap3: "Настройки и словарь" }
    : { heading: "Voxis in action", sub: "An overlay on top of any app", cap1: "Recording overlay", cap2: "Transcription history", cap3: "Settings & dictionary" };

  const shots = [t.cap1, t.cap2, t.cap3];

  return (
    <section className="section bg-black relative z-10 border-t border-white/5">
      <Container width="page">
        <SectionHeading title={t.heading} subtitle={t.sub} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-md)]">
          {shots.map((cap, i) => (
            <figure key={i} className="rounded-[var(--glass-radius)] border border-white/10 overflow-hidden bg-white/[0.02]">
              {/* TODO(owner): replace with <img src="/screenshots/xxx.png" .../> */}
              <div className="aspect-video grid place-items-center bg-gradient-to-br from-[var(--color-surface)] to-black">
                <ImageIcon className="w-8 h-8 text-zinc-700" aria-hidden />
              </div>
              <figcaption className="p-[var(--space-sm)] text-center text-sm text-zinc-400">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
