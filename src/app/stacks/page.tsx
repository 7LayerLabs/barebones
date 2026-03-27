import Link from "next/link";

const databases: {
  name: string;
  tagline: string;
  bestFor: string[];
  notIdealFor: string[];
  color: string;
  features: string[];
}[] = [
  {
    name: "Supabase",
    tagline: "Postgres + Auth + Realtime + Storage in one platform",
    bestFor: [
      "CRUD apps with auth (SaaS, dashboards, admin panels)",
      "Apps that need row-level security out of the box",
      "Teams familiar with SQL / Postgres",
      "MVPs that need auth, storage, and a database fast",
    ],
    notIdealFor: [
      "Offline-first or local-first apps",
      "Complex real-time collaboration (like Figma)",
      "Apps with heavy relational joins at scale",
    ],
    color: "emerald",
    features: ["PostgreSQL", "Auth (email, OAuth, magic link)", "Realtime subscriptions", "Edge Functions", "Storage (S3-compatible)", "Row-level security"],
  },
  {
    name: "Convex",
    tagline: "Reactive backend — real-time by default, zero config",
    bestFor: [
      "Real-time apps (chat, dashboards, collaborative tools)",
      "Apps where data changes frequently and UI must update instantly",
      "Developers who want to skip writing API routes entirely",
      "Multiplayer or multi-user features",
    ],
    notIdealFor: [
      "Simple static sites or blogs",
      "Apps with complex SQL queries or reporting",
      "Teams that want full control over their database",
    ],
    color: "orange",
    features: ["Reactive queries (auto-updating UI)", "Server functions (no API layer)", "Built-in scheduling & cron", "File storage", "Full-text search", "TypeScript end-to-end"],
  },
  {
    name: "InstantDB",
    tagline: "Local-first sync engine — offline by default, multiplayer ready",
    bestFor: [
      "Offline-first apps (field tools, note-taking, mobile)",
      "Apps that need instant UI with zero latency",
      "Real-time collaboration without conflict resolution headaches",
      "Local-first philosophy (data lives on device first)",
    ],
    notIdealFor: [
      "Server-heavy logic or complex backend workflows",
      "Apps with strict relational data models",
      "Teams not ready to adopt a newer paradigm",
    ],
    color: "violet",
    features: ["Instant local reads (no loading states)", "Automatic sync & conflict resolution", "Multiplayer out of the box", "Graph-based queries", "Optimistic updates by default", "Permissions system"],
  },
  {
    name: "Firebase / Firestore",
    tagline: "Google's BaaS — fast to start, scales automatically",
    bestFor: [
      "Mobile apps and quick prototypes",
      "Apps already in the Google Cloud ecosystem",
      "Simple CRUD with real-time listeners",
      "Teams that want managed hosting + CDN included",
    ],
    notIdealFor: [
      "Complex queries or joins (NoSQL limitations)",
      "Apps where cost predictability matters at scale",
      "Migrating away later (vendor lock-in)",
    ],
    color: "amber",
    features: ["NoSQL document database", "Real-time listeners", "Auth (email, phone, OAuth)", "Cloud Functions", "Hosting + CDN", "Analytics & Crashlytics"],
  },
  {
    name: "Drizzle + SQLite / Turso",
    tagline: "Lightweight, edge-ready SQL — own your data layer",
    bestFor: [
      "Performance-critical apps at the edge",
      "Developers who want full SQL control with type safety",
      "Embedded databases (Electron, mobile, serverless)",
      "Cost-sensitive projects (SQLite is free)",
    ],
    notIdealFor: [
      "Apps needing built-in auth or real-time out of the box",
      "Teams that want a full BaaS platform",
      "Complex multi-region sync requirements",
    ],
    color: "sky",
    features: ["Type-safe SQL queries", "Edge-compatible (Turso)", "Zero dependencies (SQLite)", "Migrations built-in", "Works with any framework", "Extremely fast reads"],
  },
];

const frameworks: {
  name: string;
  tagline: string;
  bestFor: string[];
  notIdealFor: string[];
  color: string;
}[] = [
  {
    name: "Next.js + React",
    tagline: "The default for most web apps — huge ecosystem, proven at scale",
    bestFor: [
      "SaaS products, dashboards, marketing sites",
      "Apps that need SSR, SSG, and API routes",
      "Teams hiring (largest talent pool)",
      "Complex state management and rich interactivity",
    ],
    notIdealFor: [
      "Simple static pages (overkill)",
      "When bundle size is critical",
    ],
    color: "blue",
  },
  {
    name: "SvelteKit + Svelte",
    tagline: "Less code, faster output — compiles away the framework",
    bestFor: [
      "Performance-focused apps where bundle size matters",
      "Solo developers or small teams (less boilerplate)",
      "Interactive data visualizations and animations",
      "Developers tired of React's complexity",
    ],
    notIdealFor: [
      "Large teams (smaller hiring pool)",
      "Projects needing extensive third-party component libraries",
    ],
    color: "orange",
  },
  {
    name: "HTMX + Server Templates",
    tagline: "Lightweight hypermedia — HTML over the wire, minimal JS",
    bestFor: [
      "Content-heavy sites with simple interactions",
      "CRUD apps with mostly server-side logic",
      "Teams from backend backgrounds (Rails, Django, Go)",
      "When you want zero build step and zero JS framework",
    ],
    notIdealFor: [
      "Complex client-side state (drag-drop, real-time collaboration)",
      "Rich interactive UIs (dashboards, design tools)",
      "Apps requiring offline support",
    ],
    color: "cyan",
  },
  {
    name: "Astro",
    tagline: "Content-first framework — ships zero JS by default",
    bestFor: [
      "Marketing sites, blogs, documentation",
      "Content-heavy pages that need to be fast",
      "When you want to use React/Svelte/Vue components but ship less JS",
      "SEO-critical sites",
    ],
    notIdealFor: [
      "Highly interactive web apps",
      "Real-time features",
      "Complex client-side state management",
    ],
    color: "purple",
  },
];

