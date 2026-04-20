import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "accent";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DBEAFE] disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2563EB] text-white shadow-md shadow-blue-200/60 hover:bg-[#1D4ED8] hover:shadow-lg hover:shadow-blue-200/70",
  secondary:
    "border border-[#E2E8F0] bg-white text-[#334155] shadow-sm shadow-slate-200/50 hover:border-slate-300 hover:bg-slate-50",
  accent:
    "bg-[#F97316] text-white shadow-md shadow-orange-200/70 hover:bg-[#EA580C] hover:shadow-lg hover:shadow-orange-200/80"
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-4 py-2.5 text-sm"
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  leadingIcon,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonStyles(variant, size, className)} {...props}>
      {leadingIcon}
      {children}
    </button>
  );
}
