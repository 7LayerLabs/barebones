"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface HistoryEntry {
  id: string;
  idea: string;
  result: string;
  timestamp: number;
  parentId?: string;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("barebone_history") || "[]");
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryEntry[]) {
  localStorage.setItem("barebone_history", JSON.stringify(history.slice(0, 50)));
}

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      editRef.current.setSelectionRange(editRef.current.value.length, editRef.current.value.length);
    }
  }, [editing]);

  const streamDecompose = useCallback(async (inputIdea: string, parentId?: string) => {
    if (!inputIdea.trim() || loading) return;

    setIdea(inputIdea.trim());
    setLoading(true);
    setResult("");
    setHasResult(true);
    setEditing(false);
    setChatMessages([]);

    let fullResult = "";
    const entryId = generateId();
    setCurrentEntryId(entryId);

    try {
      const response = await fetch("/api/decompose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: inputIdea.trim() }),
      });

      if (!response.ok) {
        const err = await response.json();
        setResult(`Error: ${err.error || "Something went wrong."}`);
        setLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullResult += parsed.text;
                setResult((prev) => prev + parsed.text);
              }
            } catch {
              // skip
            }
          }
        }
      }

      // Save to history
      const entry: HistoryEntry = {
        id: entryId,
        idea: inputIdea.trim(),
        result: fullResult,
        timestamp: Date.now(),
        parentId,
      };
      setHistory((prev) => {
        const updated = [entry, ...prev];
        saveHistory(updated);
        return updated;
      });
    } catch {
      setResult("Error: Failed to connect. Check that the server is running.");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const decompose = useCallback(() => {
    streamDecompose(idea);
  }, [idea, streamDecompose]);

  const decomposeRebuild = useCallback((rebuildText: string) => {
    streamDecompose(rebuildText, currentEntryId || undefined);
  }, [streamDecompose, currentEntryId]);

  const editAndRerun = useCallback(() => {
    if (!editText.trim()) return;
    streamDecompose(editText, currentEntryId || undefined);
  }, [editText, streamDecompose, currentEntryId]);

  const loadFromHistory = (entry: HistoryEntry) => {
    setIdea(entry.idea);
    setResult(entry.result);
    setHasResult(true);
    setCurrentEntryId(entry.id);
    setChatMessages([]);
    setShowHistory(false);
    setEditing(false);
  };

  const deleteFromHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveHistory(updated);
      return updated;
    });
  };

  const sendChat = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, { role: "user", content: userMessage }],
          originalIdea: idea,
          analysis: result,
        }),
      });

      if (!response.ok) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: Failed to get response." },
        ]);
        setChatLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantContent += parsed.text;
                setChatMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Connection failed." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, chatMessages, idea, result]);

  const reset = () => {
    setIdea("");
    setResult("");
    setHasResult(false);
    setCopied(false);
    setCopiedPrompt(false);
    setShowPrompt(false);
    setEditing(false);
    setEditText("");
    setChatMessages([]);
    setChatInput("");
    setCurrentEntryId(null);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePrompt = () => {
    const sections = parseSteps(result);
    const assumptions = sections.find((s) => s.step === "1")?.body || "";
    const fundamentals = sections.find((s) => s.step === "2")?.body || "";
    const rebuilds = sections.find((s) => s.step === "3")?.body || "";
    const transformation = sections.find((s) => s.step === "4")?.body || "";
    const techStack = sections.find((s) => s.step === "5")?.body || "";

    const clean = (s: string) => s.replace(/\*\*/g, "").replace(/^[-*] /gm, "- ");

    // Extract the AFTER line
    const afterMatch = transformation.match(/\*\*AFTER:\*\*\s*(.+?)(?:\n|$)/);
    const vision = afterMatch ? afterMatch[1].replace(/\*\*/g, "").trim() : idea;

    const prompt = `# Product Requirements Document

## Vision
${vision}

## Original Idea
${idea}

## The Problem (First Principles Analysis)

### Assumptions We're Rejecting
These are the conventional assumptions baked into the original idea that we've challenged:
${clean(assumptions)}

### What Users Actually Need
${clean(fundamentals)}

### The Shift
${clean(transformation)}

## What to Build
${clean(rebuilds)}

## MVP Scope
Build the simplest version that delivers the core value described above. The MVP should:
- Focus on ONE primary user flow end-to-end
- Prove the core value proposition before adding features
- Be testable with real users within the first iteration
- Skip: auth, payments, admin panels, analytics — add these later

## Tech Stack
${techStack ? clean(techStack) : `- Modern web app (Next.js or similar)
- Clean, minimal UI — the product should feel simple and fast
- Mobile-responsive from day one
- Start with the frontend and core user experience, backend can be simple`}

## Validation Plan
- Define one key metric that proves the core idea works
- Build a feedback mechanism into the MVP (even if it's just a text input)
- Plan for 5-10 real user tests before expanding scope

## Iteration Priorities (After MVP)
1. Refine based on user feedback from validation
2. Add retention features (accounts, saved data, notifications)
3. Expand to secondary user flows
4. Monetization and growth features

---

Build this step by step. Start with the project setup and core user flow. Ask clarifying questions if the scope is unclear. Focus on shipping something usable first, then iterate.`;

    return prompt;
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const startEdit = () => {
    setEditText(idea);
    setEditing(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#09090b]">
      {/* Header */}
      <header className="border-b border-zinc-800/80 px-6 py-3.5 backdrop-blur-sm bg-[#09090b]/80 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L1 13h12L7 1z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <line x1="7" y1="5" x2="7" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-200">barebone</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/learn"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              What is this?
            </Link>
            <Link
              href="/stacks"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Tech Stacks
            </Link>
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`text-xs transition-colors ${showHistory ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                History ({history.length})
              </button>
            )}
            {hasResult && (
              <button onClick={reset} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                New idea
              </button>
            )}
          </div>
        </div>
      </header>

      {/* History Panel */}
      {showHistory && (
        <div className="border-b border-zinc-800/60 bg-zinc-900/30">
          <div className="max-w-3xl mx-auto px-5 py-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 group"
                >
                  <button
                    onClick={() => loadFromHistory(entry)}
                    className="flex-1 text-left bg-zinc-900/50 border border-zinc-800/60 rounded-lg px-3 py-2 hover:border-zinc-700 transition-colors"
                  >
                    <p className="text-zinc-300 text-xs truncate">{entry.idea}</p>
                    <p className="text-zinc-600 text-[10px] mt-0.5">
                      {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {entry.parentId && " — iterated"}
                    </p>
                  </button>
                  <button
                    onClick={() => deleteFromHistory(entry.id)}
                    className="text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all px-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-5">
        {!hasResult ? (
          <div className="flex-1 flex flex-col items-center justify-center -mt-12">
            <div className="w-full max-w-xl space-y-6 animate-fade-up">
              {/* Hero */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Break it down. Build it right.
                </h2>
                <p className="text-zinc-500 text-sm">
                  Stop reasoning by analogy. Question everything. Rebuild from truth.
                </p>
              </div>

              {/* Input */}
              <div className="space-y-3">
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) decompose();
                  }}
                  placeholder="What's your idea?"
                  className="w-full h-28 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 resize-none text-sm leading-relaxed transition-all"
                  autoFocus
                />
                <button
                  onClick={decompose}
                  disabled={!idea.trim() || loading}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-2.5 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Decompose
                </button>
              </div>

              {/* Examples */}
              <div className="space-y-2">
                <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest px-1">
                  Try one
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "A tool that summarizes podcast episodes",
                    "A subscription box for healthy snacks",
                    "An app that helps people find parking",
                    "A loyalty program for local restaurants",
                    "A platform that connects freelancers with clients",
                    "An AI tutor for kids learning math",
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setIdea(example)}
                      className="px-3 py-1.5 text-xs border border-zinc-800/60 rounded-full text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors text-left"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results + Chat */
          <div className="py-6 space-y-4 flex-1">
            {/* Input recap — editable */}
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">Your idea</p>
                {!loading && !editing && (
                  <button
                    onClick={startEdit}
                    className="text-[10px] text-zinc-600 hover:text-indigo-400 transition-colors font-mono uppercase tracking-widest"
                  >
                    Edit & re-run
                  </button>
                )}
              </div>
              {editing ? (
                <div className="space-y-2 mt-2">
                  <textarea
                    ref={editRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) editAndRerun();
                      if (e.key === "Escape") setEditing(false);
                    }}
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-sm resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={editAndRerun}
                      disabled={!editText.trim()}
                      className="px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg disabled:opacity-20 transition-all"
                    >
                      Re-decompose
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-400 text-sm">{idea}</p>
              )}
            </div>

            {/* Loading state — show when loading and no parsed sections yet */}
            {loading && parseSteps(result).length === 0 && (
              <div className="flex items-center justify-center gap-1.5 py-12 text-zinc-500">
                <span className="text-xs">Decomposing</span>
                <span className="thinking-dot text-indigo-400">.</span>
                <span className="thinking-dot text-indigo-400">.</span>
                <span className="thinking-dot text-indigo-400">.</span>
              </div>
            )}

            {/* Result sections — only render when we have parsed step sections */}
            {result && parseSteps(result).length > 0 && (
              <ResultCards
                content={result}
                loading={loading}
                onDecomposeRebuild={decomposeRebuild}
              />
            )}

            {/* Actions */}
            {!loading && result && (
              <div className="space-y-3 pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={copyResult}
                    className="px-3.5 py-1.5 text-xs border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={reset}
                    className="px-3.5 py-1.5 text-xs bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-colors text-indigo-400"
                  >
                    Try another
                  </button>
                </div>

                {/* Prompt this idea */}
                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-sm font-medium text-indigo-300 hover:text-indigo-200"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M5 4.5h4M5 7h4M5 9.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  Prompt this idea
                </button>

                {showPrompt && (
                  <div className="rounded-xl border border-indigo-500/20 bg-zinc-900/60 overflow-hidden animate-fade-up">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/60">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                        Ready to paste into Claude Code, Cursor, or any LLM
                      </p>
                      <button
                        onClick={copyPrompt}
                        className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-colors text-indigo-400"
                      >
                        {copiedPrompt ? "Copied!" : "Copy prompt"}
                      </button>
                    </div>
                    <pre className="px-4 py-3 text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto font-mono">
                      {generatePrompt()}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Chat Section */}
            {!loading && result && (
              <div className="border-t border-zinc-800/60 pt-5 mt-5 space-y-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v12M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400" />
                      <circle cx="8" cy="14" r="1" fill="currentColor" className="text-emerald-400" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-emerald-300 text-sm font-semibold">Dig Deeper</p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Challenge assumptions, explore rebuilds, or refine your idea with AI
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>

                {/* Chat messages */}
                {chatMessages.length > 0 && (
                  <div className="space-y-3">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-indigo-500/20 border border-indigo-500/30 text-zinc-200"
                              : "bg-zinc-900/60 border border-zinc-800/60 text-zinc-400 [&_strong]:text-zinc-200"
                          }`}
                        >
                          {msg.role === "assistant" ? (
                            <RenderBody text={msg.content} />
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    ))}
                    {chatLoading && chatMessages[chatMessages.length - 1]?.role === "assistant" && chatMessages[chatMessages.length - 1]?.content === "" && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-1.5 px-4 py-3 text-zinc-500">
                          <span className="thinking-dot text-indigo-400">.</span>
                          <span className="thinking-dot text-indigo-400">.</span>
                          <span className="thinking-dot text-indigo-400">.</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}

                {/* Chat input */}
                <div className="flex gap-2">
                  <textarea
                    ref={chatInputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendChat();
                      }
                    }}
                    placeholder="Ask about the analysis, challenge an assumption, or go deeper on a rebuild..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 resize-none text-sm leading-relaxed transition-all"
                    rows={1}
                    disabled={chatLoading}
                  />
                  <button
                    onClick={sendChat}
                    disabled={!chatInput.trim() || chatLoading}
                    className="px-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Suggestion chips */}
                {chatMessages.length === 0 && (
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Tell me more about rebuild #1",
                      "I disagree with assumption #2",
                      "How would I actually build this?",
                      "What's the MVP look like?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setChatInput(suggestion);
                          chatInputRef.current?.focus();
                        }}
                        className="px-3 py-1.5 text-xs border border-zinc-800 rounded-full text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function ResultCards({
  content,
  loading,
  onDecomposeRebuild,
}: {
  content: string;
  loading: boolean;
  onDecomposeRebuild: (text: string) => void;
}) {
  const allSections = parseSteps(content);
  // While streaming, only show completed sections (all except the last one being written)
  const sections = loading && allSections.length > 0
    ? allSections.slice(0, -1)
    : allSections;

  const stepMeta: Record<string, { color: string; icon: string }> = {
    "1": { color: "text-orange-400", icon: "01" },
    "2": { color: "text-emerald-400", icon: "02" },
    "3": { color: "text-blue-400", icon: "03" },
    "4": { color: "text-indigo-400", icon: "04" },
    "5": { color: "text-cyan-400", icon: "05" },
  };

  return (
    <div className="space-y-3">
      {sections.map((section, i) => {
        const stepNum = section.step;
        const meta = stepMeta[stepNum] || { color: "text-zinc-400", icon: `0${stepNum}` };
        const isTransformation = stepNum === "4";
        const isRebuild = stepNum === "3";
        const isAssumptions = stepNum === "1";
        const isFundamentals = stepNum === "2";
        const isTechStack = stepNum === "5";

        // Extract the AFTER line for decompose button
        const afterMatch = isTransformation
          ? section.body.match(/\*\*AFTER:\*\*\s*(.+?)(?:\n|$)/)
          : null;

        return (
          <div
            key={i}
            className={`rounded-xl border animate-fade-up ${
              isTransformation
                ? "bg-gradient-to-br from-indigo-950/40 to-indigo-900/20 border-indigo-500/20 p-4"
                : isTechStack
                ? "bg-gradient-to-br from-cyan-950/30 to-cyan-900/10 border-cyan-500/20 p-4"
                : "bg-zinc-900/40 border-zinc-800/60 p-4"
            }`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] font-mono font-bold ${meta.color}`}>
                  {meta.icon}
                </span>
                <span className={`text-xs font-semibold uppercase tracking-wider ${meta.color}`}>
                  {section.title}
                </span>
              </div>
              {isRebuild && !loading && (
                <span className="text-[10px] text-zinc-600 font-mono">
                  Click to decompose
                </span>
              )}
            </div>
            <div className="text-sm leading-relaxed text-zinc-400 [&_strong]:text-zinc-200 [&_em]:text-zinc-300">
              {isAssumptions && !loading ? (
                <RenderAssumptionsGrid text={section.body} />
              ) : isFundamentals && !loading ? (
                <RenderFundamentalsGrid text={section.body} />
              ) : isRebuild && !loading ? (
                <RenderRebuilds
                  text={section.body}
                  onDecompose={onDecomposeRebuild}
                />
              ) : isTransformation ? (
                <RenderBody text={section.body} isTransformation={isTransformation} />
              ) : (
                <RenderBody text={section.body} />
              )}
            </div>
            {/* Decompose the AFTER idea */}
            {isTransformation && afterMatch && !loading && (
              <button
                onClick={() => onDecomposeRebuild(afterMatch[1].replace(/\*\*/g, "").trim())}
                className="mt-3 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-colors text-indigo-400"
              >
                Decompose the refined idea
              </button>
            )}
          </div>
        );
      })}
      {loading && (
        <div className="flex items-center gap-1.5 py-3 text-zinc-500">
          <span className="text-xs">{sections.length === 0 ? "Decomposing" : "Analyzing"}</span>
          <span className="thinking-dot text-indigo-400">.</span>
          <span className="thinking-dot text-indigo-400">.</span>
          <span className="thinking-dot text-indigo-400">.</span>
        </div>
      )}
    </div>
  );
}

// Renders assumptions as a 2-column grid of mini cards
function RenderAssumptionsGrid({ text }: { text: string }) {
  const items: { assumption: string; reason: string }[] = [];
  const lines = text.split("\n").filter((l) => l.trim());

  let current: { assumption: string; reason: string } | null = null;
  for (const line of lines) {
    // Lines starting with - or * or a number are assumption headers
    if (/^[-*]\s*\*\*/.test(line) || /^\d+\.\s*\*\*/.test(line)) {
      if (current) items.push(current);
      const cleaned = line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
      current = { assumption: cleaned, reason: "" };
    } else if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      if (current) items.push(current);
      const cleaned = line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
      current = { assumption: cleaned, reason: "" };
    } else if (current) {
      current.reason += (current.reason ? " " : "") + line.trim();
    } else {
      // Standalone line, treat as its own item
      if (current) items.push(current);
      current = { assumption: line.trim(), reason: "" };
    }
  }
  if (current) items.push(current);

  if (items.length === 0) return <RenderBody text={text} />;

  const cardColors = [
    { accent: "text-orange-400", border: "border-orange-500/20", bg: "bg-orange-500/5" },
    { accent: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
    { accent: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/5" },
    { accent: "text-pink-400", border: "border-pink-500/20", bg: "bg-pink-500/5" },
    { accent: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/5" },
    { accent: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/5" },
  ];

  const isOdd = items.length % 2 !== 0;
  const pairedItems = isOdd ? items.slice(0, -1) : items;
  const lastItem = isOdd ? items[items.length - 1] : null;
  const lastColor = isOdd ? cardColors[(items.length - 1) % cardColors.length] : null;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {pairedItems.map((item, i) => {
          const color = cardColors[i % cardColors.length];
          return (
            <div
              key={i}
              className={`${color.bg} border ${color.border} rounded-lg p-3`}
            >
              <span className={`text-[10px] font-mono font-bold ${color.accent}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className="text-zinc-300 text-xs font-medium leading-relaxed mt-1"
                dangerouslySetInnerHTML={{ __html: inlineFormat(item.assumption) }}
              />
              {item.reason && (
                <p
                  className="text-zinc-500 text-xs leading-relaxed mt-1.5"
                  dangerouslySetInnerHTML={{ __html: inlineFormat(item.reason) }}
                />
              )}
            </div>
          );
        })}
      </div>
      {lastItem && lastColor && (
        <div className="flex justify-center">
          <div className={`${lastColor.bg} border ${lastColor.border} rounded-lg p-3 w-full sm:w-[calc(50%-0.25rem)]`}>
            <span className={`text-[10px] font-mono font-bold ${lastColor.accent}`}>
              {String(items.length).padStart(2, "0")}
            </span>
            <p
              className="text-zinc-300 text-xs font-medium leading-relaxed mt-1"
              dangerouslySetInnerHTML={{ __html: inlineFormat(lastItem.assumption) }}
            />
            {lastItem.reason && (
              <p
                className="text-zinc-500 text-xs leading-relaxed mt-1.5"
                dangerouslySetInnerHTML={{ __html: inlineFormat(lastItem.reason) }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Renders fundamentals as a 2x2 grid
function RenderFundamentalsGrid({ text }: { text: string }) {
  const items: { label: string; content: string }[] = [];
  const lines = text.split("\n").filter((l) => l.trim());

  let current: { label: string; content: string } | null = null;
  for (const line of lines) {
    // Match bold label lines like "**What is this thing, fundamentally?**"
    const boldMatch = line.match(/^\*\*(.+?)\*\*[:\s]*(.*)/);
    const bulletBoldMatch = line.match(/^[-*]\s*\*\*(.+?)\*\*[:\s]*(.*)/);

    if (bulletBoldMatch) {
      if (current) items.push(current);
      current = { label: bulletBoldMatch[1], content: bulletBoldMatch[2] || "" };
    } else if (boldMatch && !line.startsWith("**Current") && !line.startsWith("**First")) {
      if (current) items.push(current);
      current = { label: boldMatch[1], content: boldMatch[2] || "" };
    } else if (current) {
      const cleaned = line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
      current.content += (current.content ? " " : "") + cleaned.trim();
    } else {
      // If no bold labels found, fall back
      const cleaned = line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
      if (current) items.push(current);
      current = { label: "", content: cleaned };
    }
  }
  if (current) items.push(current);

  if (items.length === 0) return <RenderBody text={text} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-zinc-800/30 border border-zinc-800/50 rounded-lg p-3"
        >
          {item.label && (
            <p className="text-emerald-400/70 text-[10px] font-mono uppercase tracking-widest mb-1.5">
              {item.label}
            </p>
          )}
          <p
            className="text-zinc-300 text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: inlineFormat(item.content) }}
          />
        </div>
      ))}
    </div>
  );
}

// Renders rebuild section with collapsible cards + decompose action
function RenderRebuilds({
  text,
  onDecompose,
}: {
  text: string;
  onDecompose: (text: string) => void;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const lines = text.split("\n");
  const preamble: React.ReactNode[] = [];
  const flowBlocks: { label: string; isCurrent: boolean; steps: string[] }[] = [];
  const rebuilds: { title: string; body: string[] }[] = [];
  let currentRebuild: { title: string; body: string[] } | null = null;

  const flushRebuild = () => {
    if (currentRebuild) {
      rebuilds.push(currentRebuild);
      currentRebuild = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\*\*["""]?[^*]+["""]?\*\*/.test(line) && !line.startsWith("**Current") && !line.startsWith("**First")) {
      flushRebuild();
      const titleMatch = line.match(/^\*\*(.+?)\*\*[:\s]*(.*)/);
      if (titleMatch) {
        currentRebuild = {
          title: titleMatch[1],
          body: titleMatch[2] ? [titleMatch[2]] : [],
        };
      }
    } else if (currentRebuild && line.trim() !== "") {
      currentRebuild.body.push(line);
    } else if (currentRebuild && line.trim() === "") {
      flushRebuild();
    } else {
      if (line.trim() === "") continue;
      // Flow comparison — detect Current flow / First Principles flow labels
      const flowLabelMatch = line.match(/^\*\*(Current flow|First Principles flow):\*\*\s*(.*)/i);
      if (flowLabelMatch) {
        const isCurrent = /current/i.test(flowLabelMatch[1]);
        flowBlocks.push({
          label: flowLabelMatch[1],
          isCurrent,
          steps: flowLabelMatch[2] ? [flowLabelMatch[2]] : [],
        });
      } else if (flowBlocks.length > 0 && /^[-*]\s|^\d+\.\s/.test(line)) {
        const cleaned = line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
        flowBlocks[flowBlocks.length - 1].steps.push(cleaned);
      } else if (/^[-*] /.test(line)) {
        preamble.push(
          <div key={`p-${i}`} className="flex gap-2 items-start my-0.5">
            <span className="text-zinc-600 mt-1 text-[8px]">●</span>
            <span dangerouslySetInnerHTML={{ __html: inlineFormat(line.replace(/^[-*] /, "")) }} />
          </div>
        );
      } else {
        preamble.push(
          <p key={`p-${i}`} className="my-1" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
        );
      }
    }
  }
  flushRebuild();

  const rebuildColors = [
    { accent: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/5", btnBg: "bg-cyan-500/10", btnBorder: "border-cyan-500/20", btnHover: "hover:bg-cyan-500/20" },
    { accent: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5", btnBg: "bg-violet-500/10", btnBorder: "border-violet-500/20", btnHover: "hover:bg-violet-500/20" },
    { accent: "text-sky-400", border: "border-sky-500/20", bg: "bg-sky-500/5", btnBg: "bg-sky-500/10", btnBorder: "border-sky-500/20", btnHover: "hover:bg-sky-500/20" },
    { accent: "text-teal-400", border: "border-teal-500/20", bg: "bg-teal-500/5", btnBg: "bg-teal-500/10", btnBorder: "border-teal-500/20", btnHover: "hover:bg-teal-500/20" },
    { accent: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5", btnBg: "bg-blue-500/10", btnBorder: "border-blue-500/20", btnHover: "hover:bg-blue-500/20" },
  ];

  return (
    <div className="space-y-3">
      {/* Non-flow preamble text */}
      {preamble.length > 0 && (
        <div className="text-sm leading-relaxed text-zinc-400 [&_strong]:text-blue-300 mb-1">
          {preamble}
        </div>
      )}

      {/* Flow comparison — stacked vertically */}
      {flowBlocks.length > 0 && (
        <div className="space-y-2 mb-3">
          {flowBlocks.map((flow, fi) => (
            <div
              key={fi}
              className={`rounded-lg p-3 border ${
                flow.isCurrent
                  ? "bg-zinc-800/30 border-zinc-700/40"
                  : "bg-blue-500/5 border-blue-500/20"
              }`}
            >
              <p className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${
                flow.isCurrent ? "text-zinc-500" : "text-blue-400"
              }`}>
                {flow.label}
              </p>
              <div className="space-y-1">
                {flow.steps.map((step, si) => (
                  <div key={si} className="flex gap-2 items-start">
                    <span className={`text-[10px] font-mono mt-0.5 ${flow.isCurrent ? "text-zinc-600" : "text-blue-500/60"}`}>
                      {si + 1}.
                    </span>
                    <span
                      className={`text-xs leading-relaxed ${flow.isCurrent ? "text-zinc-500" : "text-zinc-300"}`}
                      dangerouslySetInnerHTML={{ __html: inlineFormat(step) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rebuild cards — collapsed by default */}
      {rebuilds.map((rebuild, i) => {
        const isExpanded = expandedIndex === i;
        const rebuildText = `${rebuild.title}: ${rebuild.body.join(" ")}`;
        const color = rebuildColors[i % rebuildColors.length];

        return (
          <div
            key={i}
            className={`${color.bg} border ${color.border} rounded-lg overflow-hidden transition-colors`}
          >
            {/* Header — always visible */}
            <button
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] font-mono font-bold ${color.accent}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-sm font-medium ${color.accent}`}
                  dangerouslySetInnerHTML={{ __html: inlineFormat(rebuild.title) }}
                />
              </div>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                className={`text-zinc-600 transition-transform flex-shrink-0 ml-2 ${isExpanded ? "rotate-180" : ""}`}
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </button>

            {/* Expanded body */}
            {isExpanded && (
              <div className="px-3 pb-3 border-t border-zinc-800/40">
                {rebuild.body.length > 0 && (
                  <div className="mt-2 text-zinc-500 text-sm leading-relaxed [&_strong]:text-zinc-300">
                    {rebuild.body.map((line, j) => (
                      <p key={j} className="my-0.5" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
                    ))}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecompose(rebuildText);
                  }}
                  className={`mt-2.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest ${color.btnBg} border ${color.btnBorder} rounded-lg ${color.btnHover} transition-colors ${color.accent}`}
                >
                  Decompose this →
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface Section {
  step: string;
  title: string;
  body: string;
}

function parseSteps(content: string): Section[] {
  const sections: Section[] = [];
  const regex = /##\s*Step\s*(\d+)[:\s]*(.+?)(?:\n|$)/gi;
  let match;
  const matches: { index: number; step: string; title: string }[] = [];

  while ((match = regex.exec(content)) !== null) {
    matches.push({ index: match.index, step: match[1], title: match[2].trim() });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + content.slice(matches[i].index).indexOf("\n") + 1;
    const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    const body = content.slice(start, end).trim();
    sections.push({ step: matches[i].step, title: matches[i].title, body });
  }

  // No fallback — if no step headers found yet (during streaming), return empty
  // The loading indicator in ResultCards handles this state

  return sections;
}

function RenderBody({ text, isTransformation }: { text: string; isTransformation?: boolean }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="space-y-1 my-1.5">
          {listItems.map((item, j) => (
            <li key={j} className="flex gap-2 items-start">
              <span className="text-zinc-600 mt-1 text-[8px]">●</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^[-*] /.test(line)) {
      listItems.push(line.replace(/^[-*] /, ""));
    } else if (/^\d+\. /.test(line)) {
      listItems.push(line.replace(/^\d+\. /, ""));
    } else if (line.trim() === "") {
      flushList(`list-${i}`);
    } else if (line.startsWith("> ")) {
      flushList(`list-${i}`);
      elements.push(
        <blockquote key={i} className="border-l-2 border-indigo-500/30 pl-3 italic text-zinc-500 my-2 text-xs" dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(2)) }} />
      );
    } else if (line.startsWith("**BEFORE:**") || line.startsWith("**AFTER:**")) {
      flushList(`list-${i}`);
      const isBefore = line.startsWith("**BEFORE:**");
      const lineContent = line.replace(/^\*\*(BEFORE|AFTER):\*\*\s*/, "");
      elements.push(
        <div key={i} className={`flex gap-3 items-start py-1.5 ${isBefore ? "" : "mt-1"}`}>
          <span className={`text-[10px] font-mono font-bold mt-0.5 min-w-[3rem] ${isBefore ? "text-zinc-600" : "text-indigo-400"}`}>
            {isBefore ? "BEFORE" : "AFTER"}
          </span>
          <span className={isBefore ? "text-zinc-500" : "text-indigo-300 font-medium"} dangerouslySetInnerHTML={{ __html: inlineFormat(lineContent) }} />
        </div>
      );
    } else {
      flushList(`list-${i}`);
      elements.push(
        <p key={i} className="my-1" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
      );
    }
  }
  flushList("final");

  return <>{elements}</>;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="bg-zinc-800 px-1 py-0.5 rounded text-xs text-zinc-300">$1</code>');
}
