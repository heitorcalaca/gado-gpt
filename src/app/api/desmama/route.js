// src/app/api/desmama/route.js
import { authOptions } from "@/lib/authOption";
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  const user = session.user;

  // Data atual menos 9 meses
  const noveMesesAtras = new Date();
  noveMesesAtras.setMonth(noveMesesAtras.getMonth() - 9);

  // Filtrar filhotes que atingiram 9 meses e ainda não foram desmamados
  const filhotesProntosParaDesmama = await Filhote.find({
    dataNascimento: { $lte: noveMesesAtras },
    situacao: "NO", // Considerando que "NO" é a situação para filhotes não desmamados
    userId: user.id,
  })
    .populate("matriz")
    .lean();

  return NextResponse.json(filhotesProntosParaDesmama);
}
