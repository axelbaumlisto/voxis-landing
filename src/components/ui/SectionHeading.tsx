import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: string;
  subtitleClassName?: string;
  className?: string;
}

export default function SectionHeading({ title, subtitle, subtitleClassName, className }: SectionHeadingProps) {
  return (
    <div className={cn("text-center mb-[var(--space-2xl)]", className)}>
      <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-[var(--color-muted-2)] mt-[var(--space-sm)] text-lg", subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
