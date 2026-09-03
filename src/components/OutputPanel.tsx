import { Copy, Pencil, RefreshCw, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function OutputPanel({
  title,
  value,
  onChange,
  onRegenerate,
  onClear,
  loading,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  onClear: () => void;
  loading?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
            <Pencil className="h-4 w-4" />
            {editing ? "Done" : "Edit"}
          </Button>
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Regenerate
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {editing ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-80 text-sm leading-relaxed"
        />
      ) : (
        <div className="rounded-xl bg-muted/60 p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {value}
        </div>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        AI-generated content may contain errors — review before use.
      </p>
    </section>
  );
}
