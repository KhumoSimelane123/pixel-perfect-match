import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste meeting notes and get an AI summary with action items, decisions and deadlines you can edit and copy.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn long meeting notes into summaries, action items, decisions and deadlines.",
      },
    ],
  }),
  component: MeetingsPage,
});

const SYSTEM =
  "You are a professional meeting analysis assistant. Analyze only the information provided by the user. Produce four markdown sections in this order: '## Summary', '## Action Items', '## Decisions', '## Deadlines'. If a section has no supporting information in the notes, write exactly 'Not identified in the provided notes.' Never invent people, tasks, decisions or dates.";

function MeetingsPage() {
  const run = useServerFn(generateAI);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    if (!notes.trim()) {
      toast.error("Paste your meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await run({
        data: {
          system: SYSTEM,
          messages: [{ role: "user" as const, content: `Meeting notes:\n${notes.trim()}` }],
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
        title="Meeting Notes Summarizer"
        description="Paste raw notes and get a structured summary with action items, decisions and deadlines."
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your full meeting notes or transcript here…"
            className="min-h-64"
          />
        </div>
        <Button className="mt-5 w-full sm:w-auto" onClick={summarize} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {loading ? "Summarizing…" : "Summarize Meeting"}
        </Button>
      </section>

      {output && (
        <div className="mt-6">
          <OutputPanel
            title="Meeting analysis"
            value={output}
            onChange={setOutput}
            onRegenerate={summarize}
            onClear={() => setOutput("")}
            loading={loading}
          />
        </div>
      )}
    </AppLayout>
  );
}
