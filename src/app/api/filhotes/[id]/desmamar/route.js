import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import { NextResponse } from "next/server";

// PUT: Marca o filhote como desmamado e registra a data de desmama
export async function PUT(request, { params }) {
  await connectToDatabase();

  const { id } = params;
  let requestBody;

  try {
    // Verifica se o corpo da requisição está vazio ou malformado
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Corpo da requisição inválido" },
      { status: 400 }
    );
  }

  const { dataDesmama } = requestBody; // Recebe a data de desmama do frontend

  if (!dataDesmama) {
    return NextResponse.json(
      { message: "Data de desmama não fornecida" },
      { status: 400 }
    );
  }

  try {
    // Busca o filhote pelo ID
    const filhote = await Filhote.findById(id);

    if (!filhote) {
      return NextResponse.json(
        { message: "Filhote não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza o filhote, marcando-o como desmamado e adicionando a data de desmama
    filhote.situacao = "DE";
    filhote.dataDesmama = dataDesmama || new Date(); // Usa a data enviada ou a data atual
    await filhote.save();

    return NextResponse.json({ message: "Filhote desmamado com sucesso!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao desmamar filhote", error: error.message },
      { status: 500 }
    );
  }
}
