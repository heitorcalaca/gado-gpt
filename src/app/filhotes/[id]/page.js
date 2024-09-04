// src/app/filhotes/[id]/page.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import FilhoteDetails from "./FilhoteDetails";

export default async function FilhoteDetailsPage({ params }) {
  await connectToDatabase();
  const filhote = await Filhote.findById(params.id).populate("matriz").lean();

  if (!filhote) {
    return <div>Filhote não encontrado</div>;
  }

  // Convertendo _id para string
  filhote._id = filhote._id.toString();
  filhote.matriz._id = filhote.matriz._id.toString();

  return <FilhoteDetails initialData={filhote} />;
}
