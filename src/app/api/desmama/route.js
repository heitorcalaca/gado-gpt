// src/app/api/desmama/route.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  // Data atual menos 9 meses
  const noveMesesAtras = new Date();
  noveMesesAtras.setMonth(noveMesesAtras.getMonth() - 9);

  // Filtrar filhotes que atingiram 9 meses e ainda não foram desmamados
  const filhotesProntosParaDesmama = await Filhote.find({
    dataNascimento: { $lte: noveMesesAtras },
    situacao: "NO", // Considerando que "NO" é a situação para filhotes não desmamados
  })
    .populate("matriz")
    .lean();

  return NextResponse.json(filhotesProntosParaDesmama);
}
