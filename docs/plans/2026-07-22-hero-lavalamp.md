# Landing — Hero peek + LavaLamp WebGL background

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** (1) первый экран показывает peek общей 3D-схемы архитектуры сразу, без скролла, чтобы у пользователя возникла мотивация листать; (2) фон hero — портированный WebGL-эффект лава-лампы из темы `lavalamp` продукта Voxis (визуальная связь «сайт = приложение»).

**Architecture:**
- **Step 1 (peek):** уменьшаем hero с `min-h-screen` до `min-h-[68vh]`; сразу под hero (внутри той же секции архитектуры) поднимаем 3D-стек — при `scrollYProgress = 0` он стартует уже в РАЗВЁРНУТОМ состоянии (все 5 слоёв разнесены и видны), не в компактном «чипе». Пользователь на первом экране видит нижнюю половину hero + верх развернутой 3D-схемы → сразу понятно, что тут длинная секция с 5 слоями.
- **Step 2 (lavalamp bg):** новый компонент `LavaLampBg.tsx` — self-contained React-обёртка WebGL fragment-шейдера из `../../src/theme-engine/builtin/lavalamp/index.ts` (491 строка). Не импортируем из `../../src/…` — портируем шейдер как локальный код (лендинг — отдельный репо/deploy). Рендерится как absolute-фон hero под текстом.

**Tech Stack:** Next.js 15 (client component), WebGL 1.0, React 19. Пакетный менеджер: **npm** (`package-lock.json`). Пре-Vercel-deploy лендинга авто-триггерится push'ем в `main`.

**Repo:** `github.com/axelbaumlisto/voxis-landing`. Все правки — в `/home/sham/work/voxis/landing/`, коммит и push триггерят production deploy.

---

## Conventions

- **Верификация после каждого шага:** `npm run lint && npm run build` (оба должны быть чистыми). Скриншот-проверка руками агента опциональна.
- **Стиль коммитов:** conventional commits, один коммит на шаг.
- **Human-gated:** нет. Оба шага автономны.

---

## Step 1: Hero peek — стартовое состояние Architecture раскрыто, hero короче

**Findings:** первый экран сейчас = только hero (`min-h-screen`); Architecture начинается со второго viewport'а и стартует в свёрнутом состоянии (`spread=40, globalOffset=300`). Пользователь не видит структуру и не знает, что впереди 5 слоёв — не мотивирован скроллить.

**Approach:**
1. Hero: `min-h-screen` → `min-h-[68vh]` (~32% высоты «peek» показывает верх 3D-стека).
2. Architecture стартовое состояние: `spread` сразу = `SPREAD` (620), `globalOffset` = 0 → все 5 слоёв уже разнесены и видны при `scrollYProgress = 0`. Скролл теперь только двигает фокус между слоями (fly), не «взрывает» чип.
3. Intro-карточка убирается (её роль — сказать «а тут есть 5 слоёв» — теперь берёт на себя сама схема).

**Files:**
- Modify: `src/components/Hero.tsx` (высота секции)
- Modify: `src/components/Architecture.tsx` (стартовые `spread`/`globalOffset`, удаление intro-карточки и связанной логики)
- Modify: `src/components/LandingPage.tsx` (удаление `archIntl.eyebrow/title/intro/scrollHint` — остаётся только `title`/`subtitle` для мобильного заголовка)

- [ ] **Step 1.1: Hero короче**

В `src/components/Hero.tsx` меняем секцию:

Было:
```tsx
    <section className="section-hero flex flex-col items-center justify-center text-center relative z-10 min-h-screen">
```
Стало:
```tsx
    <section className="section-hero flex flex-col items-center justify-center text-center relative z-10 min-h-[68vh] pt-24 pb-16">
```

