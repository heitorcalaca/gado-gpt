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
          className="form-input mb-2"
        />
        <select
          value={situacaoFilter}
          onChange={handleSituacaoFilter}
          className="form-input"
        >
          <option value="">Filtrar por Situação</option>
          <option value="NO">Normal (NO)</option>
          <option value="MO">Morto (MO)</option>
          <option value="SU">Sumiu (SU)</option>
          <option value="VE">Vendido (VE)</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Matriz (Mãe)</th>
            <th>Data de Nascimento</th>
            <th>Situação</th>
            <th>Previsão de Desmama</th>
          </tr>
        </thead>
        <tbody>
          {filteredFilhotes.map((filhote) => (
            <tr
              key={filhote._id}
              onDoubleClick={() =>
                (window.location.href = `/filhotes/${filhote._id}`)
              }
            >
              <td>
                {filhote.matriz.nome} - {filhote.matriz.numero}
              </td>
              <td>{new Date(filhote.dataNascimento).toLocaleDateString()}</td>
              <td>{filhote.situacao}</td>
              <td>{new Date(filhote.previsaoDesmama).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
