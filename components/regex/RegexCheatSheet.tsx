"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0f141a] overflow-hidden">
      <div className="px-3 py-2 border-b border-white/10 bg-[#121821]">
        <h3 className="text-sm sm:text-base font-semibold text-white/90 leading-none">
          {title}
        </h3>
      </div>
      <div className="p-3">{children}</div>
    </section>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-white/10">{children}</div>;
}

function Row({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 py-1.5">
      <div className="font-mono text-white/95 text-xs sm:text-sm whitespace-nowrap">
        {left}
      </div>
      <div className="text-white/80 text-xs sm:text-sm leading-snug">
        {right}
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0f141a] px-3 py-2 text-[11px] sm:text-xs text-white/70 leading-snug">
      {children}
    </div>
  );
}

function CodePill({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-white/90 bg-[#121821] border border-white/10 rounded-md px-1.5 py-0.5">
      {children}
    </code>
  );
}

export default function RegexCheatSheet({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Regex cheat sheet"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="app-container">
        <div className="max-w-6xl mx-auto mt-4 bg-[#0b0f14] rounded-md shadow-xl relative border border-white/10">
          <button
            className="absolute top-3 right-3 btn focus-ring px-3 py-2 z-10"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <X size={18} />
          </button>

          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              <Card title="Single characters">
                <Table>
                  <Row left="." right="Any char (except newline)." />
                  <Row left="\d" right="Digit." />
                  <Row left="\D" right="Not digit." />
                  <Row left="\w" right="Word char." />
                  <Row left="\W" right="Not word." />
                  <Row left="\s" right="Whitespace." />
                  <Row left="\S" right="Not whitespace." />
                </Table>
              </Card>

              <Card title="Quantifiers">
                <Table>
                  <Row left="*" right="0+ greedy." />
                  <Row left="+" right="1+ greedy." />
                  <Row left="?" right="0/1 greedy." />
                  <Row left="{m}" right="Exactly m." />
                  <Row left="{m,}" right="At least m." />
                  <Row left="{m,n}" right="m..n." />
                  <Row left="*? +? ??" right="Lazy." />
                </Table>
              </Card>

              <Card title="Groups">
                <Table>
                  <Row left="(abc)" right="Capture." />
                  <Row left="(?:abc)" right="Non-capture." />
                  <Row left="a|b" right="OR." />
                  <Row left="$1, $2…" right="Insert groups." />
                </Table>
              </Card>

              <Card title="Character classes">
                <Table>
                  <Row left="[abc]" right="One of." />
                  <Row left="[^abc]" right="Not." />
                  <Row left="[a-z]" right="Range." />
                  <Row left="[A-Za-z0-9_]" right="Explicit." />
                  <Row left="[.-]" right="Dot + dash." />
                </Table>
              </Card>

              <Card title="Anchors">
                <Table>
                  <Row left="^" right="Start." />
                  <Row left="$" right="End." />
                  <Row left="\b" right="Word boundary." />
                </Table>
              </Card>

              <Card title="Lookarounds">
                <Table>
                  <Row left="(?=abc)" right="Ahead yes." />
                  <Row left="(?!abc)" right="Ahead no." />
                  <Row left="(?<=abc)" right="Behind yes." />
                  <Row left="(?<!abc)" right="Behind no." />
                </Table>
              </Card>

              <div className="hidden xl:block" />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-[11px] sm:text-xs muted">
                Press <CodePill>Esc</CodePill> to close
              </div>

              <button
                className="btn focus-ring px-4 py-2"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
