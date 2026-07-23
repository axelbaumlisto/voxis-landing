import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

export default function Faq({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? {
        heading: "Частые вопросы",
        items: [
          { q: "Куда уходит моё аудио?", a: "Напрямую в выбранный вами endpoint транскрипции (по умолчанию Groq). Voxis не проксирует и не хранит ваш звук на сторонних серверах." },
          { q: "Нужен ли API-ключ?", a: "Да. По умолчанию — бесплатный тариф Groq, либо любой OpenAI-совместимый или свой endpoint. Ключ хранится локально, ваше аудио не проходит через наши серверы." },
          { q: "Можно ли использовать свой сервер?", a: "Да. Любой OpenAI-совместимый Whisper endpoint — укажите свой URL в настройках." },
          { q: "Как настроить горячую клавишу?", a: "Запишите любую комбинацию. Режим «удержание» (запись пока клавиша нажата) или «тумблер» (нажал — начал, нажал — остановил, удобно для длинной диктовки). Можно привязать отдельные клавиши к разным действиям." },
          { q: "Какие языки поддерживаются?", a: "Автоопределение плюс 13 языков (русский, английский, немецкий, французский и др.) — плюс опция перевода на английский." },
          { q: "Какие ОС поддерживаются?", a: "Windows 10+, macOS 12+ (Apple Silicon) и современный Linux — единый движок на Tauri v2 + Rust." },
        ],
      }
    : {
        heading: "Frequently asked",
        items: [
          { q: "Where does my audio go?", a: "Straight to your chosen transcription endpoint (Groq by default). Voxis does not proxy or store your audio on third-party servers." },
          { q: "Do I need an API key?", a: "Yes — the free Groq tier by default, or any OpenAI-compatible / self-hosted endpoint. Your key is stored locally and your audio never passes through our servers." },
          { q: "Can I use my own server?", a: "Yes. Any OpenAI-compatible Whisper endpoint — just point it at your own URL in settings." },
          { q: "How do I set the hotkey?", a: "Record any combo. Choose Hold mode (record while the key is held) or Toggle mode (tap to start, tap to stop — handy for long dictation). You can also bind separate keys to different actions." },
          { q: "Which languages are supported?", a: "Auto-detect plus 13 languages (English, Russian, German, French and more) — with an optional translate-to-English mode." },
          { q: "Which OSes are supported?", a: "Windows 10+, macOS 12+ (Apple Silicon), and modern Linux — one Tauri v2 + Rust engine." },
        ],
      };

  return (
    <section className="section bg-black relative z-10 border-t border-white/5">
      <Container width="content">
        <SectionHeading title={t.heading} />
        <div className="flex flex-col gap-[var(--space-md)]">
          {t.items.map((it, i) => (
            <details key={i} className="group rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.02] p-[var(--space-lg)] open:border-[var(--color-accent)]/30">
              <summary className="text-lg font-bold text-white cursor-pointer list-none flex items-center justify-between gap-[var(--space-md)] marker:hidden">
                <span>{it.q}</span>
                <span className="text-[var(--color-accent)] text-2xl font-light transition-transform duration-300 ease-out group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="text-zinc-400 leading-relaxed mt-[var(--space-sm)]">{it.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
