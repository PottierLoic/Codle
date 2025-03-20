import { Switch } from "@headlessui/react";

interface ChallengeSectionProps {
  enableSyntaxHighlighting: boolean;
  setEnableSyntaxHighlighting: (enabled: boolean) => void;
}

export default function ChallengeSection({ enableSyntaxHighlighting, setEnableSyntaxHighlighting }: ChallengeSectionProps) {
  return (
    <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-md text-white flex flex-col items-center">
      <h1 className="text-center text-lg font-bold mb-4">Challenge Mode</h1>
      <div className="w-full flex justify-between items-center">
        <span className="font-semibold">Syntax Highlighting</span>
        <Switch
          checked={enableSyntaxHighlighting}
          onChange={setEnableSyntaxHighlighting}
          className={`${enableSyntaxHighlighting ? "bg-blue-500" : "bg-gray-600"} relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable syntax highlighting</span>
          <span className={`${enableSyntaxHighlighting ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full transition`} />
        </Switch>
      </div>
    </div>
  );
}
