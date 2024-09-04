// src/app/api/filhotes/desmama/route.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  const hoje = new Date();
  const filhotesParaDesmama = await Filhote.find({
    previsaoDesmama: { $lte: hoje },
    situacao: "NO",
  }).lean();

  return NextResponse.json(filhotesParaDesmama);
}
