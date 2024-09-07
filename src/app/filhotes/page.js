"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FilhotesList from "./FilhotesList";

export default function FilhotesPage() {
  const [filhotes, setFilhotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilhotes = async () => {
      try {
        const res = await fetch("/api/filhotes");
        if (res.ok) {
          const data = await res.json();
          setFilhotes(data);
        } else {
          console.error("Erro ao carregar filhotes:", res.statusText);
        }
      } catch (error) {
        console.error("Erro ao carregar filhotes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilhotes();
  }, []);

  if (loading) {
    return <div>Carregando filhotes...</div>;
  }

  return (
    <div className="min-h-full">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Listagem de Filhotes
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard">
              <button className="inline-flex items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Retornar ao Dashboard
              </button>
            </Link>
            <Link href="/filhotes/new">
              <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Adicionar Novo Filhote
              </button>
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <FilhotesList filhotes={filhotes} />
          </div>
        </div>
      </main>
    </div>
  );
}
