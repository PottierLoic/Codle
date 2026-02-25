import { useMemo, useState } from "react";
import { loadProgress } from "@/lib/saveProgress";
import { STORAGE_KEYS } from "@/constants";

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

type StoredState = {
  attempts: number;
  disabledOptions: unknown;
  hasWon: boolean;
};

interface ShareComplexityResultProps {
  dayString: string;
}

export default function ShareComplexityResult({
  dayString,
}: ShareComplexityResultProps) {
  const [copied, setCopied] = useState(false);

  const state = useMemo(() => {
    return loadProgress<StoredState>(STORAGE_KEYS.COMPLEXITY_GUESSES, dayString) ?? null;
  }, [STORAGE_KEYS.COMPLEXITY_GUESSES, dayString]);

  const shareText = useMemo(() => {
    if (!state) return null;
    if (!state.hasWon) return null;

    const attempts = state.attempts;

    const grid = Array.from({ length: attempts }, (_, i) =>
      i === 0 ? "🟩" : "🟥"
    );

    return [`Codle (Complexity) ${dayString} — ${attempts} attempts`, ...grid].join("\n");
  }, [state, dayString]);

  if (!shareText) return null;

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white/90">Share your performance</h3>
          <p className="text-sm muted">Copy the result and paste it anywhere.</p>
        </div>

        <button
          type="button"
          className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15 transition"
          onClick={async () => {
            await copyToClipboard(shareText);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-black/40 p-3 text-sm leading-6 text-white/90 border border-white/10">
        {shareText}
      </pre>
    </div>
  );
}