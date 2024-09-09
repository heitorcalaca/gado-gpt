// src/app/machos/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MachoDetailPage() {
  const [macho, setMacho] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams(); // Obter o ID do macho a partir da URL
  const router = useRouter();

  useEffect(() => {
    const fetchMacho = async () => {
      try {
        const res = await fetch(`/api/machos/${id}`);
        const data = await res.json();
        setMacho(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar macho:", error);
        setIsLoading(false);
      }
    };

    fetchMacho();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!macho) {
    return <p>Macho não encontrado</p>;
  }

  // Função para formatar a data em um formato legível
  const formatarData = (data) => {
    const dateObj = new Date(data);
    return dateObj.toLocaleDateString("pt-BR");
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Detalhes do Macho
          </h1>
        </div>
      </header>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-7xl">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Informações do Macho
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detalhes e histórico de pesagens.
            </p>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Número</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {macho.numero}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Lote</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {macho.lote}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Nome do Pai
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {macho.nomePai}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Nome da Mãe
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {macho.nomeMae}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Proprietário
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {macho.proprietario}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Situação</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {macho.situacao === "NO"
                    ? "Normal"
                    : macho.situacao === "MO"
                    ? "Morto"
                    : macho.situacao === "SU"
                    ? "Sumiu"
                    : "Vendido"}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Data de Nascimento
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {macho.dataNascimento
                    ? formatarData(macho.dataNascimento)
                    : "Sem data"}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Características
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {macho.caracteristicas.length > 0
                    ? macho.caracteristicas.join(", ")
                    : "Sem características"}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Observações
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {macho.observacao ? macho.observacao : "Sem observações"}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Histórico de Pesagens
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {macho.pesagens.length > 0 ? (
                    <ul>
                      {macho.pesagens.map((pesagem, index) => (
                        <li key={index}>
                          {formatarData(pesagem.data)} - {pesagem.peso} Kg
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "Sem pesagens registradas"
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="px-4 py-4 sm:px-6">
            <button
              onClick={() => router.push("/machos")}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Voltar para Lista de Machos
            </button>

            <button
              onClick={() => router.push(`/machos/${macho._id}/edit`)} // Redireciona para a página de edição
              className="inline-flex justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Editar Macho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
