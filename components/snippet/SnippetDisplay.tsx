import { Snippet } from "@/entities/Snippet";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface SnippetDisplayProps {
  snippet: Snippet;
  syntaxName?: string;
  enableSyntaxHighlighting?: boolean;
}

export default function SnippetDisplay({
  snippet,
  syntaxName,
  enableSyntaxHighlighting = true,
}: SnippetDisplayProps) {
  return (
    <div className="w-full max-w-screen-lg glass p-3 sm:p-4 m-3">
      <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
        <SyntaxHighlighter
          language={enableSyntaxHighlighting ? syntaxName : "plaintext"}
          style={tomorrow}
          className="!bg-transparent !m-0 text-sm sm:text-base"
          wrapLongLines={true}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
