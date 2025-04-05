import Timer from "@/components/common/ui/Timer";
import { FullLanguage } from "@/entities/Language";

interface WinMessageProps {
  language: FullLanguage;
}

export default function WinMessage({ language }: WinMessageProps) {
  return (
    <div className="mt-4 p-2 bg-gray-800 rounded">
      <h2 className="text-xl font-semibold mb-2">
        Congratulations, the answer is{" "}
        {language?.link ? (
          <a
            href={language.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline font-bold"
          >
            {language.name}
          </a>
        ) : (
          <strong>{language.name}</strong>
        )}
        !
      </h2>
      {language?.description && (
        <p className="mb-2">{language.description}</p>
      )}
      <Timer />
      <p className="mt-4 text-sm text-gray-400">
        Want to submit a new language?{" "}
        <a
          href="https://github.com/PottierLoic/Codle/issues/new?template=new-language-request.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          Open an issue
        </a>
        .
      </p>
    </div>
  );
}
