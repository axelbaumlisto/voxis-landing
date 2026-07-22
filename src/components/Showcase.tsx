import Container from "./ui/Container";

export default function Showcase({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? { heading: "Voxis в действии", sub: "Оверлей поверх любого приложения", cap1: "Оверлей записи", cap2: "История транскрипций", cap3: "Настройки и словарь" }
    : { heading: "Voxis in action", sub: "An overlay on top of any app", cap1: "Recording overlay", cap2: "Transcription history", cap3: "Settings & dictionary" };

  const shots = [t.cap1, t.cap2, t.cap3];

  return (
    <section className="section bg-black relative z-10 border-t border-white/5">
      <Container width="page">
        <div className="text-center mb-[var(--space-2xl)]">
          <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">{t.heading}</h2>
          <p className="text-[var(--color-muted-2)] mt-[var(--space-sm)] text-lg">{t.sub}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-md)]">
          {shots.map((cap, i) => (
            <figure key={i} className="rounded-[var(--glass-radius)] border border-white/10 overflow-hidden bg-white/[0.02]">
              {/* TODO(owner): replace with <img src="/screenshots/xxx.png" .../> */}
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-cyan-950/30 to-black text-zinc-600 text-xs font-mono">
                screenshot: {cap}
              </div>
              <figcaption className="p-[var(--space-sm)] text-center text-sm text-zinc-400">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
