import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, EyeOff, AlertTriangle, UserCheck } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "How to use AI responsibly at work: verify outputs, protect confidential information and keep a human in the loop.",
      },
      { property: "og:title", content: "Responsible AI" },
      {
        property: "og:description",
        content: "Guidance on reviewing AI output and protecting sensitive workplace information.",
      },
    ],
  }),
  component: ResponsibleAI,
});

const POINTS = [
  {
    icon: AlertTriangle,
    title: "Always verify",
    body: "AI can be confidently wrong. Check names, numbers, dates and commitments before sending anything.",
  },
  {
    icon: EyeOff,
    title: "Protect sensitive data",
    body: "Do not enter confidential information, passwords, customer data or sensitive company information unless your organisation permits it.",
  },
  {
    icon: UserCheck,
    title: "Keep a human in the loop",
    body: "Use AI drafts as a starting point. You remain accountable for what you send and decide.",
  },
] as const;

function ResponsibleAI() {
  return (
    <AppLayout>
      <PageHeader
        title="Responsible AI"
        description="Use these tools with the same care you'd apply to any workplace communication."
      />

      <section className="rounded-2xl border border-primary/25 bg-accent/50 p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-accent-foreground sm:text-base">
            <strong>Responsible AI:</strong> AI-generated content may contain errors. Always
            review and verify important information before using it for workplace communication or
            decisions.
          </p>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
    </AppLayout>
  );
}
