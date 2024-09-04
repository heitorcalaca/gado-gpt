"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div className="container mx-auto p-4">
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
  );
}
