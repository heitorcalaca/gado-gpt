// src/app/filhotes/FilhotesList.js
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
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por matriz ou data..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 w-full mb-2"
        />
        <select
          value={situacaoFilter}
          onChange={handleSituacaoFilter}
          className="border p-2 w-full"
        >
          <option value="">Filtrar por Situação</option>
          <option value="NO">Normal (NO)</option>
          <option value="MO">Morto (MO)</option>
          <option value="SU">Sumiu (SU)</option>
          <option value="VE">Vendido (VE)</option>
        </select>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Matriz (Mãe)</th>
            <th className="py-2">Data de Nascimento</th>
            <th className="py-2">Situação</th>
            <th className="py-2">Previsão de Desmama</th>
            <th className="py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredFilhotes.map((filhote) => (
            <tr key={filhote._id} className="hover:bg-gray-100 cursor-pointer">
              <td className="border px-4 py-2">
                {filhote.matriz.nome} - {filhote.matriz.numero}
              </td>
              <td className="border px-4 py-2">
                {new Date(filhote.dataNascimento).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{filhote.situacao}</td>
              <td className="border px-4 py-2">
                {new Date(filhote.previsaoDesmama).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                <Link href={`/filhotes/${filhote._id}`}>
                  <button className="bg-yellow-500 text-white p-2 rounded">
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
