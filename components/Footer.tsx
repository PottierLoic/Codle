export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-5xl mx-auto flex justify-center items-center gap-4 text-center px-4">
        <span>Made by Loïc Pottier • v0.0.1</span>
        <a
          href="https://github.com/PottierLoic/Codle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          GitHub Repository
        </a>
      </div>
    </footer>
  )
}
