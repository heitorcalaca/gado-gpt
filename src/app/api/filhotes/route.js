// src/app/api/filhotes/route.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import Matriz from "@/models/Matriz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption"; // Certifique-se de que este caminho está correto
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectToDatabase();

  const session = await getServerSession(authOptions); // Obter sessão corretamente
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const matrizId = searchParams.get("matriz");

  let filhotes;
  if (matrizId) {
    // Buscar filhotes associados à matriz específica e ao usuário logado
    filhotes = await Filhote.find({
      matriz: matrizId,

      userId: user.id,
    })
      .populate("matriz")
      .lean();
  } else {
    // Buscar todos os filhotes do usuário logado que não foram desmamados
    filhotes = await Filhote.find({ situacao: { $ne: "DE" }, userId: user.id })
      .populate("matriz")
      .lean();
  }

  return NextResponse.json(filhotes);
}

export async function POST(request) {
  await connectToDatabase();

  const session = await getServerSession(authOptions); // Obter sessão corretamente
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();

    // Verifica se o filhote já existe com os mesmos dados
    const existingFilhote = await Filhote.findOne({
      matriz: data.matriz,
      dataNascimento: data.dataNascimento,
      nomePai: data.nomePai,
    });

    if (existingFilhote) {
      return NextResponse.json(
        { message: "Este filhote já está cadastrado." },
        { status: 400 }
      );
    }

    // Adiciona o userId do usuário logado ao novo registro de filhote
    const newFilhote = new Filhote({
      ...data,
      userId: user.id, // Associa o filhote ao usuário logado
    });

    await newFilhote.save();

    return NextResponse.json(
      { message: "Filhote criado com sucesso!", filhote: newFilhote },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar filhote", error: error.message },
      { status: 400 }
    );
  }
}
