import Timer from "@/components/common/ui/Timer";
import { FullLanguage } from "@/entities/Language";
import { FullSnippet } from "@/entities/Snippet";

interface WinMessageProps {
  language: FullLanguage;
  snippet: FullSnippet;
}

export default function WinMessage({ language, snippet }: WinMessageProps) {
  return (
    <div className="mt-4 w-full max-w-2xl glass p-4 sm:p-5">
      <h2 className="text-lg sm:text-xl font-semibold mb-2">
        Congratulations, the answer is{" "}
        {language?.link ? (
          <a
            href={language.link}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded px-1 py-0.5 font-bold underline decoration-white/30 hover:bg-white/5 transition"
          >
            {language.name}
          </a>
        ) : (
          <strong>{language.name}</strong>
        )}
        !
      </h2>

      {language?.description && (
        <p className="mb-2 muted">{language.description}</p>
      )}

      {snippet && (
        <div className="mt-3">
          <p className="text-sm font-semibold text-white/80 mb-1">
            About the snippet:
          </p>
          <p className="mb-2">
            {snippet.description}
            {snippet.link && (
              <>
                {" "}
                <a
                  href={snippet.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring rounded px-1 py-0.5 underline decoration-white/30 hover:bg-white/5 transition"
                >
                  Learn more.
                </a>
              </>
            )}
          </p>
        </div>
      )}

      <Timer />

      <p className="mt-4 text-sm muted">
        Want to submit a new snippet?{" "}
        <a
          href="https://github.com/PottierLoic/Codle/issues/new?template=new-snippet-request.md"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring rounded px-1 py-0.5 underline decoration-white/30 hover:bg-white/5 transition"
        >
          Open an issue
        </a>
        .
      </p>
    </div>
  );
}
