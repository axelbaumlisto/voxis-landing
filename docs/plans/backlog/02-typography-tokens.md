# Backlog 02 — Typography token adoption

**Goal:** Заменить хардкод `text-5xl md:text-8xl` / `text-4xl md:text-5xl` / `text-lg md:text-2xl` на объявленные, но неиспользуемые токены `--text-display` / `--text-h1` / `--text-h2` / `--text-lead` (с их `line-height`/`letter-spacing`). Устранить мёртвый дизайн-код. (opus-1 4.1, opus-3 L2)

**Files:** `src/components/Hero.tsx`, `src/components/Architecture.tsx`, `src/components/ui/SectionHeading.tsx`

**Tailwind v4 note:** токены объявлены в `@theme`, значит доступны как `text-display`/`text-h1`/`text-h2`/`text-lead` utility-классы (Tailwind v4 генерирует их из `--text-*`). Проверить это первым шагом.

**Risk:** clamp()-значения могут дать другой визуальный размер чем текущий хардкод → пере-снять hero/arch скриншоты и сравнить. RU-заголовок (длиннее) особенно проверить.

---

## Task 1: Проверить доступность utility-классов

- [ ] **Step 1.1: Убедиться что Tailwind генерит text-display из токена**

```bash
cd /home/sham/work/voxis-landing
grep -n "@theme" src/app/globals.css
```
Токены `--text-*` должны быть внутри `@theme { }` блока (не просто `:root`). Если они в `:root` — Tailwind v4 их НЕ превратит в utility. Тогда либо перенести в `@theme`, либо использовать `text-[length:var(--text-display)]` с ручным line-height/letter-spacing. Выбрать подход по факту.

## Task 2: Hero title + lead

- [ ] **Step 2.1: Hero H1 → display token**

Найти в `src/components/Hero.tsx`:
```tsx
          className={`text-5xl md:text-8xl font-extrabold ${titleClassName} mb-[var(--space-md)] text-gradient`}
```
Заменить (вариант с utility если `@theme`, иначе arbitrary):
```tsx
          className={`text-[length:var(--text-display)] leading-[var(--text-display--line-height)] tracking-[var(--text-display--letter-spacing)] font-extrabold ${titleClassName} mb-[var(--space-md)] text-gradient`}
```
> `titleClassName` для RU перекрывает letter-spacing — оставить, но убедиться что он идёт ПОСЛЕ tracking в порядке классов (RU кириллица нуждается в менее тесном tracking).

- [ ] **Step 2.2: Hero lead → lead token**

Найти:
```tsx
          className="text-lg md:text-2xl text-white/90 mb-[var(--space-xl)] font-normal"
```
Заменить:
```tsx
          className="text-[length:var(--text-lead)] leading-[var(--text-lead--line-height)] text-white/90 mb-[var(--space-xl)] font-normal"
```

## Task 3: Architecture heading → h1/h2 token

- [ ] **Step 3.1: Desktop heading**

Найти:
```tsx
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              {intl.title}
            </h2>
```
Заменить:
```tsx
            <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">
              {intl.title}
            </h2>
```

- [ ] **Step 3.2: Layer card title (h3) + BentoStack heading**

Найти в layer-card:
```tsx
                                <h3 className="text-4xl font-extrabold text-white">
                                  {step.title}
                                </h3>
```
Заменить:
```tsx
                                <h3 className="text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)] font-extrabold text-white">
                                  {step.title}
                                </h3>
```

В `BentoStack` найти:
```tsx
        <h2 className="text-4xl font-extrabold text-white">{intl.title}</h2>
```
Заменить:
```tsx
        <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">{intl.title}</h2>
```

## Task 4: Verify + commit

- [ ] **Step 4.1: Скриншот-сравнение EN + RU**
```bash
npm run dev > /tmp/dev.log 2>&1 & DEV=$!; sleep 9
bunx playwright screenshot --viewport-size=1440,900 --wait-for-timeout=2500 http://localhost:3000/ /tmp/typo-en.png
bunx playwright screenshot --viewport-size=1440,900 --wait-for-timeout=2500 http://localhost:3000/ru /tmp/typo-ru.png
bunx playwright screenshot --viewport-size=390,844 --wait-for-timeout=2500 http://localhost:3000/ /tmp/typo-mobile.png
kill $DEV 2>/dev/null; wait $DEV 2>/dev/null
```
`read` все три — заголовки не сломались, RU не переполняет, mobile ок.

- [ ] **Step 4.2: Lint + build**
```bash
npm run lint && npm run build
```

- [ ] **Step 4.3: Commit**
```bash
git add src/components/Hero.tsx src/components/Architecture.tsx src/components/ui/SectionHeading.tsx
git commit -m "refactor(landing): adopt typography tokens (text-display/h1/h2/lead) — kill dead design-code"
```
