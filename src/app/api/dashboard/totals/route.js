import connectToDatabase from "@/lib/mongoose";
import Matriz from "@/models/Matriz";
import Macho from "@/models/Macho";
import Filhote from "@/models/Filhote";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  // Verificar se o usuário está autenticado
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const userId = session.user.id; // Obter o userId da sessão

  try {
    // Contar o total de matrizes pertencentes ao usuário
    const totalMatrizes = await Matriz.countDocuments({ userId });

    // Contar o total de machos pertencentes ao usuário
    const totalMachos = await Macho.countDocuments({ userId });

    // Contar o total de filhotes pertencentes ao usuário
    const totalFilhotes = await Filhote.countDocuments({
      userId,
      situacao: "NO",
    });

    // Retornar os dados em formato JSON
    return NextResponse.json(
      {
        matrizes: totalMatrizes,
        machos: totalMachos,
        filhotes: totalFilhotes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar os dados do dashboard:", error);
    return NextResponse.json(
      { message: "Erro ao buscar os dados do dashboard" },
      { status: 500 }
    );
  }
}
