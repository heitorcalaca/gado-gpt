// src/app/api/matrizes/route.js
import connectToDatabase from "@/lib/mongoose";
import Matriz from "@/models/Matriz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption"; // Certifique-se de que isso aponte para onde você configurou suas opções de autenticação
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("Iniciando a busca de matrizes"); // Log inicial

  await connectToDatabase();
  console.log("Conexão com o banco de dados estabelecida");

  const session = await getServerSession(authOptions); // Obter sessão corretamente
  console.log("Sessão obtida:", session); // Verifique se a sessão foi obtida

  if (!session || !session.user) {
    console.log("Não autorizado. Sessão inválida.");
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  const user = session.user;
  console.log("Usuário Logado: ", user);

  // Busca matrizes associadas ao usuário logado
  try {
    const matrizes = await Matriz.find({ userId: user.id }).lean();
    console.log("Matrizes do usuário logado:", matrizes); // Verifique se as matrizes corretas estão sendo retornadas
    return NextResponse.json(matrizes);
  } catch (error) {
    console.error("Erro ao buscar matrizes:", error);
    return NextResponse.json(
      { message: "Erro ao buscar matrizes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectToDatabase();

  const session = await getServerSession(authOptions); // Obter sessão corretamente

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  const user = session.user;

  try {
    const data = await request.json();

    // Verifica se o nome ou número já existem
    const existingMatriz = await Matriz.findOne({
      $or: [{ nome: data.nome }, { numero: data.numero }],
    });

    if (existingMatriz) {
      const errors = {};
      if (existingMatriz.nome === data.nome) {
        errors.nome = "Este nome já está cadastrado.";
      }
      if (existingMatriz.numero === data.numero) {
        errors.numero = "Este número já está cadastrado.";
      }
      return NextResponse.json(
        { message: "Erro na validação", errors },
        { status: 400 }
      );
    }

    // Cria uma nova matriz associada ao usuário logado
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
