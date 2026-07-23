# Backlog 07 — Content sections (features / screenshots / install / FAQ)

**Goal:** Заполнить семантический вакуум между Architecture и Footer: Features grid, Product Showcase (placeholder под скриншоты), Install CTA, FAQ. Крупнейший конверсионный gap. (opus-1/2/3, консенсус P0-3)

**⚠ КОПИРАЙТ = ДРАФТ.** Текст ниже — осмысленный дефолт, владелец правит позже. Скриншоты — placeholder-блоки (`aspect-video` с подписью), владелец дропнет реальные PNG в `public/` и заменит src.

**Files:** Create `src/components/Features.tsx`, `src/components/Showcase.tsx`, `src/components/DownloadCta.tsx`, `src/components/Faq.tsx`; modify `src/components/LandingPage.tsx`

**Pattern:** i18n inline (EN/RU ternary), как в Footer. Cyan-бренд, `Container`, spacing-токены. lucide-иконки.

---

## Task 1: Features grid

- [ ] **Step 1.1: Создать `src/components/Features.tsx`**

```tsx
import { Shield, Zap, HardDrive, Plug, Palette, MonitorSmartphone } from "lucide-react";
import Container from "./ui/Container";

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
    <section className="w-full bg-black py-[var(--space-4xl)] relative z-10 border-t border-white/5">
      <Container width="page">
        <div className="text-center mb-[var(--space-2xl)]">
          <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">{t.heading}</h2>
          <p className="text-[var(--color-muted-2)] mt-[var(--space-sm)] text-lg">{t.sub}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-md)]">
          {t.items.map((it, i) => {
            const Icon = ICONS[it.icon as keyof typeof ICONS];
            return (
              <div key={i} className="rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.02] p-[var(--space-lg)] hover:border-cyan-400/40 transition-colors duration-300">
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-cyan-400 w-fit mb-[var(--space-md)]">
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
```

## Task 2: Showcase (placeholder под скриншоты)

- [ ] **Step 2.1: Создать `src/components/Showcase.tsx`**

```tsx
import Container from "./ui/Container";

export default function Showcase({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? { heading: "Voxis в действии", sub: "Оверлей поверх любого приложения", cap1: "Оверлей записи", cap2: "История транскрипций", cap3: "Настройки и словарь" }
    : { heading: "Voxis in action", sub: "An overlay on top of any app", cap1: "Recording overlay", cap2: "Transcription history", cap3: "Settings & dictionary" };

  const shots = [t.cap1, t.cap2, t.cap3];

  return (
    <section className="w-full bg-black py-[var(--space-4xl)] relative z-10 border-t border-white/5">
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
```

## Task 3: Download CTA + GitHub stars

- [ ] **Step 3.1: Создать `src/components/DownloadCta.tsx`**

```tsx
import { Download, Star } from "lucide-react";
import Container from "./ui/Container";

export default function DownloadCta({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? { heading: "Готовы писать со скоростью мысли?", sub: "Бесплатно и с открытым исходным кодом.", dl: "Скачать Voxis", star: "Звезда на GitHub" }
    : { heading: "Ready to write at lightspeed?", sub: "Free and open source.", dl: "Download Voxis", star: "Star on GitHub" };

  return (
    <section className="w-full bg-black py-[var(--space-4xl)] relative z-10 border-t border-white/5">
      <Container width="prose" className="flex flex-col items-center text-center gap-[var(--space-lg)]">
        <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">{t.heading}</h2>
        <p className="text-[var(--color-muted-2)] text-lg">{t.sub}</p>
        <div className="flex flex-col sm:flex-row gap-[var(--space-sm)]">
          <a href="https://github.com/axelbaumlisto/voxis/releases" className="btn-base btn-primary">
            <Download className="w-5 h-5" /> {t.dl}
          </a>
          <a href="https://github.com/axelbaumlisto/voxis" className="btn-base btn-secondary">
            <Star className="w-5 h-5" /> {t.star}
          </a>
        </div>
      </Container>
    </section>
  );
}
```

## Task 4: FAQ

- [ ] **Step 4.1: Создать `src/components/Faq.tsx`**

```tsx
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
```

## Task 5: Wire into LandingPage

- [ ] **Step 5.1: Импорты + вставка между Architecture и Footer**

В `src/components/LandingPage.tsx` добавить импорты:
```tsx
import Features from "./Features";
import Showcase from "./Showcase";
import DownloadCta from "./DownloadCta";
import Faq from "./Faq";
```

Найти:
```tsx
      <Architecture steps={isRu ? stepsRu : stepsEn} intl={archIntl} />
      <Footer lang={lang} />
```
Заменить:
```tsx
      <Architecture steps={isRu ? stepsRu : stepsEn} intl={archIntl} />
      <Features lang={lang} />
      <Showcase lang={lang} />
      <DownloadCta lang={lang} />
      <Faq lang={lang} />
      <Footer lang={lang} />
```

## Task 6: Verify + commit

- [ ] **Step 6.1: Full-page скриншот EN + RU + mobile**
```bash
npm run dev > /tmp/dev.log 2>&1 & DEV=$!; sleep 9
bunx playwright screenshot --viewport-size=1440,900 --full-page --wait-for-timeout=2500 http://localhost:3000/ /tmp/content-en.png
bunx playwright screenshot --viewport-size=1440,900 --full-page --wait-for-timeout=2500 http://localhost:3000/ru /tmp/content-ru.png
bunx playwright screenshot --viewport-size=390,844 --full-page --wait-for-timeout=2500 http://localhost:3000/ /tmp/content-mobile.png
kill $DEV 2>/dev/null; wait $DEV 2>/dev/null
```
`read` все три — после Architecture идут Features (6 карточек) → Showcase (3 placeholder) → DownloadCTA → FAQ (4) → Footer. Нет чёрной пустоты. RU локализован. Mobile — секции стекаются.

- [ ] **Step 6.2: Lint + build**
```bash
npm run lint && npm run build
```

- [ ] **Step 6.3: Commit**
```bash
git add src/components/Features.tsx src/components/Showcase.tsx src/components/DownloadCta.tsx src/components/Faq.tsx src/components/LandingPage.tsx
git commit -m "feat(landing): content sections — features, showcase, download CTA, FAQ (draft copy)"
```

---

## Notes for owner (после мержа)

1. **Скриншоты:** положить реальные PNG оверлея/истории/настроек в `public/screenshots/`, заменить placeholder-блоки в `Showcase.tsx` на `<img>`.
2. **Копирайт:** весь текст в EN/RU объектах — драфт, правь свободно, структура не сломается.
3. **GitHub stars:** сейчас статичная кнопка «Star on GitHub». Если хочешь живой счётчик — отдельная задача (fetch GitHub API в Server Component).
