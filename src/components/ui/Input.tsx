import type { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition",
        "placeholder:text-muted/60 focus:border-aqua focus:ring-2 focus:ring-aqua/25",
        className,
      )}
      {...props}
    />
  )
}
