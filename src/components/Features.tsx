import { Shield, Zap, HardDrive, Plug, Palette, MonitorSmartphone, Sparkles, BookText, AudioLines, Type } from "lucide-react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

const ICONS = { Shield, Zap, HardDrive, Plug, Palette, MonitorSmartphone, Sparkles, BookText, AudioLines, Type };

export default function Features({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? {
        heading: "Почему Voxis",
        sub: "Приватность, скорость и полный контроль",
        items: [
          { icon: "Shield", title: "Приватность", desc: "Аудио идёт напрямую в выбранный вами endpoint. Никаких посредников, никакой телеметрии." },
          { icon: "Zap", title: "Молниеносно", desc: "Whisper-API от Groq возвращает текст за миллисекунды. Диктовка без задержек." },
          { icon: "HardDrive", title: "Локальный словарь", desc: "Свой словарь замен и обучение прямо на устройстве — без облака." },
          { icon: "Plug", title: "Любой endpoint", desc: "Groq по умолчанию, либо любой OpenAI-совместимый или свой сервер." },
          { icon: "Palette", title: "Темы", desc: "Оверлей полностью кастомизируется — темы редактируются без пересборки." },
          { icon: "MonitorSmartphone", title: "Кроссплатформенность", desc: "Windows, macOS, Linux — единый Tauri + Rust движок." },
        ],
        powerHeading: "Больше, чем просто диктовка",
        powerItems: [
          { icon: "Sparkles", title: "AI-чистка (опционально)", desc: "LLM-постобработка правит грамматику и формат. Выбирайте модель и именованные промпт-шаблоны под разные задачи." },
          { icon: "BookText", title: "Словарь, который учится", desc: "Правила замен плюс обучение: предложения можно сначала просматривать или применять автоматически. Имена и термины всегда верные." },
          { icon: "AudioLines", title: "Умная детекция речи", desc: "Silero VAD отсекает тишину и фон, чтобы пустые записи никогда не уходили в API — быстрее и чище." },
          { icon: "Type", title: "Печатает где угодно", desc: "Автоввод в активное приложение, опциональный auto-enter/auto-submit и фоллбек через буфер с восстановлением." },
        ],
      }
    : {
        heading: "Why Voxis",
        sub: "Privacy, speed, and full control",
        items: [
          { icon: "Shield", title: "Private by default", desc: "Audio goes straight to your chosen endpoint. No middleman, no telemetry." },
          { icon: "Zap", title: "Blazing fast", desc: "Groq's Whisper API returns text in milliseconds. Dictation with no lag." },
          { icon: "HardDrive", title: "Local dictionary", desc: "Your own replacement dictionary and learning stay on-device — no cloud." },
          { icon: "Plug", title: "Any endpoint", desc: "Groq by default, or point it at any OpenAI-compatible or self-hosted endpoint." },
          { icon: "Palette", title: "Themeable", desc: "The overlay is fully customizable — themes edit live without a rebuild." },
          { icon: "MonitorSmartphone", title: "Cross-platform", desc: "Windows, macOS, Linux — one Tauri + Rust engine." },
        ],
        powerHeading: "More than just dictation",
        powerItems: [
          { icon: "Sparkles", title: "AI cleanup (optional)", desc: "An LLM post-processing pass fixes grammar and formatting. Pick a model and named prompt templates for different tasks." },
          { icon: "BookText", title: "A dictionary that learns", desc: "Replacement rules plus learning: review suggestions first, or apply them automatically. Names and jargon always land right." },
          { icon: "AudioLines", title: "Smart silence detection", desc: "Silero VAD gates out silence and background noise so empty clips never hit the API — faster and cleaner." },
          { icon: "Type", title: "Types anywhere", desc: "Auto-types into the focused app, with optional auto-enter/auto-submit and a clipboard fallback that restores what you had." },
        ],
      };

  return (
    <section className="section bg-black relative z-10 border-t border-white/5">
      <Container width="page">
        <SectionHeading title={t.heading} subtitle={t.sub} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-md)] items-stretch">
          {t.items.map((it, i) => {
            const Icon = ICONS[it.icon as keyof typeof ICONS];
            return (
              <div key={i} className="h-full rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.02] p-[var(--space-lg)] hover:border-[var(--color-accent)]/40 transition-colors duration-300">
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[var(--color-accent)] w-fit mb-[var(--space-md)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-[var(--space-2xs)]">{it.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{it.desc}</p>
              </div>
            );
          })}
        </div>

        <h3 className="text-center text-[var(--color-muted-2)] text-lg font-semibold mt-[var(--space-2xl)] mb-[var(--space-lg)]">
          {t.powerHeading}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)] items-stretch">
          {t.powerItems.map((it, i) => {
            const Icon = ICONS[it.icon as keyof typeof ICONS];
            return (
              <div key={i} className="h-full rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.02] p-[var(--space-lg)] hover:border-[var(--color-accent)]/40 transition-colors duration-300">
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[var(--color-accent)] w-fit mb-[var(--space-md)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white mb-[var(--space-2xs)]">{it.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{it.desc}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
