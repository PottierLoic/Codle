"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-lg border border-white/10 bg-[#0b0f14] px-3 py-2 text-[11px] sm:text-xs text-white/70 leading-snug">
      {children}
    </div>
  );
}

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
        <h3 className="text-sm sm:text-base font-semibold text-white/90">
          {title}
        </h3>
      </div>

      <div className="p-3">
        {children}
      </div>
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
      <div className="text-white/80 text-xs sm:text-sm">
        {right}
      </div>
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


function Columns({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {children}
    </div>
  );
}

function Column({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {children}
    </div>
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
      className="fixed inset-0 z-[9999] bg-black/90 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="app-container py-6">
        <div className="max-w-6xl w-full mx-auto bg-[#0b0f14] rounded-md shadow-xl relative border border-white/10 max-h-[80vh] flex flex-col overflow-hidden"> 
          <div className="sticky top-0 bg-[#0b0f14] border-b border-white/10 z-10">
            <div className="flex items-center justify-between p-3 sm:p-4">
              <span className="text-white/90 font-semibold">
                Regex cheat sheet
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60 hidden sm:block">
                  Press <CodePill>Esc</CodePill>
                </span>

                <button
                  className="btn focus-ring px-3 py-2"
                  onClick={onClose}
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 overflow-y-auto">
            <Columns>
              {/* COLUMN 1 */}
              <Column>
                <Card title="Anchors">
                  <Table>
                    <Row left="^" right="Start of string / line" />
                    <Row left="$" right="End of string / line" />
                    <Row left="\A" right="Start of string" />
                    <Row left="\Z" right="End of string" />
                    <Row left="\b" right="Word boundary" />
                    <Row left="\B" right="Not word boundary" />
                    <Row left="\<" right="Start of word" />
                    <Row left="\>" right="End of word" />
                  </Table>
                </Card>

                <Card title="Character Classes">
                  <Table>
                    <Row left="\c" right="Control character" />
                    <Row left="\s" right="White space" />
                    <Row left="\S" right="Not white space" />
                    <Row left="\d" right="Digit" />
                    <Row left="\D" right="Not digit" />
                    <Row left="\w" right="Word" />
                    <Row left="\W" right="Not word" />                 
                  </Table>
                </Card>

                <Card title="String Replacement">
                  <Table>
                    <Row left="$n" right="nth non-passive group" />
                    <Row left="$2" right="'xyz' in /^(abc(xyz))$/" />
                    <Row left="$1" right="'xyz' in /^(?:abc)(xyz)$/" />
                    <Row left="$`" right="Before matched string" />
                    <Row left="$'" right="After matched string" />
                    <Row left="$+" right="Last matched string" />
                    <Row left="$&" right="Entire matched string" />
                  </Table>
                  <Note>
                    Some regex implementations use \ instead of $.
                  </Note>
                </Card>

              </Column>

              {/* COLUMN 2 */}
              <Column>
                <Card title="Groups and ranges">
                  <Table>
                    <Row left="." right="Any character except newline" />
                    <Row left="(a|b)" right="a or b" />
                    <Row left="(...)" right="Group" />
                    <Row left="(?:...)" right="Passive (non-capturing) group" />
                    <Row left="[abc]" right="a or b or c  " />
                    <Row left="[^abc]" right="Not a or b or c" />
                    <Row left="[a-q]" right="Lowercase from a to q" />
                    <Row left="[A-Q]" right="Uppercase from A to Q" />
                    <Row left="[0-7]" right="Digits from 0 to 7" />
                    <Row left="\x" right="Group/subpattern number x" />
                  </Table>
                  <Note>
                    Ranges are inclusive.
                  </Note>
                </Card>

                <Card title="Escape Sequences">
                  <Table>
                    <Row left="\" right="Escape following character" />
                    <Row left="\Q" right="Begin literal sequence" />
                    <Row left="\E" right="End literal sequence" />
                  </Table>
                  <Note>
                    "Escaping" is a way of treating characters which have a special meaning in regular expressions literally, rather than as special characters.
                  </Note>
                </Card>

                <Card title="Assertions">
                  <Table>
                    <Row left="?=" right="Lookahead assertion" />
                    <Row left="?!" right="Negative lookahead" />
                    <Row left="?<=" right="Lookbehind assertion" />
                    <Row left="?!= or ?<!" right="Negative lookbehind" />
                    <Row left="?>" right="Once-only subexpression" />
                    <Row left="?()" right="Condition [if then]" />
                    <Row left="?()|" right="Condition [if then else]" />
                    <Row left="?#" right="Comment" />
                  </Table>
                  <Note>
                    Assertions validate context conditions. They do not consume or return characters.
                  </Note>
                </Card>
              </Column>

              {/* COLUMN 3 */}
              <Column>
                <Card title="Quantifiers">
                  <Table>
                    <Row left="*" right="0 or more" />
                    <Row left="+" right="1 or more" />
                    <Row left="?" right="0 or 1" />
                    <Row left="{3}" right="Exactly 3" />
                    <Row left="{3,}" right="3 or more" />
                    <Row left="{3,5}" right="3, 4 or 5" />
                  </Table>
                  <Note>
                    Add a ? to a quantifier to make it ungreedy.
                  </Note>
                </Card>

                <Card title="Pattern Modifiers">
                  <Table>
                    <Row left="g" right="Global match" />
                    <Row left="i *" right="Case-insensitive" />
                    <Row left="m *" right="Multiple lines" />
                    <Row left="s *" right="Treat string as single line" />
                    <Row left="x *" right="Allow comments and whitespace in pattern" />
                    <Row left="e *" right="Evaluate replacement" />
                    <Row left="U *" right="Ungreedy pattern" />
                  </Table>
                  <Note>
                    * PCRE modifier.
                  </Note>
                </Card>

                <Card title="Special Characters">
                  <Table>
                    <Row left="\n" right="New line" />
                    <Row left="\r" right="Carriage return" />
                    <Row left="\t" right="Tab" />
                    <Row left="\v" right="Vertical tab" />
                    <Row left="\f" right="Form feed" />
                    <Row left="\xxx" right="Octal character xxx" />
                    <Row left="\xhh" right="Hex character hh" />
                  </Table>
                </Card>
              </Column>
            </Columns>
          </div>
        </div>
      </div>
    </div>
  );
}