(`pt-24` — чтобы нависающий `absolute` navbar не наезжал; `pb-16` — воздух между hero и peek'ом схемы.)

- [ ] **Step 1.2: Architecture стартует раскрытым**

В `src/components/Architecture.tsx`, внутри `BoardLayer`:

Было:
```tsx
  const currentZ = useTransform(scrollYProgress, (p) => {
    // START COMPACTED: spread = 40 (tightly stacked like a real chip)
    // EXPLODE: expand to 620 over the first 10% of scroll
    let spread = 40; 
    let fly = 0;
    
    if (p < 0.1) {
      spread = 40 + (p / 0.1) * (SPREAD - 40);
    } else {
      spread = SPREAD;
      fly = ((p - 0.1) / 0.9) * 4.99; 
    }

    const distance = i - fly;
    const baseDepth = distance * -spread;

    const pop = Math.abs(distance) < EPSILON ? FOCUS_POP * (1 - Math.abs(distance) / EPSILON) : 0;
    
    // When compacted (p < 0.05), push the whole stack closer to the camera so it's readable
    const globalOffset = p < 0.05 ? 300 : 0;
    
    return baseDepth + pop + globalOffset;
  });
```

Стало:
```tsx
  const currentZ = useTransform(scrollYProgress, (p) => {
    // Peek from frame one: all 5 layers already spread. Scroll moves focus (fly),
    // not "explode from compacted chip". No global camera offset — the stack is
    // pre-arranged for hero-peek visibility.
    const fly = p * 4.99;
    const distance = i - fly;
    const baseDepth = distance * -SPREAD;
    const pop = Math.abs(distance) < EPSILON ? FOCUS_POP * (1 - Math.abs(distance) / EPSILON) : 0;
    return baseDepth + pop;
  });
```

- [ ] **Step 1.3: Удалить intro-card и связанную логику**

В `Architecture.tsx`:

3a) Удалить объявления `introOpacity`, `introY`, `introPointer` (сразу после `useMotionValueEvent`):
```tsx
  const introOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.05], [0, -30]);
  const introPointer = useTransform(scrollYProgress, [0, 0.05], ["auto", "none"]);
```
→ удалить эти три строки полностью.

3b) Упростить обработчик скролла — убрать early-return при `p<0.1` (fly теперь начинается с 0):
```tsx
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowLayers(latest >= 0.05);
    let f = 0;
    if (latest >= 0.1) {
      f = ((latest - 0.1) / 0.9) * 4.99;
    }
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(f))));
  });
```
→ заменить на:
```tsx
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const f = latest * 4.99;
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(f))));
  });
```

3c) Убрать `showLayers` state + `!showLayers && <IntroCard>` блок + гейт `showLayers &&` перед `steps.map` (карточки этапов теперь показываются всегда — от i=0). В JSX левой информационной колонки:

Было (упрощённо):
```tsx
              {!showLayers && (
                <motion.div style={{ opacity: introOpacity, ... }} className="... intro-card ...">
                  <div className="p-10 relative">
                     <div className="text-xs ...">{intl.eyebrow}</div>
                     <h3 ...>{intl.title}</h3>
                     <p ...>{intl.intro}<br/><br/>{intl.scrollHint}</p>
                  </div>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {showLayers && steps.map((step, i) => (
                  i === active && ( ... layer card ... )
                ))}
              </AnimatePresence>
```

Стало:
```tsx
              <AnimatePresence mode="wait">
                {steps.map((step, i) => (
                  i === active && ( ... layer card ... )
                ))}
              </AnimatePresence>
```

(Layer-card JSX внутри — не трогать, оставить как есть с motion.div initial/animate/exit.)

Также удалить `const [showLayers, setShowLayers] = useState(false);` и импорт `useState` если он больше не используется в файле (проверить: `showLayers` больше не должен встречаться, `useState` — тоже, если не используется в другом месте).

- [ ] **Step 1.4: Убрать intro-строки из ArchIntl**

В `src/components/Architecture.tsx` изменить интерфейс:
```tsx
export interface ArchIntl {
  title: string;
  subtitle: string;
}
```
(убрать `eyebrow`, `intro`, `scrollHint`).

В `src/components/LandingPage.tsx` — упростить `archIntl`:

