// src/app/desmama/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DesmamaPage() {
  const [filhotes, setFilhotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFilhotesProntosParaDesmama = async () => {
      try {
        const res = await fetch("/api/desmama");
        const data = await res.json();
        setFilhotes(data);
      } catch (error) {
        console.error("Erro ao buscar filhotes para desmama:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilhotesProntosParaDesmama();
  }, []);

  const handleDesmama = (filhote) => {
    // Redireciona para a página de criação de matriz sem marcar o filhote como desmamado
    if (filhote.sexo === "Fêmea") {
      // Constrói a URL com os parâmetros de query
      const query = new URLSearchParams({
        nomeMae: filhote.matriz?.nome || "",
        nomePai: filhote.nomePai || "",
        dataNascimento: filhote.dataNascimento,
        numeroMatriz: filhote.numero || "",
        proprietario: filhote.matriz?.proprietario || "",
        filhoteId: filhote._id, // Envia o ID do filhote para vinculação
      }).toString();

      router.push(`/matrizes/new?${query}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="bg-white shadow mb-10">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Filhotes para Desmama
          </h1>
        </div>
      </header>
      {filhotes.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Matriz (Mãe)</th>
              <th>Data de Nascimento</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filhotes.map((filhote) => (
              <tr key={filhote._id}>
                <td>
                  {filhote.matriz?.nome} - {filhote.matriz?.numero}
                </td>
                <td>{new Date(filhote.dataNascimento).toLocaleDateString()}</td>
                <td>{filhote.situacao}</td>
                <td>
                  <button
                    onClick={() => handleDesmama(filhote)}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    Confirmar Desmama
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum filhote pronto para desmama.</p>
      )}
    </div>
  );
}
