"use client"

import { Navigation } from "@/components/layouts/navigation"
import { useMemo } from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center p-4">{children}</main>
      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
        &copy; {year} FE Base. All rights reserved.
      </footer>
    </div>
  )
}