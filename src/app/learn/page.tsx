import Link from "next/link";

const people: {
  name: string;
  role: string;
  quote: string;
  how: string;
  color: string;
}[] = [
  {
    name: "Elon Musk",
    role: "Tesla, SpaceX, Neuralink",
    quote:
      "I think it's important to reason from first principles rather than by analogy. The normal way we conduct our lives is we reason by analogy. We are doing this because it's like something else that was done, or it is like what other people are doing. With first principles, you boil things down to the most fundamental truths and then reason up from there.",
    how: "When everyone said batteries were too expensive for electric cars, Musk didn't accept it. He broke down a battery to its raw materials — cobalt, nickel, lithium, carbon, separators, steel casing — and found the commodity cost was only $80/kWh on the London Metal Exchange. The rest was markup and convention. Tesla built the Gigafactory to assemble cells from raw materials, cutting costs by over 70%. The same thinking drove SpaceX: instead of accepting that rockets cost $60M, he asked what a rocket is actually made of (aluminum, titanium, copper, carbon fiber) and found the raw material cost was about 2% of the sticker price. So he built rockets in-house.",
    color: "text-sky-400",
  },
  {
    name: "Aristotle",
    role: "Philosopher, 384-322 BC",
    quote:
      "In every systematic inquiry where there are first principles, or causes, or elements, knowledge and science result from acquiring knowledge of these.",
    how: "Aristotle literally coined the concept over 2,300 years ago. He defined a first principle as \"the first basis from which a thing is known\" — the foundational proposition that cannot be deduced from any other proposition. Every field of science traces back to this idea: don't accept inherited explanations, find the bedrock truths yourself. His method was the origin of the scientific method itself.",
    color: "text-amber-400",
  },
  {
    name: "Steve Jobs",
    role: "Apple",
    quote:
      "It's really hard to design products by focus groups. A lot of times, people don't know what they want until you show it to them.",
    how: "When the music industry was collapsing under piracy, conventional thinking said to fight it with DRM and lawsuits. Jobs asked: what do people actually want? They want any song, instantly, for a fair price. That became iTunes — 99 cents a song, no subscription required. The same approach produced the iPhone. Everyone in mobile was optimizing physical keyboards. Jobs asked: what is a phone, fundamentally? A screen you interact with. So he removed every button except one.",
    color: "text-rose-400",
  },
  {
    name: "Jeff Bezos",
    role: "Amazon",
    quote:
      "I very frequently get the question: 'What's going to change in the next 10 years?' I almost never get the question: 'What's not going to change in the next 10 years?' And I submit to you that the second question is actually the more important of the two.",
    how: "Bezos built Amazon around truths that would never change: people will always want lower prices, faster delivery, and more selection. Every major Amazon bet — AWS, Prime, Fulfillment Centers, Marketplace — traces back to these unchanging fundamentals. When launching AWS, the conventional wisdom was that tech companies shouldn't sell infrastructure. Bezos asked: what do developers actually need? Compute and storage, on demand, without buying servers. That first principle created a $90B/year business.",
    color: "text-emerald-400",
  },
  {
    name: "James Dyson",
    role: "Dyson",
    quote:
      "I made 5,127 prototypes of my vacuum before I got it right. There were 5,126 failures. But I learned from each one.",
    how: "Every vacuum manufacturer accepted that bags were how vacuums worked. Dyson asked the fundamental question: what is a vacuum actually doing? Separating dirt from air. Do you need a bag for that? No — cyclonic separation (used in sawmills) does it better without clogging. The industry had been optimizing bags for decades when the real answer was to eliminate them entirely. The same first-principles approach led Dyson to replace fan blades with the Bladeless Fan — questioning the assumption that moving air requires visible blades.",
    color: "text-violet-400",
  },
  {
    name: "The Wright Brothers",
    role: "Aviation Pioneers",
    quote:
      "If we worked on the assumption that what is accepted as true really is true, then there would be little hope for advance.",
    how: "While competitors copied bird-like wing flapping or relied on existing lift tables (which were wrong), Wilbur and Orville built their own wind tunnel and tested 200+ wing shapes from scratch. They rejected Otto Lilienthal's widely-accepted aerodynamic data and generated their own. Their first-principles approach — questioning the established \"facts\" of flight — is why two bicycle mechanics beat teams of well-funded engineers.",
    color: "text-orange-400",
  },
  {
    name: "Charlie Munger",
    role: "Berkshire Hathaway",
    quote:
      "I think the best single thing you could do is to take all the big ideas from all the big disciplines and master them, so you have a general framework for thinking.",
    how: "Munger built his entire investment philosophy around what he calls \"mental models\" — first principles from physics, biology, psychology, and economics applied to business. Instead of following market trends or analyst reports, he asks: what are the fundamental economics of this business? What is the durable competitive advantage? This approach helped build Berkshire Hathaway into a $900B+ company by ignoring Wall Street consensus and reasoning from fundamentals.",
    color: "text-cyan-400",
  },
];

