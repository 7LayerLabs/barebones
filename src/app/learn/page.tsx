import Link from "next/link";

const principles: { title: string; description: string; color: string }[] = [
  {
    title: "Question every assumption",
    description:
      "Most ideas are built on top of assumptions inherited from existing products, industries, or \"common knowledge.\" First principles theory means identifying those assumptions and asking: is this actually true, or did we just accept it?",
    color: "text-orange-400",
  },
  {
    title: "Find the fundamental truths",
    description:
      "Strip the problem down to its most basic, provable elements. What do we know to be absolutely true? Not \"what does the market say\" or \"what do competitors do,\" but the physics-level facts about this problem.",
    color: "text-emerald-400",
  },
  {
    title: "Rebuild from the ground up",
    description:
      "Once you have the fundamentals, build your solution from scratch using only those truths as your foundation. The result often looks nothing like existing solutions. That's the point.",
    color: "text-blue-400",
  },
  {
    title: "Reason up, not by analogy",
    description:
      "Reasoning by analogy means copying patterns: \"Uber for X\" or \"Airbnb for Y.\" Reasoning from first principles means asking what X actually needs and building the right solution, even if it has no precedent.",
    color: "text-indigo-400",
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#09090b]">
      {/* Header */}
      <header className="border-b border-zinc-800/80 px-4 sm:px-6 py-3.5 backdrop-blur-sm bg-[#09090b]/80 sticky top-0 z-10">
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

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-5 py-8 sm:py-12 space-y-12 sm:space-y-20">
        {/* Hero */}
        <section className="space-y-3 sm:space-y-4 max-w-2xl">
          <p className="text-amber-400 text-[11px] font-mono uppercase tracking-widest font-bold">
            The Theory
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            First Principles Theory
          </h1>
          <p className="text-zinc-400 text-sm sm:text-lg leading-relaxed">
            A 2,300-year-old method for seeing what everyone else misses.
            Not a framework. Not a buzzword. A discipline: refuse what everyone
            else assumes and reason from what is provably true.
          </p>
        </section>

        {/* What is it */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-amber-400 text-[11px] font-mono uppercase tracking-widest font-bold">
              The Core Idea
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Stop reasoning by analogy. Start reasoning from truth.
            </h2>
          </div>
          <div className="max-w-2xl space-y-4 text-sm sm:text-[15px] leading-relaxed text-zinc-400">
            <p>
              Most people solve problems by looking at what already exists and making a slightly
              different version. &quot;It&apos;s like Uber, but for dog walking.&quot; &quot;It&apos;s like Notion, but
              simpler.&quot; This is <strong className="text-zinc-200">reasoning by analogy</strong>,
              and it&apos;s why most products feel the same.
            </p>
            <p>
              First principles theory is the opposite. Instead of starting with existing
              solutions, you start with the problem itself. You break it down to its most
              fundamental truths, the things that are provably, undeniably real, and build
              your solution from there.
            </p>
            <p>
              The result is often something nobody has seen before. Not because it&apos;s random
              or contrarian, but because it&apos;s built on truth instead of convention.
            </p>
            <p>
              The concept was defined by Aristotle over 2,300 years ago and has been
              applied by scientists, engineers, and entrepreneurs ever since. Today, it&apos;s
              most visibly championed by Elon Musk, who credits it as the foundation
              behind Tesla, SpaceX, and every company he&apos;s built.
            </p>
          </div>
        </section>

        {/* Why Now */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-amber-400 text-[11px] font-mono uppercase tracking-widest font-bold">
              Why Now
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Everyone can build. Not everyone builds the right thing.
            </h2>
          </div>
          <div className="bg-gradient-to-br from-indigo-950/30 to-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 sm:p-6 space-y-4">
            <p className="text-zinc-300 text-sm sm:text-[15px] leading-relaxed">
              AI and vibecoding have collapsed the barrier to building. Anyone can ship a product now.
              That&apos;s incredible. But it also means the market is about to be flooded with thousands
              of projects that look and feel the same, because most people build by analogy.
            </p>
            <p className="text-zinc-400 text-sm sm:text-[15px] leading-relaxed">
              &quot;It&apos;s like Notion but for X.&quot; &quot;It&apos;s ChatGPT but for Y.&quot; When everyone has
              the same tools, the only differentiator is <strong className="text-zinc-200">what</strong> you
              build, not whether you can build it. First principles theory forces you to find what
              makes your idea fundamentally different, not just a slightly better copy of something
              that already exists.
            </p>
            <p className="text-zinc-400 text-sm sm:text-[15px] leading-relaxed">
              That&apos;s why Barebone exists. Before you write a single line of code, break your idea
              down to its core truths. The projects that survive won&apos;t be the ones that shipped
              fastest. They&apos;ll be the ones that were built on something real.
            </p>
          </div>
        </section>

        {/* The 4 steps */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-amber-400 text-[11px] font-mono uppercase tracking-widest font-bold">
              How It Works
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Four steps to seeing clearly
            </h2>
          </div>
          <div className="space-y-4">
            {principles.map((p, i) => (
              <div
                key={i}
                className="flex gap-4 sm:gap-5 items-start"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center justify-center">
                  <span className={`text-sm font-mono font-bold ${p.color}`}>
                    {i + 1}
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <h3 className={`text-base font-semibold ${p.color}`}>
                    {p.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Origin — Aristotle */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-amber-400 text-[11px] font-mono uppercase tracking-widest font-bold">
              The Origin
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Aristotle defined it 2,300 years ago
            </h2>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 sm:p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-amber-400">Aristotle</h3>
              <p className="text-zinc-600 text-xs font-mono mt-0.5">Philosopher, 384&ndash;322 BC</p>
            </div>
            <blockquote className="border-l-2 border-zinc-700 pl-4 text-zinc-500 text-sm italic leading-relaxed">
              &quot;In every systematic inquiry where there are first principles, or causes, or elements,
              knowledge and science result from acquiring knowledge of these.&quot;
            </blockquote>
            <p className="text-zinc-400 text-sm leading-relaxed">
              In his work <em className="text-zinc-300">Physics</em>, Aristotle defined a first principle as
              &quot;the first basis from which a thing is known,&quot; the foundational truth that cannot be
              deduced from any other proposition. He argued that real understanding only comes from
              identifying these bedrock truths, not from accepting inherited explanations. This idea
              became the foundation of the scientific method itself: don&apos;t trust convention, find
              what&apos;s actually true, and build from there.
            </p>
          </div>
        </section>

        {/* Modern Champion — Elon Musk */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-amber-400 text-[11px] font-mono uppercase tracking-widest font-bold">
              The Modern Champion
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Elon Musk built his entire empire on it
            </h2>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 sm:p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-sky-400">Elon Musk</h3>
              <p className="text-zinc-600 text-xs font-mono mt-0.5">Tesla, SpaceX, Neuralink</p>
            </div>
            <blockquote className="border-l-2 border-zinc-700 pl-4 text-zinc-500 text-sm italic leading-relaxed">
              &quot;I think it&apos;s important to reason from first principles rather than by analogy.
              The normal way we conduct our lives is we reason by analogy. We are doing this because
              it&apos;s like something else that was done, or it is like what other people are doing.
              With first principles, you boil things down to the most fundamental truths and then
              reason up from there.&quot;
            </blockquote>
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              Source: TED Talk with Chris Anderson, 2013
            </p>

            <div className="space-y-4">
              <div className="bg-sky-500/5 border border-sky-500/15 rounded-lg p-3 sm:p-4 space-y-2">
                <p className="text-sky-400 text-xs font-mono font-bold uppercase tracking-widest">Tesla — Batteries</p>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  When the entire industry said batteries were too expensive for electric cars to be viable,
                  Musk didn&apos;t accept it. In a 2012 interview with Kevin Rose, he described breaking a battery
                  down to its raw materials (cobalt, nickel, lithium, carbon, separators, steel casing) and
                  checking their commodity prices on the London Metal Exchange. The materials cost roughly $80
                  per kWh. The rest was markup and convention. Tesla built the Gigafactory to assemble cells
                  directly from raw materials, dramatically reducing costs.
                </p>
              </div>

              <div className="bg-sky-500/5 border border-sky-500/15 rounded-lg p-3 sm:p-4 space-y-2">
                <p className="text-sky-400 text-xs font-mono font-bold uppercase tracking-widest">SpaceX — Rockets</p>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Instead of accepting that launching a rocket costs $65 million (the industry standard at the
                  time), Musk asked what a rocket is actually made of. Aerospace-grade aluminum alloys, titanium,
                  copper, carbon fiber. He calculated the raw material cost was roughly 2% of the price of a
                  finished rocket. The other 98% was inefficiency, middlemen, and convention. So SpaceX built
                  rockets in-house and made them reusable, something the industry said was impossible.
                </p>
              </div>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed">
              Musk has consistently cited first principles theory as the single most important
              framework behind every company he&apos;s built. Not market research, not competitive
              analysis, not trend-following. Strip a problem to its provable truths and
              rebuilding from there.
            </p>
          </div>
        </section>

        {/* Analogy vs First Principles */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-amber-400 text-[11px] font-mono uppercase tracking-widest font-bold">
              The Difference
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Analogy vs. First principles
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                analogy: "\"Batteries are expensive because they've always been expensive.\"",
                fp: "\"What are batteries made of? What do those materials cost? Why is there a gap?\"",
              },
              {
                analogy: "\"Rockets are disposable because that's how the industry works.\"",
                fp: "\"Is there a physical law that says a rocket can't land and fly again? No? Then let's land it.\"",
              },
              {
                analogy: "\"We need a better taxi app.\"",
                fp: "\"People need to get from A to B reliably. What's the actual constraint? Supply of drivers. Solve that.\"",
              },
              {
                analogy: "\"Our product needs more features to compete.\"",
                fp: "\"What does the user actually need to accomplish? Strip everything else away.\"",
              },
            ].map((row, i) => (
              <div key={i} className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2">
                <div className="bg-zinc-800/30 border border-zinc-700/40 rounded-lg p-3 sm:p-3">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">
                    By analogy
                  </p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{row.analogy}</p>
                </div>
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-3 sm:p-3">
                  <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-1.5">
                    First principles
                  </p>
                  <p className="text-zinc-300 text-sm leading-relaxed">{row.fp}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-5 py-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Ready to strip your idea to its core?
          </h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Barebone is based on first principles theory, applied to your idea automatically. Put in a rough
            concept, get back its fundamental truths and what you should actually build.
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
