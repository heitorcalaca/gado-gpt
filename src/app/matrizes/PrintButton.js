"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintableTemplate from "./PrintableTemplate";

export default function PrintButton({ matrizes }) {
  const documentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => documentRef.current,
    documentTitle: `Relatório-Matrizes`,
    removeAfterPrint: true, //Remove o elemento do DOM após a impressão
  });

  return (
    <div>
      <button
        onClick={handlePrint}
        className="bg-green-500 text-white p-2 rounded"
      >
        Gerar Relatório em PDF
      </button>

      {/* Template invisível, não vai aparecer na tela */}
      <div style={{ display: "none" }}>
        <PrintableTemplate ref={documentRef} matrizes={matrizes} />
      </div>
    </div>
  );
}
