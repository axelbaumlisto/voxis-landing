import { cn } from "../../lib/cn";

interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  eyebrowColor?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "sm" | "md" | "lg" | "hero";
  align?: "left" | "center";
  gradient?: boolean;
  className?: string;
}

const titleSize = {
  sm: "text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)] tracking-[var(--text-h2--letter-spacing)]",
  md: "text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]",
  lg: "text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)]",
  hero: "text-[length:var(--text-display)] leading-[var(--text-display--line-height)] tracking-[var(--text-display--letter-spacing)]",
} as const;

const descSize = {
  sm: "text-[length:var(--text-body)] leading-[var(--text-body--line-height)]",
  md: "text-[length:var(--text-body)] leading-[var(--text-body--line-height)]",
  lg: "text-[length:var(--text-lead)] leading-[var(--text-lead--line-height)]",
  hero: "text-[length:var(--text-lead)] leading-[var(--text-lead--line-height)]",
} as const;

export default function SectionHeading({
  eyebrow,
  eyebrowColor,
  title,
  description,
  as: Tag = "h2",
  size = "md",
  align = "center",
  gradient = false,
  className,
}: SectionHeadingProps) {
  const alignCls =
    align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={cn("flex flex-col", alignCls, className)}>
      {eyebrow && (
        <div
          className="pill mb-[var(--space-xs)]"
          style={eyebrowColor ? { color: eyebrowColor } : undefined}
        >
          {eyebrow}
        </div>
      )}
      <Tag
        className={cn(
          "font-extrabold text-white",
          titleSize[size],
          gradient && "text-gradient"
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            "text-[var(--color-muted)] font-light mt-[var(--space-md)] max-w-[var(--container-prose)]",
            descSize[size]
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
