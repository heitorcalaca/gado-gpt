// src/app/machos/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MachosList() {
  const [machos, setMachos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMachos = async () => {
      const res = await fetch("/api/machos");
      const data = await res.json();
      setMachos(data);
      setIsLoading(false);
    };

    fetchMachos();
  }, []);

  // Função para obter o peso mais recente e calcular arrobas
  const getPesoAtual = (pesagens) => {
    if (pesagens.length === 0) {
      return { pesoKg: "Sem dados", pesoArrobas: "Sem dados" };
    }

    const ultimaPesagem = pesagens[pesagens.length - 1];
    const pesoKg = ultimaPesagem.peso;
    const pesoArrobas = (pesoKg / 15).toFixed(2); // 1 arroba = 15 kg

    return { pesoKg, pesoArrobas };
  };

  // Função para redirecionar ao detalhe do macho
  const handleDoubleClick = (machoId) => {
    router.push(`/machos/${machoId}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Lista de Machos
          </h1>
        </div>
      </header>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-7xl">
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
                  Lote
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Situação
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Peso Atual (Kg)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Peso Atual (@)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {machos.map((macho) => {
                const { pesoKg, pesoArrobas } = getPesoAtual(macho.pesagens);
                return (
                  <tr
                    key={macho._id}
                    className="cursor-pointer hover:bg-gray-100"
                    onDoubleClick={() => handleDoubleClick(macho._id)} // Duplo clique para navegar para detalhes
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {macho.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {macho.lote}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {macho.situacao === "NO"
                        ? "Normal"
                        : macho.situacao === "MO"
                        ? "Morto"
                        : macho.situacao === "SU"
                        ? "Sumiu"
                        : "Vendido"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pesoKg}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pesoArrobas}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