Было:
```tsx
  const archIntl = isRu
    ? {
        eyebrow: "ПОД КАПОТОМ",
        title: "Архитектура системы",
        intro: "Монолитное ядро на Rust оркестрирует события ОС, аудиопотоки и облачный инференс.",
        scrollHint: "Прокрути вниз, чтобы «взорвать» чип и пролететь сквозь слои.",
        subtitle: "SOLID-архитектура на Rust",
      }
    : {
        eyebrow: "UNDER THE HOOD",
        title: "System Architecture",
        intro: "A monolithic Rust core orchestrating OS events, audio streams, and cloud inference.",
        scrollHint: "Scroll down to explode the chip and fly through the layers.",
        subtitle: "SOLID Rust Architecture",
      };
```

Стало:
```tsx
  const archIntl = isRu
    ? { title: "Архитектура системы", subtitle: "SOLID-архитектура на Rust" }
    : { title: "System Architecture", subtitle: "SOLID Rust Architecture" };
```

- [ ] **Step 1.5: Lint + build**

Run: `npm run lint && npm run build`
Expected: оба зелёные. Особое внимание к предупреждениям unused-var — `showLayers`, `introOpacity/introY/introPointer`, `useState` (если не используется) — все должны быть удалены.

- [ ] **Step 1.6: Commit**

```bash
git add src/components/Hero.tsx src/components/Architecture.tsx src/components/LandingPage.tsx
git commit -m "feat(landing): hero peek — reveal architecture stack pre-scroll (68vh + pre-spread)"
```

---

## Step 2: LavaLamp WebGL background в hero

**Findings:** тема `lavalamp` — один из бренд-визуалов приложения Voxis (WebGL raymarched metaballs с конвекцией). Логично сделать её фоном hero — сайт визуально «продолжает» продукт.

**Approach:**
1. Создать компонент `src/components/LavaLampBg.tsx`. Он — client component (`"use client"`), рендерит `<canvas>` full-bleed absolute, монтирует WebGL-шейдер и цикл RAF, размонтирует по cleanup.
2. Шейдер + JS-логика **портируются** из `~/work/voxis/src/theme-engine/builtin/lavalamp/index.ts` (491 строка) как **локальный код** — лендинг не имеет доступа к темам приложения. Точки адаптации:
   - **Убрать** `import type { ThemeApi, ThemeInstance, ThemeState }` — лендинг этих типов не знает. Заменить логику `api.onState(...)` на: `mode = "idle"` жёстко, `level = 0` (без микрофона на сайте — тема просто "дышит"). Убрать `error`-режим и все связанные ветки.
   - **Убрать** обёртку `mount(container, api)` — экспортировать как React-хук/компонент.
   - **Респект `prefers-reduced-motion`:** если пользователь просит меньше анимаций, вообще не запускать WebGL — рендерить пустой `<div>` с статичным градиентом.
   - **Полный экран hero:** `canvas.width = clientWidth * dpr`, listen `resize`, обновлять `uResolution`.
   - **Позиционирование:** `absolute inset-0 -z-10`, `pointer-events: none`. Поверх — существующий контент hero.
   - **Не удалять** существующий `bg-grid opacity-30` и `blur-[150px]` blob в hero — LavaLamp идёт под ними как дополнительный слой глубины? Нет, наоборот: **удалить** `bg-grid` и blob-blur — LavaLamp сам достаточно богат визуально, второй слой сделает шумно. Уточнено ниже в шаге 2.2.
3. Fallback: если `getContext("webgl")` вернул `null` (или link failed) — компонент рендерит пустой `<div>`, не бросает ошибку. Логировать `console.warn` один раз.

**Files:**
- Create: `src/components/LavaLampBg.tsx`
- Modify: `src/components/Hero.tsx` (импорт и вставка компонента, удаление старых bg-слоёв)

- [ ] **Step 2.1: Создать `LavaLampBg.tsx`**

Полное содержимое `src/components/LavaLampBg.tsx` — привожу целиком (WebGL FRAG-шейдер полностью портирован из product theme; сам JS упрощён под hero: `mode=idle`, `level=0`, respect `prefers-reduced-motion`):

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uResolution;
uniform float uPhase;
uniform float uLevel;

