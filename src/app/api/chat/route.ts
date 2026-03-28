const CHAT_SYSTEM_PROMPT = `You are the follow-up assistant for a First Principles Theory Engine. The user has already received a first principles decomposition of their idea. You have the full context of their original idea and the analysis.

Your role:
- Answer questions about any part of the analysis
- Go deeper on specific assumptions, fundamentals, or rebuilds when asked
- Challenge or defend points when the user pushes back ("actually that assumption IS valid because...")
- Help them refine their idea based on the analysis
- Brainstorm implementation details for specific rebuilds
- Compare their idea to what first principles demands
- Be a thinking partner, not a yes-man

Rules:
- Stay grounded in first principles theory — if the user wants to add back an assumption you stripped away, make them justify it
- Be direct and conversational — like a sharp co-founder, not a consultant
- Keep responses focused and practical
- Bold key insights
- If they ask you to go deeper on a rebuild, give concrete, buildable details
- If they disagree with the analysis, engage genuinely — you might be wrong, but make them prove it`;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const { messages, originalIdea, analysis } = await request.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  }

  const geminiMessages = [
    {
      role: "user" as const,
      parts: [{ text: `Here is the context for our conversation:\n\n**Original Idea:**\n${originalIdea}\n\n**First Principles Analysis:**\n${analysis}\n\n---\n\nThe user now wants to discuss this analysis. Respond to their message below.` }],
    },
    {
      role: "model" as const,
      parts: [{ text: "I have the full context of the first principles analysis. I'm ready to discuss any part of it — dig deeper, challenge assumptions, refine rebuilds, or explore implementation. What's on your mind?" }],
    },
    ...messages.map((msg: ChatMessage) => ({
      role: msg.role === "user" ? "user" as const : "model" as const,
      parts: [{ text: msg.content }],
    })),
  ];

  const response = await fetch(`${GEMINI_API_URL}?alt=sse&key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: CHAT_SYSTEM_PROMPT }],
      },
      contents: geminiMessages,
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini chat error:", err);
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
              // skip
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
