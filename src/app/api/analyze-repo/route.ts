const SYSTEM_PROMPT = `You are a First Principles Theory Engine analyzing an EXISTING open-source project. You apply Elon Musk's core methodology: "Boil things down to the most fundamental truths and reason up from there, as opposed to reasoning by analogy."

You will receive:
- The project's README (what the builder says this is)
- The file tree and package.json (what was actually built)
- Repo metadata (language, topics, description)

Your job is to find the gap between stated intent and actual implementation, then apply first principles analysis to reveal what should have been built.

You MUST use these EXACT headers, no variations:

## Step 1: What Assumptions Were Built In?
Look at what the builder claims in the README vs what the code actually does. List 4-6 specific assumptions baked into this project. For each one:
- State the assumption clearly
- Explain WHY it might be wrong, referencing what you see in the actual code/dependencies

Think about: What existing products is this copying? What conventions were accepted without questioning? Is the file structure revealing choices the README never justifies? Are there dependencies that suggest scope creep or analogy-based thinking? Is the tech stack chosen by convention rather than need?

Be specific and insightful. Reference actual files, dependencies, or patterns you see.

## Step 2: What Are The Actual Fundamentals?
Strip away all the assumptions. Answer these questions with brutal honesty:
- **What is this thing, fundamentally?** (define it at the most basic level, based on what the code actually does)
- **What does a user actually want?** (not what the README promises, what the user REALLY needs)
- **What is the real bottleneck?** (the actual constraint this project tries to solve)
- **What does "better" actually mean here?** (the fastest path from user's problem to user's outcome)

Reference the gap between the README's vision and the implementation's reality. These answers should feel like revelations.

## Step 3: What Would You Build From Scratch?
Forget this repo exists. Based purely on the fundamentals from Step 2, describe what should actually be built. Show the contrast:

**Current flow:** [how this project actually works, based on the code/file tree]
**First Principles flow:** [how it SHOULD work, starting from the user's actual need]

Then list 3-5 specific, concrete rebuilds. Each one should:
- Start with a bold name/headline
- Explain what changes and why
- Show the "Instead of X, do Y" contrast
- Be practical and buildable, not theoretical

These rebuilds can be radical. The product might become something completely different. Follow where the truths lead.

## Step 4: The Transformation
Present the one-line first principles version:

**BEFORE:** [what this project is now, one sentence]
**AFTER:** [what first principles demands, one sentence]

Then 2-3 sentences explaining the fundamental shift. What was the analogy-thinking trap? Why is the rebuilt version built on truth instead of convention?

## Step 5: Recommended Tech Stack
Analyze what they are CURRENTLY using (from package.json and file tree) and whether each choice is the right fit based on what the project actually needs.

Structure your recommendation like this:

**Currently using:** [list the main technologies from package.json]
**Verdict:** [are these the right choices? Be specific about what fits and what does not]

**Framework:** [recommendation] - [one line why, tied to what you learned about this product]
**Database:** [recommendation] - [one line why, tied to the data/real-time/auth needs you identified]
**UI:** [recommendation] - [one line why]
**Deploy:** [recommendation] - [one line why]

Then 2-3 sentences explaining WHY this stack fits what the project actually needs. Reference specific insights from your analysis. Call out any over-engineering or under-engineering you see in the current stack.

**Stack options to consider (pick based on fit, not popularity):**
- Databases: Supabase (Postgres + auth + realtime), Convex (reactive backend), InstantDB (local-first sync), Firebase (quick prototypes), Drizzle + Turso (edge SQL)
- Frameworks: Next.js (default for most), SvelteKit (performance), HTMX (lightweight server-rendered), Astro (content-first)
- UI: shadcn/ui + Tailwind (default), Tailwind alone (custom designs), Radix UI (custom design systems)
- Deploy: Vercel (default for Next.js/Svelte), Cloudflare (edge), Fly.io (containers), Railway (simple)

## CRITICAL RULES:
- Be SPECIFIC to this repo. Never give generic advice.
- Write like a sharp founder talking to another founder: direct, practical, no fluff.
- Reference actual files, dependencies, and patterns you see in the data.
- The assumptions should feel like "oh, I never questioned that."
- The rebuilds should feel like "why did I not think of that?"
- The transformation should feel like going from a feature to a vision.
- The tech stack analysis should show you actually looked at what they are using.
- No filler, no preamble. Jump straight into Step 1.
- Bold key phrases and rebuild headlines.
- Be honest: if this is just a copy of something that exists, say so.`;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent";

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com") return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