const principles: { title: string; description: string; color: string }[] = [
  {
    title: "Question every assumption",
    description:
      "Most ideas are built on top of assumptions inherited from existing products, industries, or \"common knowledge.\" First principles thinking means identifying those assumptions and asking: is this actually true, or did we just accept it?",
    color: "text-orange-400",
  },
  {
    title: "Find the fundamental truths",
    description:
      "Strip the problem down to its most basic, provable elements. What do we know to be absolutely true? Not \"what does the market say\" or \"what do competitors do\" — what are the physics-level facts about this problem?",
    color: "text-emerald-400",
  },
  {
    title: "Rebuild from the ground up",
    description:
      "Once you have the fundamentals, build your solution from scratch using only those truths as your foundation. The result often looks nothing like existing solutions — and that's the point.",
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
            The Method
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            First Principles Thinking
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            The most powerful problem-solving method in history. Used by the greatest inventors,
            entrepreneurs, and scientists to see what everyone else misses — by refusing to accept
            what everyone else assumes.
          </p>
        </section>

        {/* What is it */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              The Core Idea
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Stop reasoning by analogy. Start reasoning from truth.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm leading-relaxed text-zinc-400">
            <div className="space-y-4">
              <p>
                Most people solve problems by looking at what already exists and making a slightly
                different version. &quot;It&apos;s like Uber, but for dog walking.&quot; &quot;It&apos;s like Notion, but
                simpler.&quot; This is <strong className="text-zinc-200">reasoning by analogy</strong> — and
                it&apos;s why most products feel the same.
              </p>
              <p>
                First principles thinking is the opposite. Instead of starting with existing
                solutions, you start with the problem itself. You break it down to its most
                fundamental truths — the things that are provably, undeniably real — and build
                your solution from there.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                The result is often something nobody has seen before. Not because it&apos;s random
                or contrarian, but because it&apos;s built on truth instead of convention.
              </p>
              <p>
                This is the method that made batteries affordable, put rockets in space for 1/10th
                the cost, created the smartphone, and disrupted entire industries. It&apos;s not magic
                — it&apos;s discipline. The discipline to question what everyone else takes for granted.
              </p>
            </div>
          </div>
        </section>

        {/* The 4 steps */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              How It Works
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Four steps to seeing clearly
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {principles.map((p, i) => (
              <div
                key={i}
                className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-mono font-bold ${p.color}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${p.color}`}>
                    {p.title}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* People */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              Who Uses It
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              The builders who changed everything
            </h2>
            <p className="text-zinc-500 text-sm max-w-xl">
              First principles thinking isn&apos;t a Silicon Valley buzzword. It&apos;s a 2,300-year-old
              method used by the most consequential thinkers in history.
            </p>
          </div>
          <div className="space-y-4">
            {people.map((person, i) => (
              <div
                key={i}
                className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`text-lg font-bold ${person.color}`}>{person.name}</h3>
                    <p className="text-zinc-600 text-xs font-mono mt-0.5">{person.role}</p>
                  </div>
                </div>
                <blockquote className="border-l-2 border-zinc-700 pl-4 text-zinc-500 text-sm italic leading-relaxed">
                  &quot;{person.quote.replace(/^"|"$/g, "")}&quot;
                </blockquote>
                <div className="space-y-1.5">
                  <p className={`text-[10px] font-mono uppercase tracking-widest ${person.color}`}>
                    How they used it
                  </p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{person.how}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Analogy vs First Principles */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
              The Difference
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Analogy thinking vs. First principles
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                analogy: "\"Batteries are expensive because they've always been expensive.\"",
                fp: "\"What are batteries made of? What do those materials cost? Why is there a gap?\"",
              },
              {
                analogy: "\"Phones need keyboards because all phones have keyboards.\"",
                fp: "\"What is a phone for? Making calls and accessing information. What's the best interface for that?\"",
              },
              {
                analogy: "\"Rockets are disposable because that's how the industry works.\"",
                fp: "\"Is there a physical law that says a rocket can't land and fly again? No? Then let's land it.\"",
              },
              {
                analogy: "\"Vacuums need bags because that's what vacuums use.\"",
                fp: "\"What's the goal? Separate dirt from air. What's the best way to do that, ignoring all existing products?\"",
              },
              {
                analogy: "\"People want a faster horse.\"",
                fp: "\"People want to get from A to B quickly and comfortably. What's the best way to do that?\"",
              },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-zinc-800/30 border border-zinc-700/40 rounded-lg p-3">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">
                    By analogy
                  </p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{row.analogy}</p>
                </div>
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-3">
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
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Ready to strip your idea to its core?
          </h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Barebone applies first principles thinking to your idea automatically. Put in a rough
            concept, get back its fundamental truths — and what you should actually build.
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
