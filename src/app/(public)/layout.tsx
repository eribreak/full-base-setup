"use client"

import { Navigation } from "@/components/layouts/navigation"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
        &copy; 2025 FE Base. All rights reserved.
      </footer>
    </div>
  )
}