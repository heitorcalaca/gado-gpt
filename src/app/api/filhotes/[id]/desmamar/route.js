// src/app/api/filhotes/[id]/desmamar/route.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  await connectToDatabase();

  const filhoteId = params.id;

  // Atualizar a situação do filhote para "Desmamado" (ou qualquer outra situação adequada)
  const filhote = await Filhote.findByIdAndUpdate(
    filhoteId,
    { situacao: "DE" },
    { new: true }
  );

  if (!filhote) {
    return NextResponse.json(
      { message: "Filhote não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(filhote);
}
