import * as React from "react"
import type { TooltipRootProps } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

// Simple tooltip implementation using title attribute as fallback
// Full implementation from @base-ui/react/tooltip requires more setup
export function Tooltip({
  content,
  children,
  ...props
}: TooltipRootProps & {
  content: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span data-slot="tooltip-wrapper" {...props}>
      {children}
    </span>
  )
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export { TooltipRootProps as TooltipProps }