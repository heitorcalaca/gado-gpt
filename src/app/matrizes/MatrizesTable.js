"use client";

export default function MatrizesTable({ matrizes }) {
  const handleDoubleClick = (id) => {
    window.location.href = `/matrizes/${id}`;
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Número</th>
          <th>Proprietário</th>
          <th>Situação</th>
        </tr>
      </thead>
      <tbody>
        {matrizes.map((matriz, index) => (
          <tr
            key={matriz._id}
            className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
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
