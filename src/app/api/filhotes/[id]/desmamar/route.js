import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import { NextResponse } from "next/server";

// PUT: Marca o filhote como desmamado
export async function PUT(request, { params }) {
  await connectToDatabase();

  const { id } = params;

  try {
    // Atualiza o filhote, marcando-o como desmamado
    const filhote = await Filhote.findById(id);

    if (!filhote) {
      return NextResponse.json(
        { message: "Filhote não encontrado" },
        { status: 404 }
      );
    }

    filhote.situacao = "Desmamado"; // Marca como desmamado
    await filhote.save();

    return NextResponse.json({ message: "Filhote desmamado com sucesso!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao desmamar filhote", error: error.message },
      { status: 500 }
    );
  }
}
