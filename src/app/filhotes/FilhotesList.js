// src/app/filhotes/FilhotesList.js
"use client";

import { useRouter } from "next/navigation";

export default function FilhotesList({ filhotes }) {
  const router = useRouter();

  const handleDoubleClick = (id) => {
    router.push(`/filhotes/${id}`);
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Matriz (Mãe)</th>
          <th className="py-2">Data de Nascimento</th>
          <th className="py-2">Situação</th>
          <th className="py-2">Previsão de Desmama</th>
        </tr>
      </thead>
      <tbody>
        {filhotes.map((filhote) => (
          <tr
            key={filhote._id}
            className="hover:bg-gray-100 cursor-pointer"
            onDoubleClick={() => handleDoubleClick(filhote._id)}
          >
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
