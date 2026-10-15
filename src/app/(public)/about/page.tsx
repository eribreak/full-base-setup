import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  const techStack = [
    { name: "Next.js", version: "16.4.0", category: "Framework" },
    { name: "React", version: "19.3.0", category: "Library" },
    { name: "TypeScript", version: "5.9.3", category: "Language" },
    { name: "Tailwind CSS", version: "4.3.3", category: "Styling" },
    { name: "shadcn/ui", version: "base-nova", category: "UI" },
    { name: "TanStack Query", version: "5.104.2", category: "State" },
    { name: "Axios", version: "1.20.0", category: "HTTP" },
    { name: "React Hook Form", version: "7.90.0", category: "Forms" },
    { name: "Zod", version: "4.6.7", category: "Validation" },
    { name: "Lucide React", version: "1.56.0", category: "Icons" },
  ]

  return (
    <div className="container py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">About FE Base</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A minimal, production-ready frontend base for building full-stack web applications.
            Built with modern tooling and best practices.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Architecture</h2>
            <p className="mt-2 text-muted-foreground">
              FE Base follows a clean architecture separating concerns:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li><strong>app/</strong> — Routing, layouts, and entry points (Server Components by default)</li>
              <li><strong>components/ui/</strong> — Reusable UI components (shadcn/ui)</li>
              <li><strong>components/layouts/</strong> — Layout components (navigation, sidebar, etc.)</li>
              <li><strong>features/</strong> — Business logic organized by domain (auth, etc.)</li>
              <li><strong>lib/api/</strong> — HTTP client abstraction (browser + server clients)</li>
              <li><strong>lib/env/</strong> — Environment validation</li>
              <li><strong>providers/</strong> — Client providers (TanStack Query, Theme)</li>
              <li><strong>hooks/</strong> — Shared React hooks</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold">Tech Stack</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {techStack.map((tech) => (
                <Card key={tech.name} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-muted-foreground">{tech.version}</p>
                    </div>
                    <Badge variant="secondary">{tech.category}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold">Route Groups</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li><code>(public)</code> — Public pages (home, about) with shared navigation</li>
              <li><code>(auth)</code> — Authentication pages (login, register, password reset)</li>
              <li><code>(platform)</code> — Protected dashboard area (dashboard, profile, settings)</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Route groups use parentheses <code>(...)</code> so they don&apos;t appear in URLs.
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold">Not Yet Implemented (v1)</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Production authentication (Auth.js, Better Auth, Clerk, etc.)</li>
              <li>Backend API integration (awaiting backend decision)</li>
              <li>Database layer (Prisma, Drizzle, etc.)</li>
              <li>Testing suite (Vitest, Testing Library, Playwright)</li>
              <li>CI/CD pipeline (GitHub Actions)</li>
              <li>Advanced data tables with server-side pagination</li>
              <li>Internationalization (i18n)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}