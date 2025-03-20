import { Snippet } from "@/hooks/useDailySnippet";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface SnippetDisplayProps {
  snippet: Snippet;
  syntaxName?: string;
}

export default function SnippetDisplay({ snippet, syntaxName }: SnippetDisplayProps) {
  return (
    <div className="w-full max-w-screen-lg bg-gray-800 text-white p-4 rounded-lg shadow-lg mt-4">
      <SyntaxHighlighter
        language={syntaxName || "javascript"}
        style={tomorrow}
        className="rounded overflow-x-auto !bg-gray-700"
        wrapLongLines={true}
      >
        {snippet.snippet}
      </SyntaxHighlighter>
    </div>
  );
}
