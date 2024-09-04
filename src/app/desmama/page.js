// src/app/desmama/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Filhotes Prontos para Desmama</h1>
      {filhotes.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Matriz (Mãe)</th>
              <th className="py-2">Data de Nascimento</th>
              <th className="py-2">Situação</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filhotes.map((filhote) => (
              <tr key={filhote._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">
                  {filhote.matriz?.nome} - {filhote.matriz?.numero}
                </td>
                <td className="border px-4 py-2">
                  {new Date(filhote.dataNascimento).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{filhote.situacao}</td>
                <td className="border px-4 py-2">
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
