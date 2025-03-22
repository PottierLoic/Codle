import { useEffect, useState } from "react";

interface TimerProps {
  targetHour?: number;
}

export default function Timer({ targetHour = 0 }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nextGame = new Date();
      nextGame.setUTCHours(0, 0, 0, 0);
      if (now > nextGame) {
        nextGame.setUTCDate(nextGame.getUTCDate() + 1);
      }
      const diff = nextGame.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetHour]);

  return (
    <div className="text-center mt-6">
      <p className="text-lg text-gray-400">Next game coming in:</p>
      <div className="text-4xl font-bold text-white bg-gray-800 px-4 py-2 rounded-lg shadow-lg inline-block">
        {timeLeft}
      </div>
    </div>
  );
}
