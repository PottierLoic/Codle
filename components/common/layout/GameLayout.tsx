import Header from "@/components/common/layout/Header";
import Footer from "@/components/common/layout/Footer";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
} 