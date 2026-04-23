import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({ label, hint, children, className }: FormFieldProps) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium text-[#334155]">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-[#94A3B8]">{hint}</span> : null}
    </label>
  );
}
