import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type BadgeTone = "blue" | "orange" | "neutral" | "success" | "danger";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const toneStyles: Record<BadgeTone, string> = {
  blue: "bg-[#DBEAFE] text-[#1D4ED8]",
  orange: "bg-[#FFEDD5] text-[#EA580C]",
  neutral: "bg-slate-100 text-[#334155]",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-rose-100 text-rose-700"
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
