// src/app/api/matrizes/route.js
import connectToDatabase from "@/lib/mongoose";
import Matriz from "@/models/Matriz";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const matrizes = await Matriz.find({}).lean(); // Retorna objetos simples
  return NextResponse.json(matrizes);
}

export async function POST(request) {
  await connectToDatabase();

  try {
    const data = await request.json();

    const newMatriz = new Matriz(data); // Cria a nova instância da Matriz com os dados passados
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
