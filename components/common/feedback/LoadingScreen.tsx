import React from "react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass px-6 py-5 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/60 mx-auto mb-3" />
        <h2 className="text-base sm:text-lg font-semibold">Loading…</h2>
        <p className="text-sm muted mt-1">Fetching today&apos;s challenge</p>
      </div>
    </div>
  );
}
