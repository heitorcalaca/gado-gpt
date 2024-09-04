// src/app/api/filhotes/route.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectToDatabase();

  // Obter o 'matriz' id dos parâmetros de consulta
  const { searchParams } = new URL(request.url);
  const matrizId = searchParams.get("matriz");

  let filhotes;
  if (matrizId) {
    // Buscar filhotes associados à matriz específica
    filhotes = await Filhote.find({ matriz: matrizId })
      .populate("matriz")
      .lean();
  } else {
    // Se nenhum 'matrizId' for fornecido, retornar todos os filhotes
    filhotes = await Filhote.find({}).populate("matriz").lean();
  }

  return NextResponse.json(filhotes);
}

export async function POST(request) {
  await connectToDatabase();
  const data = await request.json();
  const filhote = await Filhote.create(data);

  return NextResponse.json(filhote);
}