const uiLibraries: {
  name: string;
  tagline: string;
  bestFor: string[];
  color: string;
}[] = [
  {
    name: "shadcn/ui + Tailwind",
    tagline: "Copy-paste components — you own the code, fully customizable",
    bestFor: [
      "Production apps that need polished, accessible UI fast",
      "Teams that want design consistency without a custom system",
      "React/Next.js projects",
      "Developers who want to own their components (not depend on a package)",
    ],
    color: "zinc",
  },
  {
    name: "Tailwind CSS (alone)",
    tagline: "Utility-first CSS — rapid prototyping, no class naming",
    bestFor: [
      "Any framework (React, Svelte, Vue, vanilla HTML)",
      "Custom designs that don't fit pre-built component libraries",
      "Rapid iteration and prototyping",
      "Teams that prefer styling in markup",
    ],
    color: "sky",
  },
  {
    name: "Radix UI + Tailwind",
    tagline: "Unstyled, accessible primitives — build your own design system",
    bestFor: [
      "Apps with a custom design language",
      "Teams building their own component library",
      "When accessibility is non-negotiable",
      "Complex UI patterns (modals, dropdowns, tooltips)",
    ],
    color: "violet",
  },
];

const colorMap: Record<string, { accent: string; border: string; bg: string; label: string }> = {
  emerald: { accent: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5", label: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  orange: { accent: "text-orange-400", border: "border-orange-500/20", bg: "bg-orange-500/5", label: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  violet: { accent: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5", label: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  amber: { accent: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5", label: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  sky: { accent: "text-sky-400", border: "border-sky-500/20", bg: "bg-sky-500/5", label: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  blue: { accent: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5", label: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  cyan: { accent: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/5", label: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  purple: { accent: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/5", label: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  zinc: { accent: "text-zinc-300", border: "border-zinc-700/40", bg: "bg-zinc-800/30", label: "bg-zinc-800/50 text-zinc-300 border-zinc-700/40" },
};

function StackCard({
  name,
  tagline,
  bestFor,
  notIdealFor,
  color,
  features,
}: {
  name: string;
  tagline: string;
  bestFor: string[];
  notIdealFor?: string[];
  color: string;
  features?: string[];
}) {
  const c = colorMap[color] || colorMap.zinc;
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-5 space-y-4`}>
      <div>
        <h3 className={`text-lg font-bold ${c.accent}`}>{name}</h3>
        <p className="text-zinc-500 text-sm mt-1">{tagline}</p>
      </div>

      {features && (
        <div className="flex flex-wrap gap-1.5">
          {features.map((f) => (
            <span
              key={f}
              className={`px-2 py-0.5 text-[10px] font-mono rounded-md border ${c.label}`}
            >
              {f}
            </span>
          ))}
        </div>
      )}

      <div>
        <p className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${c.accent}`}>
          Best for
        </p>
        <ul className="space-y-1.5">
          {bestFor.map((item, i) => (
            <li key={i} className="flex gap-2 items-start text-sm text-zinc-300">
              <svg width="12" height="12" viewBox="0 0 12 12" className={`mt-1 flex-shrink-0 ${c.accent}`}>
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {notIdealFor && (
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest mb-2 text-zinc-600">
            Not ideal for
          </p>
          <ul className="space-y-1.5">
            {notIdealFor.map((item, i) => (
              <li key={i} className="flex gap-2 items-start text-sm text-zinc-500">
                <svg width="12" height="12" viewBox="0 0 12 12" className="mt-1 flex-shrink-0 text-zinc-600">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function StacksPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#09090b]">
      {/* Header */}
      <header className="border-b border-zinc-800/80 px-6 py-3.5 backdrop-blur-sm bg-[#09090b]/80 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L1 13h12L7 1z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <line x1="7" y1="5" x2="7" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-200">barebone</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Back to tool
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto w-full px-5 py-12 space-y-20">
        {/* Hero */}
        <section className="space-y-4 max-w-2xl">
          <p className="text-indigo-400 text-xs font-mono uppercase tracking-widest">
            Tech Stacks
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            Pick the right tools for what you&apos;re building.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Not every project needs the same stack. A real-time multiplayer app has no business on HTMX.
            A landing page with a waitlist doesn&apos;t need Convex. Here&apos;s when to use what.
          </p>
        </section>

        {/* Quick Decision Guide */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              Quick Guide
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              What are you building?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { use: "SaaS / Dashboard / Admin Panel", stack: "Next.js + Supabase + shadcn/ui", color: "emerald" },
              { use: "Real-time App (chat, collab, live data)", stack: "Next.js + Convex or InstantDB", color: "orange" },
              { use: "Offline-first / Local-first App", stack: "React + InstantDB or SQLite", color: "violet" },
              { use: "Marketing Site / Blog / Docs", stack: "Astro + Tailwind (or Next.js for complex)", color: "purple" },
              { use: "Simple CRUD with Server Logic", stack: "HTMX + Go/Rails/Django or Next.js + Supabase", color: "cyan" },
              { use: "Mobile App with Web Backend", stack: "React Native + Supabase or Convex", color: "sky" },
              { use: "MVP / Quick Prototype", stack: "Next.js + Supabase + shadcn/ui + Vercel", color: "blue" },
              { use: "Edge-first / Performance Critical", stack: "SvelteKit + Drizzle + Turso", color: "amber" },
            ].map((item) => {
              const c = colorMap[item.color] || colorMap.zinc;
              return (
                <div key={item.use} className={`${c.bg} border ${c.border} rounded-xl p-4`}>
                  <p className="text-zinc-200 text-sm font-medium">{item.use}</p>
                  <p className={`text-xs mt-1.5 font-mono ${c.accent}`}>{item.stack}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Databases */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              Data Layer
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Databases & Backend Services
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl">
              Your data layer is the most important decision. It determines your auth story, real-time capabilities,
              and how much backend code you write.
            </p>
          </div>
          <div className="space-y-4">
            {databases.map((db) => (
              <StackCard
                key={db.name}
                name={db.name}
                tagline={db.tagline}
                bestFor={db.bestFor}
                notIdealFor={db.notIdealFor}
                color={db.color}
                features={db.features}
              />
            ))}
          </div>
        </section>

        {/* Frameworks */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              Framework
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Frontend & Full-Stack Frameworks
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl">
              Most vibecoding projects use React + TypeScript. But the right framework depends on what
              you&apos;re building and how much JS your users need.
            </p>
          </div>
          <div className="space-y-4">
            {frameworks.map((fw) => (
              <StackCard
                key={fw.name}
                name={fw.name}
                tagline={fw.tagline}
                bestFor={fw.bestFor}
                notIdealFor={fw.notIdealFor}
                color={fw.color}
              />
            ))}
          </div>
        </section>

        {/* UI Libraries */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              UI Layer
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Component Libraries & Styling
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl">
              Your UI layer determines how fast you can ship polished interfaces.
              For most projects, shadcn/ui + Tailwind is the meta.
            </p>
          </div>
          <div className="space-y-4">
            {uiLibraries.map((lib) => (
              <StackCard
                key={lib.name}
                name={lib.name}
                tagline={lib.tagline}
                bestFor={lib.bestFor}
                color={lib.color}
              />
            ))}
          </div>
        </section>

        {/* The Meta Stack */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              The Default
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              When in doubt, ship with this
            </h2>
          </div>
          <div className="bg-gradient-to-br from-indigo-950/40 to-indigo-900/20 border border-indigo-500/20 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Framework", value: "Next.js" },
                { label: "Database", value: "Supabase" },
                { label: "UI", value: "shadcn/ui" },
                { label: "Deploy", value: "Vercel" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-[10px] font-mono text-indigo-400/60 uppercase tracking-widest">{item.label}</p>
                  <p className="text-indigo-200 font-semibold mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              This is the most common stack in the vibecoding ecosystem for good reason: fast to start,
              scales well, massive community, and every AI coding tool knows it inside out. If you&apos;re
              building a SaaS, dashboard, or any standard web app — start here and only deviate with a reason.
            </p>
            <div className="mt-4 pt-4 border-t border-indigo-500/10">
              <p className="text-zinc-500 text-sm leading-relaxed">
                But defaults aren&apos;t always right. When you run your idea through{" "}
                <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Barebone
                </Link>
                , you get a tech stack recommendation built specifically for what your product actually needs — not
                what&apos;s popular. If your app needs real-time sync, offline support, or edge performance, the
                default stack isn&apos;t it, and Barebone will tell you exactly why.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-5 py-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Ready to decompose your idea?
          </h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Barebone will analyze your idea with first principles and recommend the right
            tech stack based on what you&apos;re actually building.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-xl transition-colors text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L1 13h12L7 1z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
              <line x1="7" y1="5" x2="7" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Try Barebone
          </Link>
        </section>
      </div>
    </main>
  );
}
