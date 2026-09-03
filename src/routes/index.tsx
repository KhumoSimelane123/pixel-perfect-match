import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  MessageSquare,
  ArrowRight,
  Clock,
  Zap,
  Smile,
  ShieldCheck,
} from "lucide-react";

import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Work smarter with AI: generate professional emails, summarize meeting notes and chat with a workplace assistant — no sign-up required.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "AI-powered emails, meeting summaries and a workplace chat assistant in one clean dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Create professional emails using AI in a formal, friendly or persuasive tone.",
  },
  {
    to: "/meetings",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    body: "Turn lengthy meeting notes into summaries, action items, decisions and deadlines.",
  },
  {
    to: "/assistant",
    icon: MessageSquare,
    title: "AI Workplace Assistant",
    body: "Chat with an AI assistant for everyday workplace tasks and quick guidance.",
  },
] as const;

const STATS = [
  { icon: Clock, label: "Time saved per email", value: "~12 min" },
  { icon: Zap, label: "Average draft time", value: "8 sec" },
  { icon: Smile, label: "Tones available", value: "3" },
  { icon: ShieldCheck, label: "Accounts needed", value: "None" },
] as const;

const ACTIVITY = [
  { title: "Draft a project update email", tool: "Email Generator", when: "Just now" },
  { title: "Weekly stand-up notes summarized", tool: "Meeting Summarizer", when: "Today" },
  { title: "Brainstormed Q3 campaign ideas", tool: "AI Assistant", when: "Yesterday" },
] as const;

function Dashboard() {
  return (
    <AppLayout>
      <section className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-9">
        <p className="text-sm font-medium text-primary">Good morning! 👋</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-4xl">
          Welcome to your AI Workplace Productivity Assistant
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Work smarter, communicate better, and save time with AI-powered workplace tools.
        </p>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, title, body }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Open
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-border bg-secondary/60 p-5">
            <Icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
        <h2 className="font-semibold">Recent activity</h2>
        <ul className="mt-4 divide-y divide-border">
          {ACTIVITY.map((a) => (
            <li key={a.title} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.tool}</p>
              </div>
              <span className="text-xs whitespace-nowrap text-muted-foreground">{a.when}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 rounded-2xl border border-border bg-accent/50 p-4 text-xs text-accent-foreground sm:text-sm">
        <strong>Responsible AI:</strong> AI-generated content may contain errors. Always review
        and verify important information before using it for workplace communication or decisions.
      </p>
    </AppLayout>
  );
}
