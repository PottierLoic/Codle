import Timer from "@/components/common/ui/Timer";
import { FullLanguage } from "@/entities/Language";

interface WinMessageProps {
  language: FullLanguage;
}

export default function WinMessage({ language }: WinMessageProps) {
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

      <Timer />

      <p className="mt-4 text-sm muted">
        Want to submit a new language?{" "}
        <a
          href="https://github.com/PottierLoic/Codle/issues/new?template=new-language-request.md"
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
