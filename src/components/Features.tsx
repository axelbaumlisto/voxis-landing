import { Shield, Zap, HardDrive, Plug, Palette, MonitorSmartphone } from "lucide-react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

const ICONS = { Shield, Zap, HardDrive, Plug, Palette, MonitorSmartphone };

export default function Features({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? {
        heading: "Почему Voxis",
        sub: "Приватность, скорость и полный контроль",
        items: [
          { icon: "Shield", title: "Приватность", desc: "Аудио идёт напрямую в выбранный вами endpoint. Никаких посредников, никакой телеметрии." },
          { icon: "Zap", title: "Молниеносно", desc: "Groq LPU-инференс возвращает текст за миллисекунды. Диктовка без задержек." },
          { icon: "HardDrive", title: "Локальный словарь", desc: "Свой словарь замен и обучение прямо на устройстве — без облака." },
          { icon: "Plug", title: "Любой endpoint", desc: "Groq по умолчанию, либо любой OpenAI-совместимый через api_url_override." },
          { icon: "Palette", title: "Темы", desc: "Оверлей полностью кастомизируется — темы редактируются без пересборки." },
          { icon: "MonitorSmartphone", title: "Кроссплатформенность", desc: "Windows, macOS, Linux — единый Tauri + Rust движок." },
        ],
      }
    : {
        heading: "Why Voxis",
        sub: "Privacy, speed, and full control",
        items: [
          { icon: "Shield", title: "Private by default", desc: "Audio goes straight to your chosen endpoint. No middleman, no telemetry." },
          { icon: "Zap", title: "Blazing fast", desc: "Groq LPU inference returns text in milliseconds. Dictation with no lag." },
          { icon: "HardDrive", title: "Local dictionary", desc: "Your own replacement dictionary and learning stay on-device — no cloud." },
          { icon: "Plug", title: "Any endpoint", desc: "Groq by default, or any OpenAI-compatible API via api_url_override." },
          { icon: "Palette", title: "Themeable", desc: "The overlay is fully customizable — themes edit live without a rebuild." },
          { icon: "MonitorSmartphone", title: "Cross-platform", desc: "Windows, macOS, Linux — one Tauri + Rust engine." },
        ],
      };

  return (
    <section className="section bg-black relative z-10 border-t border-white/5">
      <Container width="page">
        <SectionHeading title={t.heading} subtitle={t.sub} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-md)]">
          {t.items.map((it, i) => {
            const Icon = ICONS[it.icon as keyof typeof ICONS];
            return (
              <div key={i} className="rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.02] p-[var(--space-lg)] hover:border-[var(--color-accent)]/40 transition-colors duration-300">
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[var(--color-accent)] w-fit mb-[var(--space-md)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-[var(--space-2xs)]">{it.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{it.desc}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
