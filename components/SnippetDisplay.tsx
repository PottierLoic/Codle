import { Snippet } from "@/hooks/useSnippets";

interface SnippetDisplayProps {
  snippet: Snippet;
}

export default function SnippetDisplay({ snippet }: SnippetDisplayProps) {
  return (
    <div className="w-full max-w-3xl bg-gray-800 text-white p-4 rounded-lg shadow-lg mt-4">
      <h3 className="text-lg font-semibold mb-2">Today&apos;s Snippet</h3>
      <pre className="bg-gray-900 p-4 rounded overflow-x-auto whitespace-pre-wrap">
        <code>{snippet.snippet}</code>
      </pre>
    </div>
  );
}
