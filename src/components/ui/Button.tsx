import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost"
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-brand text-brand-ink shadow-sm ring-1 ring-brand-ink/10 hover:brightness-95",
        variant === "ghost" &&
          "text-brand-ink/70 hover:bg-brand/10 dark:text-brand",
        className,
      )}
      {...props}
    />
  )
}
