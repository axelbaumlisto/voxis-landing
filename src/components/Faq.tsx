import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

export default function Faq({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? {
        heading: "Частые вопросы",
        items: [
          { q: "Куда уходит моё аудио?", a: "Напрямую в выбранный вами endpoint транскрипции: Groq по умолчанию или ваш self-hosted/OpenAI-compatible сервер. Voxis не проксирует, не получает и не хранит звук; история и словарь остаются локально." },
          { q: "Нужен ли API-ключ?", a: "Да. По умолчанию — бесплатный тариф Groq, либо любой OpenAI-совместимый или свой endpoint. Ключ хранится локально, аудио идёт напрямую к выбранному провайдеру." },
          { q: "Можно ли использовать свой сервер или полностью локальный Whisper?", a: "Да, если он говорит по OpenAI-compatible /v1/audio/transcriptions API. Укажите свой URL в настройках; для локального self-hosted варианта смотрите документацию по Speaches/faster-whisper." },
          { q: "Voxis бесплатный?", a: "Да, приложение MIT/open source. Стоимость транскрипции зависит от выбранного провайдера: бесплатный тариф Groq, ваш OpenAI-compatible endpoint или собственный сервер." },
          { q: "Сборки подписаны?", a: "Ранние сборки могут показывать предупреждения macOS Gatekeeper или Windows SmartScreen, пока подпись и notarization финализируются. Для проверки используйте GitHub Releases или собирайте из исходников." },
          { q: "Что хранится локально?", a: "Настройки, история, словарь замен, подсказки обучения и временные retry-файлы для неудачных записей. Всё находится в системной config-директории приложения." },
          { q: "Voxis заменяет мой буфер обмена?", a: "Обычно текст печатается напрямую в активное окно. Если используется clipboard fallback, Voxis вставляет текст и восстанавливает прежнее содержимое буфера." },
          { q: "Как настроить горячую клавишу?", a: "Запишите любую комбинацию. Режим «удержание» (запись пока клавиша нажата) или «тумблер» (нажал — начал, нажал — остановил, удобно для длинной диктовки). Можно привязать отдельные клавиши к разным действиям." },
          { q: "Какие языки поддерживаются?", a: "Автоопределение плюс 13 языков (русский, английский, немецкий, французский и др.) — плюс опция перевода на английский." },
          { q: "Какие ОС поддерживаются?", a: "Windows 10+, macOS 12+ (Apple Silicon) и современный Linux — единый движок на Tauri v2 + Rust." },
        ],
      }
    : {
        heading: "Frequently asked",
        items: [
          { q: "Where does my audio go?", a: "Straight to your chosen transcription endpoint: Groq by default, or your self-hosted/OpenAI-compatible server. Voxis never receives, proxies, or stores your audio; history and dictionary stay local." },
          { q: "Do I need an API key?", a: "Yes — the free Groq tier by default, or any OpenAI-compatible / self-hosted endpoint. Your key is stored locally and audio goes directly to the provider you choose." },
          { q: "Can I use my own server or local Whisper?", a: "Yes, if it exposes an OpenAI-compatible /v1/audio/transcriptions API. Point Voxis at your URL in settings; see the self-hosted Speaches/faster-whisper docs for a local option." },
          { q: "Is Voxis free?", a: "Yes, the app is MIT/open source. Transcription costs depend on the provider you choose: Groq's free tier, your OpenAI-compatible endpoint, or your own server." },
          { q: "Are downloads signed?", a: "Early builds may show macOS Gatekeeper or Windows SmartScreen warnings while signing and notarization are finalized. Verify downloads from GitHub Releases or build from source." },
          { q: "What is stored locally?", a: "Settings, history, replacement dictionary, learning suggestions, and temporary retry files for failed recordings. They live in the app's system config directory." },
          { q: "Does Voxis replace my clipboard?", a: "Usually Voxis types directly into the focused app. If clipboard fallback is used, it pastes the final text and restores your previous clipboard contents." },
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
