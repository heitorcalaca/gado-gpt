// src/app/matrizes/page.js
import Link from "next/link";
import connectToDatabase from "@/lib/mongoose";
import Matriz from "@/models/Matriz";
import MatrizesTable from "./MatrizesTable";
import PrintButton from "./PrintButton";

export default async function MatrizesPage() {
  await connectToDatabase();
  const matrizes = await Matriz.find({});
  const plainMatrizes = JSON.parse(JSON.stringify(matrizes)); // Converte para plain objects

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Listagem de Matrizes</h1>
      <div className="flex gap-2 mb-4">
        <Link href="/dashboard">
          <button className="bg-gray-500 text-white p-2 rounded">
            Retornar ao Dashboard
          </button>
        </Link>
        <Link href="/matrizes/new">
          <button className="bg-blue-500 text-white p-2 rounded">
            Adicionar Nova Matriz
          </button>
        </Link>
        <PrintButton matrizes={plainMatrizes} />
      </div>
      <MatrizesTable matrizes={plainMatrizes} />
    </div>
  );
}
