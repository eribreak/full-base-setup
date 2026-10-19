import { cn } from "@/lib/utils"

export function CodeWindow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[460px] overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-black/10 dark:shadow-black/40",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-xs text-muted-foreground">components/hero.tsx</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed">
        <code>
          {`import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="gradient-mesh">
      <h1>Build full-stack apps faster</h1>
    </div>
  )
}`}
        </code>
      </pre>
    </div>
  )
}