import connectToDatabase from "@/lib/mongoose";
import Macho from "@/models/Macho";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const lote = searchParams.get("lote"); // Obter o lote da query string

  try {
    // Se um lote específico for fornecido, filtrar por ele, caso contrário, retornar todos os lotes
    const query = lote ? { lote } : {};

    // Buscar todos os machos agrupados por lote e incluir as pesagens
    const lotes = await Macho.aggregate([
      { $match: query }, // Filtrar por lote se fornecido
      {
        $group: {
          _id: "$lote", // Agrupar pelo lote
          machos: {
            $push: {
              _id: "$_id",
              numero: "$numero",
              pesagens: "$pesagens",
            },
          },
        },
      },
    ]);

    // Se o lote não for encontrado, retornar uma mensagem adequada
    if (lotes.length === 0) {
      return NextResponse.json(
        { message: `Nenhum macho encontrado para o lote ${lote}` },
        { status: 404 }
      );
    }

    // Organizar o resultado no formato desejado
    const result = lotes.map((lote) => ({
      nome: lote._id, // Nome do lote
      machos: lote.machos, // Lista de machos
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar lotes e pesagens:", error);
    return NextResponse.json(
      { message: "Erro ao buscar lotes", error: error.message },
      { status: 500 }
    );
  }
}
