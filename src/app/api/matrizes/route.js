// src/app/api/matrizes/route.js
import connectToDatabase from "@/lib/mongoose";
import Matriz from "@/models/Matriz";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  const session = await getServerSession(request);
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, Faça Login." },
      { status: 401 }
    );
  }

  const matrizes = await Matriz.find({}).lean(); // Retorna objetos simples

  return NextResponse.json(matrizes);
}

export async function POST(request) {
  await connectToDatabase();

  const session = await getServerSession(request);
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();

    // Adiciona o userId do usuário logado ao novo registro de matriz
    const newMatriz = new Matriz({
      ...data,
      userId: user.id, // Associa a matriz ao usuário logado
    });

    await newMatriz.save(); // Salva a nova matriz no banco de dados

    return NextResponse.json(
      { message: "Matriz criada com sucesso!", matriz: newMatriz },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar matriz", error: error.message },
      { status: 400 }
    );
  }
}
