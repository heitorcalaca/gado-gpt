// src/app/api/filhotes/desmama/route.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectToDatabase();

  // Obter sessão de autenticação do usuário
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  const user = session.user;

  try {
    // Buscar filhotes associados ao usuário logado que precisam ser desmamados
    const filhotesParaDesmama = await Filhote.find({
      userId: user.id, // Filtra os filhotes do usuário logado
      previsaoDesmama: { $lte: new Date() }, // Verifica se a previsão de desmama já passou ou é hoje
      situacao: "NO", // Situação "Normal" (ainda não desmamados)
    }).lean();

    // Retornar a lista de filhotes prontos para desmama
    return NextResponse.json(filhotesParaDesmama, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar filhotes para desmama", error: error.message },
      { status: 500 }
    );
  }
}
