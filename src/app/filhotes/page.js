// src/app/filhotes/page.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import FilhotesList from "./FilhotesList";
import Link from "next/link";

export default async function FilhotesPage() {
  await connectToDatabase();
  const filhotes = await Filhote.find({}).populate("matriz").lean();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Listagem de Filhotes</h1>
        <Link href="/filhotes/new">
          <button className="bg-blue-500 text-white p-2 rounded">
            Adicionar Novo Filhote
          </button>
        </Link>
      </div>
      <FilhotesList filhotes={filhotes} />
    </div>
  );
}
