"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MatrizDetailPage() {
  const [matriz, setMatriz] = useState(null);
  const [filhotes, setFilhotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    // Função para buscar os dados da matriz
    const fetchMatriz = async () => {
      try {
        const res = await fetch(`/api/matrizes/${id}`);
        const data = await res.json();
        setMatriz(data);
        setIsLoading(false);

        const resFilhotes = await fetch(`/api/filhotes?matriz=${id}`);
        const filhotesData = await resFilhotes.json();
        setFilhotes(filhotesData);
      } catch (error) {
        console.error("Erro ao buscar matriz:", error);
        setIsLoading(false);
      }
    };

    fetchMatriz();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!matriz) {
    return <p>Matriz não encontrada</p>;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Detalhes da Matriz
          </h1>
        </div>
      </header>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-7xl">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Informações da Matriz
            </h3>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Número</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {matriz.numero}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nome</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {matriz.nome}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Proprietário
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {matriz.proprietario}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Data de Nascimento
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(matriz.dataNascimento).toLocaleDateString()}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Característica
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {matriz.caracteristicas}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Nome do Pai
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {matriz.nomePai}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Nome da Mãe
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {matriz.nomeMae}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Situação</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {matriz.situacao === "NO" ? "Normal" : matriz.situacao}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Observações
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {matriz.observacao}
                </dd>
              </div>
            </dl>
          </div>

          {/* Histórico de Filhotes */}
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-7xl">
            {/* Histórico de Filhotes */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-7xl">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    Histórico de Filhotes
                  </h2>
                </div>

                <div className="border-t border-gray-200">
                  {filhotes.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Data de Nascimento
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
                            Previsão de Desmama
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filhotes.map((filhote) => (
                          <tr key={filhote._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(
                                filhote.dataNascimento
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {filhote.situacao}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(
                                filhote.previsaoDesmama
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {new Date(filhote.previsaoDesmama) >
                              new Date() ? (
                                <Link href={`/filhotes/${filhote._id}`}>
                                  <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                                    Editar
                                  </button>
                                </Link>
                              ) : (
                                <span className="text-gray-500">Desmamado</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="px-4 py-5 sm:px-6">
                      <p className="text-sm text-gray-500">
                        Nenhum filhote associado a esta matriz.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-4 sm:px-6 flex gap-4">
              <button
                onClick={() => router.push("/matrizes")}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Voltar para Lista de Matrizes
              </button>

              <button
                onClick={() => router.push(`/matrizes/${matriz._id}/edit`)} // Redireciona para a página de edição
                className="inline-flex justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Editar Matriz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
