import type { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-teal-200/70 bg-white/80 px-3.5 py-2.5 text-sm outline-none transition",
        "placeholder:text-teal-900/40 focus:border-brand focus:ring-2 focus:ring-brand/30",
        "dark:border-teal-800/40 dark:bg-white/5 dark:text-teal-50 dark:placeholder:text-teal-100/30",
        className,
      )}
      {...props}
    />
  )
}
