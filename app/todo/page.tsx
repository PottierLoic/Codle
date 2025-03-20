"use client";

import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function TodoGame() {
   return (
       <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center p-4">
              <h1 className="text-4xl font-bold mb-4">Not done yet</h1>
            </main>
            <Footer />
          </div>
    )
}