// src/app/filhotes/[id]/page.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import FilhoteDetails from "./FIlhoteDetails";

export default async function FilhoteDetailsPage({ params }) {
  await connectToDatabase();
  const filhote = await Filhote.findById(params.id).populate("matriz").lean();

  if (!filhote) {
    return <div>Filhote não encontrado</div>;
  }

  // Converte o objeto do MongoDB para um plain object
  const plainFilhote = JSON.parse(JSON.stringify(filhote));

  return <FilhoteDetails initialData={plainFilhote} />;
}
