export type IconKey = "terminal" | "cpu" | "mic" | "brain" | "keyboard" | "zap";

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
    iconName: "keyboard" as IconKey,
    className: "output::OutputHandler",
    filePath: "src-tauri/src/output/mod.rs",
    ...CYAN,
  },
];

export const stepsEn: Step[] = layers.map((layer, index) => {
  const content = [
    {
      title: "OS Boundary",
      subtitle: "STAGE 1 // INPUT",
      desc: "Global low-level OS hooks via rdev. Emits filtered hotkey-pressed/hotkey-released intent events to Tauri for instant capture.",
    },
    {
      title: "State Machine",
      subtitle: "STAGE 2 // CORE",
      desc: "A pure state machine serializing the lifecycle. Real side effects (like appending to the TranscriptionQueue) are decoupled into dedicated orchestrators.",
    },
    {
      title: "Audio Subsystem",
      subtitle: "STAGE 3 // SENSORS",
      desc: "Low-latency CPAL capture using safe lock recovery (lock_or_recover). Performs VAD and WAV encoding cleanly upon stop().",
    },
    {
      title: "AI Inference",
      subtitle: "STAGE 4 // CLOUD",
      desc: "Multipart async upload to Groq LPU (or custom OpenAI endpoints via api_url_override) parsed into a strictly-typed Result.",
    },
    {
      title: "Output Engine",
      subtitle: "STAGE 5 // ACTUATOR",
      desc: "Surfacing back to OS. Simulates keystrokes using the abstract PlatformTyper trait, falling back to pasting if typing fails.",
    }
  ];
  return { ...layer, ...content[index] };
});

export const stepsRu: Step[] = layers.map((layer, index) => {
  const content = [
    {
      title: "Граница ОС",
      subtitle: "ЭТАП 1 // ВВОД",
      desc: "Глобальные хуки через rdev. Фильтрует нажатия по атомарному ключу и отправляет семантические события в ядро Tauri.",
    },
    {
      title: "State Machine",
      subtitle: "ЭТАП 2 // ЯДРО",
      desc: "Чистая стейт-машина. Сериализует жизненный цикл записи, делегируя добавление задач в TranscriptionQueue профильным координаторам.",
    },
    {
      title: "Аудио Подсистема",
      subtitle: "ЭТАП 3 // СЕНСОРЫ",
      desc: "Низколатентный захват звука через CPAL (с безопасным восстановлением локов). VAD-фильтрация и кодирование WAV выполняются при остановке.",
    },
    {
      title: "Нейросеть (LPU)",
      subtitle: "ЭТАП 4 // ОБЛАКО",
      desc: "Асинхронная отправка аудио на процессоры Groq (или любой кастомный OpenAI endpoint через api_url_override) со строгой типизацией ответов.",
    },
    {
      title: "Движок Вывода",
      subtitle: "ЭТАП 5 // АКТЮАТОР",
      desc: "Возврат в ОС. Эмуляция нативных нажатий через трейт PlatformTyper с изящным фоллбеком на буфер обмена в случае ошибки ввода.",
    }
  ];
  return { ...layer, ...content[index] };
});
