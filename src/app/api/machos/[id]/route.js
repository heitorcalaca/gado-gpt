// src/app/api/machos/[id]/route.js
import connectToDatabase from "@/lib/mongoose";
import Macho from "@/models/Macho";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { NextResponse } from "next/server";

// GET: Busca os detalhes de um macho pelo ID
export async function GET(request, { params }) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  const { id } = params;
  try {
    const macho = await Macho.findById(id).lean();
    if (!macho) {
      return NextResponse.json(
        { message: "Macho não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(macho);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar macho", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await connectToDatabase();

  const { id } = params;
  const data = await request.json();

  try {
    // Atualiza o macho com os novos dados
    const updatedMacho = await Macho.findByIdAndUpdate(id, data, { new: true });

    if (!updatedMacho) {
      return NextResponse.json(
        { message: "Macho não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedMacho);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar macho", error: error.message },
      { status: 500 }
    );
  }
}
