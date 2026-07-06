import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost"
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-aqua text-aqua-ink shadow-sm hover:brightness-105 active:brightness-95",
        variant === "outline" && "border border-border text-ink hover:bg-surface-2",
        variant === "ghost" && "text-muted hover:bg-surface-2 hover:text-ink",
        className,
      )}
      {...props}
    />
  )
}
