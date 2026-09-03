import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateAI } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant Chat | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with an AI assistant for workplace tasks: emails, message rewrites, meeting prep, task lists and brainstorming.",
      },
      { property: "og:title", content: "AI Workplace Assistant Chat" },
      {
        property: "og:description",
        content: "A contextual AI chat assistant for everyday workplace tasks.",
      },
    ],
  }),
  component: AssistantPage,
});

const SYSTEM =
  "You are an AI workplace productivity assistant. Respond directly to the user's request, provide useful and context-aware assistance, and ask for clarification when necessary. Keep answers practical and well structured.";

const SUGGESTIONS = [
  "Help me write an email to my manager.",
  "Improve this message and make it more professional.",
  "Summarize these notes.",
  "Help me prepare for a meeting.",
  "Create a project task list.",
  "Help me brainstorm ideas.",
];

type Msg = { role: "user" | "assistant"; content: string };

function AssistantPage() {
  const run = useServerFn(generateAI);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: prompt }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { content } = await run({ data: { system: SYSTEM, messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Workplace Assistant"
        description="Ask anything work-related — drafting, rewriting, planning or brainstorming."
      />

      <section className="flex h-[68vh] min-h-[480px] flex-col rounded-2xl border border-border bg-card shadow-card">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="py-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
                <Sparkles className="h-6 w-6" />
              </span>
              <p className="mt-3 font-medium">How can I help you work smarter today?</p>
              <div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-background px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:text-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Type your request…"
              className="max-h-40 min-h-[52px] resize-none"
            />
            <Button size="icon" onClick={() => send(input)} disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
            {messages.length > 0 && (
              <Button variant="ghost" size="icon" onClick={() => setMessages([])}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            AI responses may contain errors. Don't share confidential information.
          </p>
        </div>
      </section>
    </AppLayout>
  );
}
