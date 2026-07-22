import Container from "./ui/Container";

export default function Faq({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? {
        heading: "Частые вопросы",
        items: [
          { q: "Куда уходит моё аудио?", a: "Напрямую в выбранный вами endpoint транскрипции (по умолчанию Groq). Voxis не проксирует и не хранит ваш звук на сторонних серверах." },
          { q: "Можно ли использовать свой сервер?", a: "Да. Любой OpenAI-совместимый Whisper endpoint через api_url_override в настройках." },
          { q: "Как настроить горячую клавишу?", a: "В настройках приложения — записываете любую комбинацию, удержание запускает запись, отпускание завершает." },
          { q: "Какие ОС поддерживаются?", a: "Windows, macOS и Linux — единый движок на Tauri v2 + Rust." },
        ],
      }
    : {
        heading: "Frequently asked",
        items: [
          { q: "Where does my audio go?", a: "Straight to your chosen transcription endpoint (Groq by default). Voxis does not proxy or store your audio on third-party servers." },
          { q: "Can I use my own server?", a: "Yes. Any OpenAI-compatible Whisper endpoint via api_url_override in settings." },
          { q: "How do I set the hotkey?", a: "In the app settings — record any combo; hold to start capture, release to finish." },
          { q: "Which OSes are supported?", a: "Windows, macOS, and Linux — one Tauri v2 + Rust engine." },
        ],
      };

  return (
    <section className="w-full bg-black py-[var(--space-4xl)] relative z-10 border-t border-white/5">
      <Container width="content">
        <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white text-center mb-[var(--space-2xl)]">{t.heading}</h2>
        <div className="flex flex-col gap-[var(--space-md)]">
          {t.items.map((it, i) => (
            <div key={i} className="rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.02] p-[var(--space-lg)]">
              <h3 className="text-lg font-bold text-white mb-[var(--space-2xs)]">{it.q}</h3>
              <p className="text-zinc-400 leading-relaxed">{it.a}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
