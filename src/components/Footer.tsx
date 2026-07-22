import Container from "./ui/Container";

interface FooterProps {
  lang?: "en" | "ru";
}

export default function Footer({ lang = "en" }: FooterProps) {
  const isRu = lang === "ru";
  const year = new Date().getFullYear();

  const t = isRu
    ? {
        tagline: "Приватный движок голосовой диктовки на Rust + Tauri.",
        docs: "Документация",
        github: "GitHub",
        download: "Скачать",
        rights: `© ${year} Voxis. Открытый исходный код под лицензией MIT.`,
      }
    : {
        tagline: "Private voice dictation engine built on Rust + Tauri.",
        docs: "Documentation",
        github: "GitHub",
        download: "Download",
        rights: `© ${year} Voxis. Open source under the MIT License.`,
      };

  return (
    <footer className="w-full border-t border-white/5 z-10 bg-black">
      <Container width="page" className="py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-black tracking-tighter text-white">VOXIS</span>
          <span className="text-zinc-500 max-w-xs">{t.tagline}</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-zinc-400">
          <a href="https://docs.voxis.top" className="hover:text-white transition-colors">{t.docs}</a>
          <a href="https://github.com/axelbaumlisto/voxis" className="hover:text-white transition-colors">{t.github}</a>
          <a href="https://github.com/axelbaumlisto/voxis/releases" className="hover:text-white transition-colors">{t.download}</a>
        </nav>
      </Container>
      <div className="border-t border-white/5">
        <Container width="page" className="py-4 text-center text-zinc-500 text-xs">
          {t.rights}
        </Container>
      </div>
    </footer>
  );
}
