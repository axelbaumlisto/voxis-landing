import { Keyboard, Mic, Type } from "lucide-react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

const ICONS = { Keyboard, Mic, Type };

export default function HowItWorks({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? {
        heading: "Как это работает",
        sub: "От нажатия клавиши до готового текста — три шага",
        steps: [
          { icon: "Keyboard", title: "Нажми горячую клавишу", desc: "Удерживай для записи или переключай тумблером (по умолчанию правый Ctrl). Работает поверх любого приложения." },
          { icon: "Mic", title: "Говори", desc: "Voxis обрезает тишину и отбрасывает пустые фрагменты — в облако уходит только речь." },
          { icon: "Type", title: "Текст появляется под курсором", desc: "Автоввод прямо в активное окно или вставка из буфера с восстановлением прежнего содержимого." },
        ],
      }
    : {
        heading: "How it works",
        sub: "From key-press to typed text in three steps",
        steps: [
          { icon: "Keyboard", title: "Press your hotkey", desc: "Hold to record, or toggle on and off (Right Ctrl by default). Works on top of any app." },
          { icon: "Mic", title: "Speak", desc: "Voxis trims silence and drops empty clips — only your speech is sent to the cloud." },
          { icon: "Type", title: "Text appears where your cursor is", desc: "Auto-typed into the focused window, or pasted with your clipboard restored afterward." },
        ],
      };

  return (
    <section className="section bg-black relative z-10 border-t border-white/5">
      <Container width="page">
        <SectionHeading title={t.heading} subtitle={t.sub} />
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-md)]">
          {t.steps.map((step, i) => {
            const Icon = ICONS[step.icon as keyof typeof ICONS];
            return (
              <li
                key={i}
                className="relative rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.02] p-[var(--space-lg)]"
              >
                <span
                  className="absolute top-[var(--space-lg)] right-[var(--space-lg)] text-5xl font-extrabold text-white/[0.06] leading-none select-none"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[var(--color-accent)] w-fit mb-[var(--space-md)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-[var(--space-2xs)]">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
