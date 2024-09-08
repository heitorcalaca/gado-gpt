// src/app/matrizes/MatrizesTable.js
"use client";

export default function MatrizesTable({ matrizes }) {
  const handleDoubleClick = (id) => {
    window.location.href = `/matrizes/${id}`;
  };

  return (
    <table className="table">
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
            onDoubleClick={() => handleDoubleClick(matriz._id)}
          >
            <td>
              <a href={`/matrizes/${matriz._id}`}>{matriz.nome}</a>
            </td>
            <td>{matriz.numero}</td>
            <td>{matriz.proprietario}</td>
            <td>{matriz.situacao}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
