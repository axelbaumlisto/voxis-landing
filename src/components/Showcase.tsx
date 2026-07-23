import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

export default function Showcase({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? {
        heading: "Voxis в действии",
        sub: "Оверлей поверх любого приложения",
        overlay: "Оверлей записи",
        history: "История транскрипций",
        settings: "Настройки",
        dictionary: "Словарь",
      }
    : {
        heading: "Voxis in action",
        sub: "An overlay on top of any app",
        overlay: "Recording overlay",
        history: "Transcription history",
        settings: "Settings",
        dictionary: "Dictionary",
      };

  // Real app screenshots (public/screenshots/*.png). All are ~16:9 so
  // object-cover fills the aspect-video tile with no distortion.
  const shots = [
    { src: "/screenshots/overlay-theme.png", cap: t.overlay, alt: isRu ? "Оверлей записи Voxis" : "Voxis recording overlay" },
    { src: "/screenshots/history.png", cap: t.history, alt: isRu ? "История транскрипций Voxis" : "Voxis transcription history" },
    { src: "/screenshots/settings.png", cap: t.settings, alt: isRu ? "Настройки Voxis" : "Voxis settings" },
    { src: "/screenshots/dictionary.png", cap: t.dictionary, alt: isRu ? "Словарь замен Voxis" : "Voxis replacement dictionary" },
  ];

  return (
    <section className="section bg-black relative z-10 border-t border-white/5">
      <Container width="page">
        <SectionHeading title={t.heading} subtitle={t.sub} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)]">
          {shots.map((shot) => (
            <figure
              key={shot.src}
              className="rounded-[var(--glass-radius)] border border-white/10 overflow-hidden bg-white/[0.02]"
            >
              <div className="aspect-video bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  alt={shot.alt}
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="p-[var(--space-sm)] text-center text-sm text-zinc-400">
                {shot.cap}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
