// src/app/api/machos/[id]/pesagem/route.js
import connectToDatabase from "@/lib/mongoose";
import Macho from "@/models/Macho";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { NextResponse } from "next/server";

// POST: Adicionar uma nova pesagem
export async function POST(request, { params }) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  const { id } = params;
  const { data, peso } = await request.json();

  try {
    const macho = await Macho.findById(id);
    if (!macho) {
      return NextResponse.json(
        { message: "Macho não encontrado" },
        { status: 404 }
      );
    }

    // Adicionar a nova pesagem ao histórico
    macho.pesagens.push({ data, peso });
    await macho.save();

    return NextResponse.json(macho, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao adicionar pesagem", error: error.message },
      { status: 500 }
    );
  }
}