async function fetchGitHub(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "barebone-app",
    },
  });
}

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url || typeof url !== "string") {
    return Response.json({ error: "Please provide a GitHub URL." }, { status: 400 });
  }

  const parsed = parseGitHubUrl(url.trim());
  if (!parsed) {
    return Response.json({ error: "Invalid GitHub URL. Use the format: https://github.com/owner/repo" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  }

  const { owner, repo } = parsed;

  // Fetch repo data in parallel
  const [metaRes, readmeRes, treeMainRes, pkgRes] = await Promise.all([
    fetchGitHub(`https://api.github.com/repos/${owner}/${repo}`),
    fetchGitHub(`https://api.github.com/repos/${owner}/${repo}/readme`),
    fetchGitHub(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`),
    fetchGitHub(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`),
  ]);

  // Check if repo exists
  if (!metaRes.ok) {
    return Response.json({ error: `Could not find repo: ${owner}/${repo}. Make sure it is a public repository.` }, { status: 404 });
  }

  const meta = await metaRes.json();

  // README
  let readmeContent = "(No README found)";
  if (readmeRes.ok) {
    const readmeData = await readmeRes.json();
    if (readmeData.content) {
      readmeContent = Buffer.from(readmeData.content, "base64").toString("utf-8");
    }
  }

  // File tree - fall back to master if main fails
  let fileTree = "(Could not fetch file tree)";
  if (treeMainRes.ok) {
    const treeData = await treeMainRes.json();
    if (treeData.tree) {
      fileTree = treeData.tree
        .map((f: { path: string; type: string }) => `${f.type === "tree" ? "[dir]" : "[file]"} ${f.path}`)
        .join("\n");
    }
  } else {
    const treeMasterRes = await fetchGitHub(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`);
    if (treeMasterRes.ok) {
      const treeData = await treeMasterRes.json();
      if (treeData.tree) {
        fileTree = treeData.tree
          .map((f: { path: string; type: string }) => `${f.type === "tree" ? "[dir]" : "[file]"} ${f.path}`)
          .join("\n");
      }
    }
  }

  // package.json
  let packageJson = "(No package.json found)";
  if (pkgRes.ok) {
    const pkgData = await pkgRes.json();
    if (pkgData.content) {
      packageJson = Buffer.from(pkgData.content, "base64").toString("utf-8");
    }
  }

  // Truncate large content to stay within limits
  const maxReadme = 8000;
  const maxTree = 6000;
  const maxPkg = 4000;
  if (readmeContent.length > maxReadme) readmeContent = readmeContent.slice(0, maxReadme) + "\n...(truncated)";
  if (fileTree.length > maxTree) fileTree = fileTree.slice(0, maxTree) + "\n...(truncated)";
  if (packageJson.length > maxPkg) packageJson = packageJson.slice(0, maxPkg) + "\n...(truncated)";

  const userPrompt = `Analyze this GitHub repository through first principles.

**Repository:** ${owner}/${repo}
**Description:** ${meta.description || "(none)"}
**Language:** ${meta.language || "(unknown)"}
**Topics:** ${meta.topics?.length > 0 ? meta.topics.join(", ") : "(none)"}
**Stars:** ${meta.stargazers_count || 0}
**Forks:** ${meta.forks_count || 0}

---

**README (what the builder says this is):**
${readmeContent}

---

**File Tree (what was actually built):**
${fileTree}

---

**package.json (dependencies and scripts):**
${packageJson}

---

Run first principles decomposition on this repo. Find the gap between what the README claims and what was actually built. Question every assumption, find what users actually need, and show what should be rebuilt from scratch.`;

  const response = await fetch(`${GEMINI_API_URL}?alt=sse&key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini API error:", err);
    return Response.json({ error: "AI service error. Please try again." }, { status: 500 });
  }

  const encoder = new TextEncoder();
  const reader = response.body?.getReader();

  const readable = new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close();
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (!data) continue;
            try {
              const parsed = JSON.parse(data);
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                );
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
