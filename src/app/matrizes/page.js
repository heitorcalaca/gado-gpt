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
    <div className="min-h-full">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Listagem de Matrizes
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard">
              <button className="inline-flex items-center justify-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Retornar ao Dashboard
              </button>
            </Link>
            <Link href="/matrizes/new">
              <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Adicionar Nova Matriz
              </button>
            </Link>
            <PrintButton matrizes={plainMatrizes} />
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <MatrizesTable matrizes={plainMatrizes} />
          </div>
        </div>
      </main>
    </div>
  );
}
