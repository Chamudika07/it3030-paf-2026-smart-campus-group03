import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "section" | "div" | "form";
  children: ReactNode;
};

export function Card({ as = "div", children, className, ...props }: CardProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-md shadow-slate-200/60",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
