"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar"; // Importa o NavBar para ser utilizado no layout

export default function DashboardClient() {
  const [desmamaAviso, setDesmamaAviso] = useState(null);

  useEffect(() => {
    const verificarDesmama = async () => {
      const res = await fetch("/api/filhotes/desmama");
      const data = await res.json();

      if (data.length > 0) {
        setDesmamaAviso(`${data.length} filhote(s) precisam ser desmamados.`);
      }
    };

    verificarDesmama();
  }, []);

  return (
    <div className="min-h-full">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {desmamaAviso && (
            <div className="bg-yellow-500 text-white p-4 rounded mb-4">
              {desmamaAviso}
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            <Link
              href="/matrizes"
              className="block p-4 border rounded shadow hover:bg-gray-100"
            >
              <h2 className="text-xl font-bold mb-2">Matrizes</h2>
            </Link>

            <Link
              href="/filhotes"
              className="block p-4 border rounded shadow hover:bg-gray-100"
            >
              <h2 className="text-xl font-bold mb-2">Filhotes</h2>
            </Link>

            <Link
              href="/machos"
              className="block p-4 border rounded shadow hover:bg-gray-100"
            >
              <h2 className="text-xl font-bold mb-2">Machos</h2>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
