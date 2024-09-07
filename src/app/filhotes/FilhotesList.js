"use client";

import { useState } from "react";
import Link from "next/link";

export default function FilhotesList({ filhotes }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [situacaoFilter, setSituacaoFilter] = useState("");
  const [filteredFilhotes, setFilteredFilhotes] = useState(filhotes);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterFilhotes(value, situacaoFilter);
  };

  const handleSituacaoFilter = (e) => {
    const value = e.target.value;
    setSituacaoFilter(value);
    filterFilhotes(searchTerm, value);
  };

  const filterFilhotes = (search, situacao) => {
    let filtered = filhotes;

    if (search) {
      filtered = filtered.filter(
        (filhote) =>
          filhote.matriz.nome.toLowerCase().includes(search) ||
          new Date(filhote.dataNascimento).toLocaleDateString().includes(search)
      );
    }

    if (situacao) {
      filtered = filtered.filter((filhote) => filhote.situacao === situacao);
    }

    setFilteredFilhotes(filtered);
  };

  return (
    <div className="min-h-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por matriz ou data..."
          value={searchTerm}
          onChange={handleSearch}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-2 py-2"
        />
        <select
          value={situacaoFilter}
          onChange={handleSituacaoFilter}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
        >
          <option value="">Filtrar por Situação</option>
          <option value="NO">Normal (NO)</option>
          <option value="MO">Morto (MO)</option>
          <option value="SU">Sumiu (SU)</option>
          <option value="VE">Vendido (VE)</option>
        </select>
      </div>

      <table className="min-w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Matriz (Mãe)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Nascimento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Situação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Previsão de Desmama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredFilhotes.map((filhote) => (
            <tr key={filhote._id} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap">
                {filhote.matriz.nome} - {filhote.matriz.numero}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(filhote.dataNascimento).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {filhote.situacao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(filhote.previsaoDesmama).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/filhotes/${filhote._id}`}>
                  <button className="inline-flex items-center justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Editar
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
