import Timer from "./Timer";
import { Language } from "@/entities/Language";
import { Snippet } from "@/entities/Snippet";

type WinMessageProps =
  | { language: Language; snippet?: never }
  | { snippet: Snippet; language?: Language };

export default function WinMessage({ /*language,*/ snippet }: WinMessageProps) {
  //const name = language?.name ?? snippet?.languageName ?? "Unknown";
  return (
    <div className="mt-4 p-2 bg-gray-800 rounded">
      <h2 className="text-xl font-semibold mb-2">
        Congratulations, the answer is{" "}
        {/* TODO */}
        {/* {language?.link ? (
          <a
            href={language.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline font-bold"
          >
            {name}
          </a>
        ) : (
          <strong>{name}</strong>
        )} */}
        !
      </h2>
      {/* TODO */}
      {/* {language?.description && (
        <p className="mb-2">{language.description}</p>
      )} */}
      {snippet && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-300 mb-1">About the snippet:</p>
          <p className="mb-2">
            {snippet.description}
            {snippet.link && (
              <>
                {" "}
                <a
                  href={snippet.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 underline"
                >
                  Learn more about it.
                </a>
              </>
            )}
          </p>
        </div>
      )}

      <Timer />
    </div>
  );
}
