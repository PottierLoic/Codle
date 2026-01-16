"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/common/layout/Header";
import Footer from "@/components/common/layout/Footer";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="app-container">
          <div className="glass glass-strong p-6 sm:p-10">
            <div className="flex flex-col items-center text-center gap-6">
              <Image
                src="/codle-icon-512x512.png"
                alt="Codle Icon"
                width={160}
                height={160}
                className="select-none"
                priority
              />

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Codle
                </h1>
                <p className="muted text-base sm:text-lg">
                  Daily coding challenges. Minimal UI. Maximum signal.
                </p>
              </div>

              <div className="w-full max-w-md grid gap-3">
                <button
                  onClick={() => router.push("/language")}
                  className="btn btn-primary focus-ring w-full px-5 py-3 text-base sm:text-lg"
                >
                  Guess the programming language
                </button>
                <button
                  onClick={() => router.push("/snippet")}
                  className="btn focus-ring w-full px-5 py-3 text-base sm:text-lg"
                >
                  Guess from a code snippet
                </button>
                <button
                  onClick={() => router.push("/regex")}
                  className="btn focus-ring w-full px-5 py-3 text-base sm:text-lg"
                >
                  Regex challenge <span className="muted">(new)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
