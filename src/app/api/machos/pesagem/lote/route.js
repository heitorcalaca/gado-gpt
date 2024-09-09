// src/app/api/machos/pesagem/lote/route.js
import connectToDatabase from "@/lib/mongoose";
import Macho from "@/models/Macho";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectToDatabase();

  const { lote, pesagens } = await request.json();

  // Verifica se os dados de pesagens foram enviados
  if (!lote || !pesagens || Object.keys(pesagens).length === 0) {
    return NextResponse.json(
      { message: "Lote ou pesagens inválidas" },
      { status: 400 }
    );
  }

  try {
    // Buscar todos os machos do lote
    const machos = await Macho.find({ lote });

    if (machos.length === 0) {
      return NextResponse.json(
        { message: `Nenhum macho encontrado para o lote ${lote}` },
        { status: 404 }
      );
    }

    const updatePromises = machos.map(async (macho) => {
      // Verificar se há pesagem para o macho
      if (pesagens[macho._id]) {
        // Adicionar nova pesagem
        macho.pesagens.push({
          data: new Date(),
          peso: pesagens[macho._id],
        });

        // Salvar macho atualizado
        await macho.save();
      }
    });

    // Aguardar todas as atualizações serem concluídas
    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Pesagens salvas com sucesso!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao salvar pesagens", error: error.message },
      { status: 500 }
    );
  }
}