uniform float uShine;
uniform float uSpecW;
uniform float uSaturation;
uniform float uZoom;
uniform vec3  uCol1;
uniform vec3  uCol2;
uniform vec3  uCol3;
uniform vec3  uCol4;

const int   MAX_ITERS = 80;
const float EPSILON   = 1e-2;

float saturate(float x) { return clamp(x, 0.0, 1.0); }

float sphereImplicit(vec3 pt, float radius, vec3 position) {
  return length(pt - position) - radius;
}

float smin(float a, float b, float blendRadius) {
  float c = saturate(0.5 + (b - a) * (0.5 / blendRadius));
  return mix(b, a, c) - blendRadius * c * (1.0 - c);
}

float fieldAt(vec3 p, float rad, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
  return smin(smin(smin(
      sphereImplicit(p, rad, c1),
      sphereImplicit(p, rad, c2), 1.3),
      sphereImplicit(p, rad, c3), 1.3),
      sphereImplicit(p, rad, c4), 1.3);
}

vec3 orbitCenter(float t, float phase, float y0, float xSide) {
  float xDrift = 0.6 * sin(t + phase * 0.7);
  float x = xSide + 0.15 * sin(t * 0.9 + phase);
  float y = y0 + 0.9 * sin(t * 0.6 + phase);
  float z = 0.25 * cos(t * 0.5 + phase);
  return vec3(x + xDrift * 0.15, y, z);
}

vec4 render(vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * uResolution.xy) / uResolution.y;
  uv *= uZoom;

  float t = uPhase;
  float rad = 0.75 + 0.15 * uLevel;

  vec3 c1 = orbitCenter(t, 0.0, -0.6, -0.7);
  vec3 c2 = orbitCenter(t, 1.6,  0.3,  0.65);
  vec3 c3 = orbitCenter(t, 3.1, -0.2, -0.6);
  vec3 c4 = orbitCenter(t, 4.7,  0.55, 0.7);

  vec3 ro = vec3(0.0, 0.0, -3.5);
  vec3 rd = normalize(vec3(uv, 1.0));

  float dist = 0.0;
  float minD = 1e5;
  float d;
  vec3 p;
  for (int i = 0; i < MAX_ITERS; i++) {
    p = ro + rd * dist;
    d = fieldAt(p, rad, c1, c2, c3, c4);
    minD = min(minD, d);
    if (d < EPSILON) break;
    if (dist > 8.0) break;
    dist += d;
  }

  float edgeW = 0.06;
  float edgeAlpha = 1.0 - smoothstep(0.0, edgeW, minD);
  if (edgeAlpha <= 0.001) return vec4(0.0);

  vec3 hit = ro + rd * dist;
  vec2 e = vec2(0.001, 0.0);
  vec3 normal = normalize(vec3(
      fieldAt(hit + e.xyy, rad, c1, c2, c3, c4) - fieldAt(hit - e.xyy, rad, c1, c2, c3, c4),
      fieldAt(hit + e.yxy, rad, c1, c2, c3, c4) - fieldAt(hit - e.yxy, rad, c1, c2, c3, c4),
      fieldAt(hit + e.yyx, rad, c1, c2, c3, c4) - fieldAt(hit - e.yyx, rad, c1, c2, c3, c4)
  ));

  float w1 = 1.0 / (1.0 + distance(hit, c1));
  float w2 = 1.0 / (1.0 + distance(hit, c2));
  float w3 = 1.0 / (1.0 + distance(hit, c3));
  float w4 = 1.0 / (1.0 + distance(hit, c4));
  float wsum = w1 + w2 + w3 + w4;
  vec3 color = (uCol1 * w1 + uCol2 * w2 + uCol3 * w3 + uCol4 * w4) / wsum;

  vec3 lightDir1 = normalize(vec3(0.4, 0.8, -0.5));
  vec3 lightDir2 = normalize(vec3(-0.6, 0.3, -0.7));
  vec3 lightDir3 = normalize(vec3(0.2, -0.5, -0.9));
  vec3 v = normalize(-rd);
  vec3 h1 = normalize(lightDir1 + v);
  vec3 h2 = normalize(lightDir2 + v);
  vec3 h3 = normalize(lightDir3 + v);
  float spec = 1.0;
  float lit = 0.18 + 0.82 * (
      max(dot(normal, lightDir1), 0.0) + uSpecW*spec*pow(max(dot(normal, h1), 0.0), uShine) +
      max(dot(normal, lightDir2), 0.0) + uSpecW*spec*pow(max(dot(normal, h2), 0.0), uShine) +
      max(dot(normal, lightDir3), 0.0) + uSpecW*spec*pow(max(dot(normal, h3), 0.0), uShine)
  );

  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = clamp(lum + (color - lum) * uSaturation, 0.0, 1.0);
  vec3 outc = lit * color;
  outc *= (1.0 + 0.25 * uLevel);
  outc *= 1.6;
  float L = dot(outc, vec3(0.299, 0.587, 0.114));
  float Lt = L / (1.0 + L);
  outc *= (L > 1e-4) ? (Lt / L) : 1.0;
  float lum2 = dot(outc, vec3(0.299, 0.587, 0.114));
  outc = clamp(lum2 + (outc - lum2) * 1.25, 0.0, 1.0);
  outc = pow(clamp(outc, 0.0, 1.0), vec3(1.0/2.2));
  return vec4(outc, edgeAlpha);
}

