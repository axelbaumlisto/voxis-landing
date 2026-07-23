export type IconKey = "terminal" | "cpu" | "mic" | "brain" | "keyboard" | "zap" | "sparkles";

export interface Step {
  iconName: IconKey;
  title: string;
  className: string;
  filePath: string;
  subtitle: string;
  desc: string;
  glow: string;
  iconColor: string;
  hex: string;
}

// Unified cyan brand ramp: stage identity comes from icon + eyebrow number,
// not colour. Keeps cohesion with --color-accent (#22d3ee) and LavaLamp palette.
const CYAN = {
  glow: "shadow-[0_0_40px_rgba(34,211,238,0.4)] border-[var(--color-accent)]",
  iconColor: "text-[var(--color-accent)]",
  hex: "#22d3ee",
} as const;

const layers = [
  {
    iconName: "terminal" as IconKey,
    className: "hotkey::HotkeyListener",
    filePath: "src-tauri/src/hotkey/mod.rs",
    ...CYAN,
  },
  {
    iconName: "cpu" as IconKey,
    className: "orchestrator::TranscriptionCoordinator",
    filePath: "src-tauri/src/orchestrator/coordinator.rs",
    ...CYAN,
  },
  {
    iconName: "mic" as IconKey,
    className: "audio::stream",
    filePath: "src-tauri/src/audio/stream.rs",
    ...CYAN,
  },
  {
    iconName: "brain" as IconKey,
    className: "transcription::TranscriptionClient",
    filePath: "src-tauri/src/transcription/mod.rs",
    ...CYAN,
  },
  {
    iconName: "sparkles" as IconKey,
    className: "llm::PostProcessor",
    filePath: "src-tauri/src/llm/mod.rs",
    ...CYAN,
  },
  {
    iconName: "keyboard" as IconKey,
    className: "output::OutputHandler",
    filePath: "src-tauri/src/output/mod.rs",
    ...CYAN,
  },
];

export const stepsEn: Step[] = layers.map((layer, index) => {
  const content = [
    {
      title: "Capture the keypress",
      subtitle: "STAGE 1 // CAPTURE",
      desc: "Your hotkey is caught by a global low-level OS hook, so recording starts instantly from any app. Built on rdev.",
    },
    {
      title: "Coordinate the flow",
      subtitle: "STAGE 2 // COORDINATE",
      desc: "A pure state machine drives the record\u2192transcribe\u2192output lifecycle and queues each take, so back-to-back dictations never collide.",
    },
    {
      title: "Listen & filter",
      subtitle: "STAGE 3 // LISTEN",
      desc: "Low-latency audio capture via CPAL, with Silero voice-activity detection trimming silence so only real speech is ever sent.",
    },
    {
      title: "Transcribe",
      subtitle: "STAGE 4 // TRANSCRIBE",
      desc: "The clip streams to a Whisper-compatible endpoint \u2014 Groq by default, or any OpenAI-compatible / self-hosted URL you point it at.",
    },
    {
      title: "Refine",
      subtitle: "STAGE 5 // REFINE",
      desc: "Your dictionary fixes names and terms, and an optional LLM pass cleans up grammar and formatting using the prompt you choose.",
    },
    {
      title: "Type it anywhere",
      subtitle: "STAGE 6 // TYPE",
      desc: "The final text is typed straight into the focused window, with a clipboard-paste fallback that restores what you had before.",
    }
  ];
  return { ...layer, ...content[index] };
});

export const stepsRu: Step[] = layers.map((layer, index) => {
  const content = [
    {
      title: "Ловим нажатие",
      subtitle: "ЭТАП 1 // ЗАХВАТ",
      desc: "Горячую клавишу перехватывает глобальный низкоуровневый хук ОС \u2014 запись стартует мгновенно из любого приложения. На основе rdev.",
    },
    {
      title: "Дирижируем потоком",
      subtitle: "ЭТАП 2 // КООРДИНАЦИЯ",
      desc: "Чистая стейт-машина ведёт цикл запись\u2192расшифровка\u2192вывод и ставит каждую запись в очередь, так что диктовки подряд не смешиваются.",
    },
    {
      title: "Слушаем и фильтруем",
      subtitle: "ЭТАП 3 // ПРОСЛУШКА",
      desc: "Низколатентный захват звука через CPAL, а Silero-детектор речи обрезает тишину \u2014 в облако уходит только реальная речь.",
    },
    {
      title: "Расшифровка",
      subtitle: "ЭТАП 4 // РАСШИФРОВКА",
      desc: "Запись уходит на Whisper-совместимый endpoint \u2014 Groq по умолчанию или любой OpenAI-совместимый / свой URL, который вы укажете.",
    },
    {
      title: "Шлифуем",
      subtitle: "ЭТАП 5 // ШЛИФОВКА",
      desc: "Ваш словарь исправляет имена и термины, а опциональный проход LLM правит грамматику и формат по выбранному вами промпту.",
    },
    {
      title: "Печатаем куда угодно",
      subtitle: "ЭТАП 6 // ВЫВОД",
      desc: "Готовый текст печатается прямо в активное окно, с фоллбеком на вставку из буфера, который затем восстанавливает прежнее содержимое.",
    }
  ];
  return { ...layer, ...content[index] };
});
