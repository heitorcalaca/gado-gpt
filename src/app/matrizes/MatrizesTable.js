// src/app/matrizes/MatrizesTable.js
"use client";

export default function MatrizesTable({ matrizes }) {
  const handleDoubleClick = (id) => {
    window.location.href = `/matrizes/${id}`;
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Nome</th>
          <th className="py-2">Número</th>
          <th className="py-2">Proprietário</th>
          <th className="py-2">Situação</th>
        </tr>
      </thead>
      <tbody>
        {matrizes.map((matriz) => (
          <tr
            key={matriz._id}
            className="cursor-pointer hover:bg-gray-100"
            onDoubleClick={() => handleDoubleClick(matriz._id)}
          >
            <td className="border px-4 py-2">
              <a href={`/matrizes/${matriz._id}`}>{matriz.nome}</a>
            </td>
            <td className="border px-4 py-2">{matriz.numero}</td>
            <td className="border px-4 py-2">{matriz.proprietario}</td>
            <td className="border px-4 py-2">{matriz.situacao}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
