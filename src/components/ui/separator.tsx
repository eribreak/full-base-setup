import * as React from "react"

import { cn } from "@/lib/utils"

function Separator({ className, orientation = "horizontal", decorative = true, ...props }: React.ComponentProps<"hr"> & { orientation?: "horizontal" | "vertical"; decorative?: boolean }) {
  return (
    <hr
      data-slot="separator"
      aria-orientation={orientation}
      aria-hidden={decorative}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full",
        className
      )}
      {...props}
    />
  )
}

export { Separator }