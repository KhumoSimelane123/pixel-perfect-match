import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Set your display name, default email tone and safety reminders for the AI workplace assistant.",
      },
      { property: "og:title", content: "Settings" },
      {
        property: "og:description",
        content: "Personalise your AI workplace assistant preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
const KEY = "aiwpa-settings";

function SettingsPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState<string>("Formal");
  const [reminders, setReminders] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      setName(s.name ?? "");
      setRole(s.role ?? "");
      setTone(s.tone ?? "Formal");
      setReminders(s.reminders ?? true);
    } catch {
      /* ignore malformed settings */
    }
  }, []);

  const save = () => {
    localStorage.setItem(KEY, JSON.stringify({ name, role, tone, reminders }));
    toast.success("Preferences saved on this device");
  };

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        description="Preferences are stored locally on your device — no account, no server storage."
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Job title</Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Label htmlFor="tone">Default email tone</Label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm sm:max-w-xs"
          >
            {TONES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-muted/60 p-4">
          <div>
            <p className="text-sm font-medium">Show responsible AI reminders</p>
            <p className="text-xs text-muted-foreground">
              Display review and confidentiality notices alongside AI output.
            </p>
          </div>
          <Switch checked={reminders} onCheckedChange={setReminders} />
        </div>

        <Button className="mt-6 w-full sm:w-auto" onClick={save}>
          Save preferences
        </Button>
      </section>
    </AppLayout>
  );
}
