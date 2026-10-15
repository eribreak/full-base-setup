"use client";

import Link from "next/link";
import Image from "next/image";
import { CodeWindow } from "@/components/landing/code-window";
import { Button } from "@/components/ui/button";
import {
  GitBranch as Github,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Palette,
  Database,
  Terminal,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "App Router Ready",
    description: "Next.js 15 App Router with Server Components, streaming, and nested layouts out of the box.",
  },
  {
    icon: Shield,
    title: "TypeScript First",
    description: "Strict type checking, path aliases, and type-safe environment variables configured by default.",
  },
  {
    icon: Palette,
    title: "Tailwind + shadcn/ui",
    description: "Pre-configured design system with accessible components, dark mode, and CSS variables theming.",
  },
  {
    icon: Database,
    title: "TanStack Query",
    description: "React Query provider with devtools, optimistic updates, and server-state management ready to go.",
  },
  {
    icon: Terminal,
    title: "Developer Experience",
    description: "ESLint, Prettier, Husky, lint-staged, and commitlint configured with sensible defaults.",
  },
  {
    icon: Github,
    title: "CI/CD Pipeline",
    description: "GitHub Actions workflows for type-check, lint, test, and deploy on every push.",
  },
];

const stats = [
  { value: "15+", label: "Pre-built Components" },
  { value: "100%", label: "Type Coverage" },
  { value: "0", label: "Runtime Errors" },
  { value: "⚡", label: "Fast Refresh" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Animated Gradient Background */}
      <div className="mesh fixed inset-0 -z-10">
        <div className="mesh-blob a" aria-hidden="true" />
        <div className="mesh-blob b" aria-hidden="true" />
        <div className="mesh-blob c" aria-hidden="true" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/next.svg"
                alt="FE Base"
                width={32}
                height={32}
                className="dark:invert"
                priority
              />
              <span className="text-xl font-semibold text-foreground">FE Base</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <Github className="h-4 w-4" />
                Star
              </Link>
              <Button size="sm" className="gap-2">
                <Link href="#get-started" className="flex items-center gap-2">Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              <div className="fade-slide-up">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  <Zap className="h-3 w-3" aria-hidden="true" />
                  Production-ready Next.js starter
                </span>
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight fade-slide-up delay-1">
                Build full-stack apps
                <br />
                <span className="gradient-text">faster than ever</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl fade-slide-up delay-2">
                A modern Next.js 15 foundation with App Router, TypeScript, Tailwind CSS,
                shadcn/ui, TanStack Query, and best-in-class developer experience — so you
                can ship features, not configure tooling.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 fade-slide-up delay-3">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Link href="#get-started" className="flex items-center gap-2">Start Building
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">View on GitHub
                    <Github className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 fade-slide-up delay-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Code Window Demo */}
            <div className="relative fade-slide-up delay-2">
              <div className="aspect-[4/3] max-w-lg mx-auto">
                <CodeWindow />
              </div>
              {/* Floating feature badges */}
              <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8">
                <div className="flex flex-wrap gap-2">
                  {["App Router", "TypeScript", "Tailwind", "shadcn/ui", "React Query"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-card/90 backdrop-blur border border-border/60 text-sm font-medium text-foreground shadow-lg shadow-black/10 dark:shadow-black/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce fade-slide-up delay-5">
          <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Everything you need to
              <span className="gradient-text"> ship fast</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Batteries included — authentication, database, UI components, and deployment
              configs pre-configured for production workloads.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="group relative p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all duration-300 card-accent fade-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 right-0 m-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              See it in action
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Real components, real code. Copy-paste and start building.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Component Showcase */}
            <div className="space-y-6 fade-slide-up">
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Form Elements</h3>
                <div className="space-y-3 max-w-xs">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button className="w-full">Sign In</Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Dark Mode Ready</h3>
                <p className="text-muted-foreground mb-4">
                  Seamless light/dark mode with system detection and manual toggle.
                  All components adapt automatically.
                </p>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">Light</Button>
                  <Button variant="outline" size="sm">Dark</Button>
                  <Button variant="outline" size="sm">System</Button>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className="fade-slide-up delay-1">
              <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
                <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-xs text-muted-foreground">app/dashboard/page.tsx</span>
                </div>
                <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed"><code>{`import { Suspense } from "react";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentActivity } from "@/components/dashboard/activity";
import { RevenueChart } from "@/components/dashboard/charts";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>Export Report</Button>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid lg:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity />
        </Suspense>
      </div>
    </div>
  );
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="mesh relative z-0 rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 fade-slide-up">
              Ready to build your next project?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 mb-10 fade-slide-up delay-1">
              Clone the repo, install dependencies, and start coding in minutes.
              No configuration required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-slide-up delay-2">
              <Button size="lg" className="gap-2 bg-white text-black hover:bg-white/90 w-full sm:w-auto">
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="h-4 w-4" aria-hidden="true" />
                  Clone Repository
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                <Link href="#docs" className="flex items-center gap-2">Read Documentation
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-white/60 fade-slide-up delay-3">
              <kbd className="px-2 py-1 rounded bg-white/10 font-mono">git clone</kbd>{" "}
              <kbd className="px-2 py-1 rounded bg-white/10 font-mono">npm install</kbd>{" "}
              <kbd className="px-2 py-1 rounded bg-white/10 font-mono">npm run dev</kbd>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/next.svg" alt="FE Base" width={32} height={32} className="dark:invert" />
                <span className="text-xl font-semibold text-foreground">FE Base</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Production-ready Next.js starter with everything you need to build
                modern full-stack applications.
              </p>
            </div>
            <nav>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Components</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Templates</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </nav>
            <nav>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">GitHub</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Discord</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contributing</Link></li>
              </ul>
            </nav>
          </div>
          <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 FE Base. Built with Next.js 15.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">License</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}