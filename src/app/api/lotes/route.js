import connectToDatabase from "@/lib/mongoose";
import Macho from "@/models/Macho";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { NextResponse } from "next/server";

// GET: Retorna todos os lotes únicos do usuário logado
export async function GET() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  try {
    const userId = session.user.id;

    // Buscar lotes distintos para o usuário logado
    const lotes = await Macho.distinct("lote", { userId });

    // Retornar os lotes encontrados
    return NextResponse.json(lotes);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar lotes", error: error.message },
      { status: 500 }
    );
  }
}
