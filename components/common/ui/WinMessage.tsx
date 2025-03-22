import Timer from "./Timer";

interface WinMessageProps {
  name: string;
  description: string;
  link?: string;
}

export default function WinMessage({ name, description, link }: WinMessageProps) {
  return (
    <div className="mt-4 p-2 bg-gray-800 rounded">
      <h2 className="text-xl font-semibold mb-2">
        Congratulations, today&apos;s language is <strong>{name}</strong>!
      </h2>
      <p className="mb-2">{description}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          Learn more about {name}
        </a>
      )}
      <Timer />
    </div>
  );
} 