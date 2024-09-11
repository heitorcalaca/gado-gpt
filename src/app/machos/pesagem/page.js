// src/app/machos/pesagem/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PesagemPorLote() {
  const [lotes, setLotes] = useState([]);
  const [machos, setMachos] = useState([]);
  const [selectedLote, setSelectedLote] = useState("");
  const [pesagens, setPesagens] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Função para buscar os lotes disponíveis
    const fetchLotes = async () => {
      try {
        const res = await fetch("/api/lotes"); // API para buscar lotes (assumimos que esta API retorna lotes únicos)
        const data = await res.json();
        setLotes(data);
      } catch (error) {
        console.error("Erro ao buscar lotes:", error);
      }
    };

    fetchLotes();
  }, []);

  // Função para buscar machos de um lote específico
  const fetchMachosPorLote = async (lote) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/machos?lote=${lote}`); // API para buscar machos por lote
      const data = await res.json();
      setMachos(data);
      setPesagens({});
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar machos por lote:", error);
      setIsLoading(false);
    }
  };

  const handleLoteChange = (e) => {
    const selectedLote = e.target.value;
    setSelectedLote(selectedLote);
    fetchMachosPorLote(selectedLote); // Buscar machos quando um lote for selecionado
  };

  // Atualizar o valor de pesagem de cada macho
  const handlePesoChange = (machoId, peso) => {
    setPesagens((prevPesagens) => ({
      ...prevPesagens,
      [machoId]: peso,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/machos/pesagem/lote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lote: selectedLote,
          pesagens,
        }),
      });

      if (res.ok) {
        router.push("/machos");
      } else {
        console.error("Erro ao salvar pesagens");
      }
    } catch (error) {
      console.error("Erro ao salvar pesagens:", error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Registro de Pesagem por Lote
          </h1>
        </div>
      </header>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-7xl">
        {/* Seleção de lote */}
        <div className="mb-4">
          <label
            htmlFor="lote"
            className="block text-sm font-medium text-gray-700"
          >
            Selecione o Lote
          </label>
          <select
            id="lote"
            name="lote"
            value={selectedLote}
            onChange={handleLoteChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
          >
            <option value="">Selecione um lote</option>
            {lotes.map((lote) => (
              <option key={lote} value={lote}>
                {lote}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de machos do lote selecionado */}
        {machos.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Número
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Peso (Kg)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {machos.map((macho) => (
                    <tr key={macho._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {macho.numero}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="number"
                          value={pesagens[macho._id] || ""}
                          onChange={(e) =>
                            handlePesoChange(macho._id, e.target.value)
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Peso em Kg"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Salvar Pesagens do Lote
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
