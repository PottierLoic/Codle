import Header from "@/components/common/layout/Header";
import Footer from "@/components/common/layout/Footer";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="app-container">
          <div className="glass glass-strong p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
