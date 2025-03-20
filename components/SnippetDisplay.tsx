import { Snippet } from "@/hooks/useSnippet";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface SnippetDisplayProps {
  snippet: Snippet;
  syntaxName?: string;
  enableSyntaxHighlighting?: boolean;
}

export default function SnippetDisplay({ snippet, syntaxName, enableSyntaxHighlighting = true }: SnippetDisplayProps) {
  return (
    <div className="w-full max-w-screen-lg bg-gray-800 text-white p-4 rounded-lg shadow-lg m-3">
      <SyntaxHighlighter
        language={enableSyntaxHighlighting ? syntaxName : "plaintext"}
        style={tomorrow}
        className="rounded overflow-x-auto !bg-gray-700"
        wrapLongLines={true}
      >
        {snippet.code}
      </SyntaxHighlighter>
    </div>
  );
}
