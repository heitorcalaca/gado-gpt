// src/app/api/machos/route.js
import connectToDatabase from "@/lib/mongoose";
import Macho from "@/models/Macho";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { NextResponse } from "next/server";

// GET: Lista todos os machos
export async function GET() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  const machos = await Macho.find({ userId: session.user.id });
  return NextResponse.json(machos);
}

// POST: Cria um novo macho
export async function POST(request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  const data = await request.json();
  const newMacho = new Macho({
    ...data,
    userId: session.user.id, // Associar ao usuário logado
  });

  await newMacho.save();
  return NextResponse.json(newMacho, { status: 201 });
}
