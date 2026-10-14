import { PlatformNavigation } from "@/components/layouts/platform-navigation"

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <PlatformNavigation />
      <main className="container py-8 px-4">{children}</main>
    </div>
  )
}