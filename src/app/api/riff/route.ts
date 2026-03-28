const SYSTEM_PROMPT = `You are a sharp founder and mentor helping someone refine a specific product direction. They've already gone through first principles decomposition and picked a rebuild option they like. Now they want to riff on it — twist it, adjust it, explore a variation.

Your job is NOT to re-analyze their original idea. The rebuild they picked is your starting point. Take their twist seriously and help them see what this new direction looks like.

You MUST use these EXACT headers — no variations:

## Your Direction
One sentence capturing the refined concept that combines the rebuild they picked with their twist. Make it crisp and exciting — this is the elevator pitch of their new direction.

## What Changes
3-4 specific, concrete changes from the original rebuild based on their input. Each one should:
- Start with a **bold name**
- Use the format: "Instead of [what the original rebuild proposed], now [what changes based on their twist]"
- Be specific and actionable, not hand-wavy

## Why This Could Work
2-3 sentences on why this specific combination (the rebuild + their twist) has real potential. Be honest and specific — reference actual market dynamics, user behavior, or technical advantages. No empty hype.

## Quick MVP Scope
3-5 bullet points for the simplest version that proves this direction works. Each bullet should be something they could build in a weekend or less. Strip it down to the bare minimum that validates the core bet.

## Adjusted Tech Stack
Only include this section if the twist meaningfully changes the technical requirements from what the original rebuild would need. If the stack stays roughly the same, skip this section entirely.

If included, keep it tight:
- **[Technology]** -- [why this twist specifically needs it]

## CRITICAL RULES:
- Do NOT re-decompose the original idea. The rebuild is your starting point.
- Be conversational but sharp — like a co-founder brainstorming at a whiteboard.
- Be encouraging but honest — "this could work because..." backed by real reasoning.
- Stay practical — everything you suggest should be buildable, not theoretical.
- No filler, no preamble. Jump straight into "Your Direction."
- Bold key phrases and names.
- Keep it focused. This is a riff, not a full analysis.`;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent";

export async function POST(request: Request) {
  const { originalIdea, selectedRebuild, userTwist } = await request.json();

  if (!originalIdea || typeof originalIdea !== "string" || originalIdea.trim().length === 0) {
    return Response.json({ error: "Missing original idea." }, { status: 400 });
  }

  if (!selectedRebuild || typeof selectedRebuild !== "string" || selectedRebuild.trim().length === 0) {
    return Response.json({ error: "Missing selected rebuild option." }, { status: 400 });
  }

  if (!userTwist || typeof userTwist !== "string" || userTwist.trim().length === 0) {
    return Response.json({ error: "Missing your twist or modification." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  }

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
          parts: [
            {
              text: `Here's the context:

**Original Idea:** ${originalIdea.trim()}

**The Rebuild I Picked:** ${selectedRebuild.trim()}

**My Twist:** ${userTwist.trim()}

Take this rebuild as your starting point and riff on it with my twist. Show me what this direction looks like when I push it in this new way.`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2500,
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