void main() {
  vec3  rgbAcc = vec3(0.0);
  float aAcc   = 0.0;
  vec4 s;
  s = render(gl_FragCoord.xy + vec2(-0.125, -0.375)); rgbAcc += s.rgb * s.a; aAcc += s.a;
  s = render(gl_FragCoord.xy + vec2( 0.375, -0.125)); rgbAcc += s.rgb * s.a; aAcc += s.a;
  s = render(gl_FragCoord.xy + vec2(-0.375,  0.125)); rgbAcc += s.rgb * s.a; aAcc += s.a;
  s = render(gl_FragCoord.xy + vec2( 0.125,  0.375)); rgbAcc += s.rgb * s.a; aAcc += s.a;
  gl_FragColor = vec4(rgbAcc * 0.25, aAcc * 0.25);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type) as WebGLShader;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s) || "unknown";
    gl.deleteShader(s);
    throw new Error("shader compile failed: " + log);
  }
  return s;
}

export default function LavaLampBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return; // respect prefers-reduced-motion — render static bg
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) {
      console.warn("LavaLampBg: WebGL unavailable");
      return;
    }

    let prog: WebGLProgram | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    let buf: WebGLBuffer | null = null;

    try {
      prog = gl.createProgram();
      vs = compile(gl, gl.VERTEX_SHADER, VERT);
      fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!prog) throw new Error("createProgram null");
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error("program link failed: " + gl.getProgramInfoLog(prog));
      }
    } catch (e) {
      console.warn("LavaLampBg:", e instanceof Error ? e.message : String(e));
      return;
    }

    gl.useProgram(prog);

    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uPhase = gl.getUniformLocation(prog, "uPhase");
    const uLevel = gl.getUniformLocation(prog, "uLevel");

    // Static params matching Voxis lavalamp theme defaults
    gl.uniform1f(gl.getUniformLocation(prog, "uShine"), 28);
    gl.uniform1f(gl.getUniformLocation(prog, "uSpecW"), 0.6);
    gl.uniform1f(gl.getUniformLocation(prog, "uSaturation"), 1.7);
    gl.uniform1f(gl.getUniformLocation(prog, "uZoom"), 1.7);
    // Palette (same as theme manifest: ff3b1f / ff7a00 / ffb300 / ff2d6f)
    gl.uniform3f(gl.getUniformLocation(prog, "uCol1"), 1.0, 0.231, 0.121);
    gl.uniform3f(gl.getUniformLocation(prog, "uCol2"), 1.0, 0.478, 0.0);
    gl.uniform3f(gl.getUniformLocation(prog, "uCol3"), 1.0, 0.702, 0.0);
    gl.uniform3f(gl.getUniformLocation(prog, "uCol4"), 1.0, 0.176, 0.435);

    let phase = 0;
    let prevNow = performance.now();
    let raf = 0;
    let running = true;

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.floor(canvas!.clientWidth * dpr);
      const h = Math.floor(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
        gl!.uniform2f(uRes, w, h);
      }
    }
    resize();
    window.addEventListener("resize", resize);

    function frame() {
      if (!running) return;
      const now = performance.now();
      const dt = Math.max(0, Math.min(0.05, (now - prevNow) / 1000));
      prevNow = now;
      // idle-only: gentle constant drift (no audio on the web)
      const speed = 0.55;
      const modeSpeed = 0.8;
      const energy = 0.5 + 0.12;
      phase += 0.5 * energy * speed * modeSpeed * dt;
      gl!.uniform1f(uPhase, phase);
      gl!.uniform1f(uLevel, 0.12);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        prevNow = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (gl && buf) gl.deleteBuffer(buf);
      if (gl && prog) gl.deleteProgram(prog);
      if (gl && vs) gl.deleteShader(vs);
      if (gl && fs) gl.deleteShader(fs);
      const ext = gl?.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70 mix-blend-screen"
      style={{ zIndex: -1 }}
    />
  );
}
```

- [ ] **Step 2.2: Вставить в Hero, убрать конфликтующие фоны**

В `src/components/Hero.tsx`:

Добавить импорт в шапке:
```tsx
import LavaLampBg from "./LavaLampBg";
```

Заменить два существующих backdrop-элемента в начале секции:

Было:
```tsx
      <div className="absolute inset-0 bg-grid opacity-30 z-[-1]"></div>
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[60vw] h-[40vw] bg-[var(--color-accent-blue)]/15 rounded-full mix-blend-screen blur-[150px] z-[-1]"></div>
```

Стало:
```tsx
      <LavaLampBg />
