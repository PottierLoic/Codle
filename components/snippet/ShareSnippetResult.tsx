import { useMemo, useState } from "react";
import { SnippetGuessResult } from "@/entities/Snippet";
import { loadProgress } from "@/lib/saveProgress";
import { STORAGE_KEYS } from "@/constants";

function boolEmoji(v: boolean): string {
  return v ? "🟩" : "🟥";
}

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

interface ShareSnippetResultProps {
  dayString: string;
}

export default function ShareSnippetResult({ dayString }: ShareSnippetResultProps) {
  const [copied, setCopied] = useState(false);

  const guesses = useMemo(() => {
    return (
      loadProgress<SnippetGuessResult[]>(
        STORAGE_KEYS.SNIPPET_GUESSES,
        dayString
      ) ?? []
    );
  }, [dayString]);

  const shareText = useMemo(() => {
    if (!guesses.length) return null;

    const winIndex = guesses.findIndex((g) => g.languageMatch === true);
    if (winIndex === -1) return null;

    const attempts = winIndex + 1;

    const grid = guesses.slice(0, attempts).reverse().map((g) => boolEmoji(g.languageMatch));

    return [`Codle (Snippet) ${dayString} — ${attempts} attempts`, ...grid].join(
      "\n"
    );
  }, [guesses, dayString]);

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