export default function Footer() {
  return (
    <footer className="w-full">
      <div className="app-container">
        <div className="glass px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <span className="muted">Made by Loïc Pottier • v0.0.1</span>
            <a
              href="https://github.com/PottierLoic/Codle"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-lg px-2 py-1 hover:bg-white/5 transition"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