```

(Убираем `bg-grid` и `blob-blur` — LavaLamp визуально насыщенный, второй слой перегрузит. `mix-blend-screen` на canvas'e даст «свечение» поверх чёрного фона `main`.)

- [ ] **Step 2.3: Lint + build**

Run: `npm run lint && npm run build`
Expected: оба зелёные. Warnings про WebGL не должно быть — типы у нас через `WebGL*` глобальные типы браузера, всё стандартно.

- [ ] **Step 2.4: Commit**

```bash
git add src/components/LavaLampBg.tsx src/components/Hero.tsx
git commit -m "feat(landing): lavalamp WebGL background in hero (port from Voxis theme)"
```

---

## Deploy

- [ ] **Push обеих коммитов в main**

```bash
git push origin main
```

Vercel Git-интеграция авто-деплоит на voxis.top.

- [ ] **Verify live:**
Через 1–2 мин:
```bash
curl -s https://voxis.top | grep -oE 'min-h-\[68vh\]|LavaLampBg|md:h-\[320vh\]' | sort -u
```
Ожидание: `min-h-[68vh]` в hero-разметке (или footprint компонента), `md:h-[320vh]` сохранена от предыдущего рефакторинга.

Скриншот в браузере (руками): открыть voxis.top, увидеть на первом экране: hero (заголовок + CTA) в верхней 2/3 + peek верхнего слоя 3D-стека внизу. Фон hero — плавно движущиеся оранжево-розовые кляксы (lavalamp).

---

## Self-Review

| Требование | Step |
|-----------|------|
| Все слои видны на первом экране (peek) | 1.1 (68vh hero) + 1.2 (pre-spread) |
| Стартовое состояние — раскрытая схема, не свёрнутая | 1.2 (нет `spread=40` фазы) |
| Убрать intro-карточку (её роль — сказать «есть 5 слоёв» — теперь берёт схема) | 1.3 |
| LavaLamp фон hero | 2.1 + 2.2 |
| Уважение `prefers-reduced-motion` | 2.1 (`useReducedMotion` skip) |
| WebGL fallback без падения | 2.1 (`console.warn` + пустой canvas) |
| Локальный код, без импорта из product | 2.1 (шейдер портирован дословно) |
| Lint + build чистые | 1.5, 2.3 |
| Auto-deploy через Git-интеграцию | Deploy step |
