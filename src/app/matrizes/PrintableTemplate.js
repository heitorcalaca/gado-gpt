// src/app/matrizes/PrintableTemplate.js
"use client";

import { forwardRef } from "react";

const PrintableTemplate = forwardRef(({ matrizes }, ref) => {
  return (
    <div ref={ref} className="p-8">
      <h1 className="text-2xl font-bold mb-4">Relatório de Matrizes</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2 text-left">NOME</th>
            <th className="border-b p-2 text-left">NÚMERO</th>
            <th className="border-b p-2 text-left">PROPRIETÁRIO</th>
            <th className="border-b p-2 text-left">SITUAÇÃO</th>
          </tr>
        </thead>
        <tbody>
          {matrizes.map((matriz, index) => (
            <tr
              key={matriz._id}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="p-2">{matriz.nome}</td>
              <td className="p-2">{matriz.numero}</td>
              <td className="p-2">{matriz.proprietario}</td>
              <td className="p-2">{matriz.situacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

PrintableTemplate.displayName = "PrintableTemplate";

export default PrintableTemplate;
