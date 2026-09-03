import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateAI } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in a formal, friendly or persuasive tone with AI, then edit and copy them.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Write clear workplace emails in seconds with three selectable tones.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
type Tone = (typeof TONES)[number];

const SYSTEM =
  "You are a professional workplace communication assistant. Write a clear, appropriate email based on the user's instructions. Follow the selected tone. Do not invent information that the user did not provide — if a detail is missing, leave a clearly marked placeholder such as [date]. Return only the email text.";

function EmailPage() {
  const run = useServerFn(generateAI);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!purpose.trim()) {
      toast.error("Describe the purpose of your email first.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await run({
        data: {
          system: SYSTEM,
          messages: [
            {
              role: "user" as const,
              content: [
                `Tone: ${tone}`,
                recipient.trim() && `Recipient: ${recipient.trim()}`,
                subject.trim() && `Subject: ${subject.trim()}`,
                `Instructions: ${purpose.trim()}`,
              ]
                .filter(Boolean)
                .join("\n"),
            },
          ],
        },
      });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Smart Email Generator"
        description="Describe what you need to say and let AI draft a polished email in your chosen tone."
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Sarah, Head of Operations"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Project timeline update"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="purpose">Email purpose / instructions</Label>
          <Textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Explain what the email should say, including any details the AI should use."
            className="min-h-36"
          />
        </div>

        <div className="mt-5">
          <Label className="mb-2 block">Tone</Label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  tone === t
                    ? "border-transparent bg-primary text-primary-foreground shadow-soft"
                    : "border-border bg-background text-muted-foreground hover:bg-accent",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Button className="mt-6 w-full sm:w-auto" onClick={generate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          {loading ? "Generating…" : "Generate Email"}
        </Button>
      </section>

      {output && (
        <div className="mt-6">
          <OutputPanel
            title="Generated email"
            value={output}
            onChange={setOutput}
            onRegenerate={generate}
            onClear={() => setOutput("")}
            loading={loading}
          />
        </div>
      )}
    </AppLayout>
  );
}
