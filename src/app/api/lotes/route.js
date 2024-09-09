import connectToDatabase from "@/lib/mongoose";
import Macho from "@/models/Macho";
import { NextResponse } from "next/server";

// GET: Retorna todos os lotes únicos
export async function GET() {
  await connectToDatabase();

  try {
    // Buscar todos os lotes distintos de machos no banco de dados
    const lotes = await Macho.distinct("lote");
    return NextResponse.json(lotes);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar lotes", error: error.message },
      { status: 500 }
    );
  }
}
