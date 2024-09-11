import connectToDatabase from "@/lib/mongoose";
import Macho from "@/models/Macho";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDatabase();

  try {
    // Buscar todos os machos agrupados por lote e incluir as pesagens
    const lotes = await Macho.aggregate([
      {
        $group: {
          _id: "$lote", // Agrupar pelo lote
          machos: {
            $push: {
              numero: "$numero",
              pesagens: "$pesagens",
            },
          },
        },
      },
    ]);

    // Organizar o resultado no formato desejado
    const result = lotes.map((lote) => ({
      nome: lote._id,
      machos: lote.machos,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar lotes e pesagens:", error);
    return new Response(
      JSON.stringify({ message: "Erro ao buscar lotes", error: error.message }),
      { status: 500 }
    );
  }
}
