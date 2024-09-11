import connectToDatabase from "@/lib/mongoose";
import Macho from "@/models/Macho";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  // Usar o userId da sessão
  const userId = session.user.id;

  const { searchParams } = new URL(req.url);
  const lote = searchParams.get("lote"); // Obter o lote se fornecido
  console.log("Lote fornecido:", lote);

  try {
    // Adicionar o userId ao filtro de machos
    const query = { userId }; // Query agora usa apenas o userId da sessão
    if (lote) query.lote = lote; // Se lote for fornecido, adicioná-lo ao filtro

    // Consulta de machos pertencentes ao usuário logado
    const machos = await Macho.find(query)
      .select("pesagens numero lote")
      .lean();

    // Verifica se algum macho foi encontrado
    if (machos.length === 0) {
      return NextResponse.json(
        {
          message: lote
            ? `Nenhum macho encontrado no lote ${lote} para o usuário`
            : "Nenhum macho encontrado para o usuário",
        },
        { status: 404 }
      );
    }

    // Retorna os machos encontrados
    return new Response(JSON.stringify(machos), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Erro ao buscar pesagens",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  let requestBody;

  try {
    requestBody = await request.json();
  } catch (error) {
    console.error("Erro ao processar o corpo da requisição:", error);
    return NextResponse.json(
      { message: "Corpo da requisição inválido" },
      { status: 400 }
    );
  }

  const { lote, pesagens } = requestBody;

  // Verificar se os dados de pesagens foram enviados corretamente
  if (!lote || !pesagens || Object.keys(pesagens).length === 0) {
    console.warn("Lote ou pesagens inválidos:", { lote, pesagens });
    return NextResponse.json(
      { message: "Lote ou pesagens inválidos" },
      { status: 400 }
    );
  }

  try {
    const userId = session.user.id; // Usar o userId da sessão

    // Buscar todos os machos do lote pertencentes ao usuário logado
    const machos = await Macho.find({ lote, userId });

    if (machos.length === 0) {
      console.warn(
        `Nenhum macho encontrado para o lote ${lote} e usuário ${userId}`
      );
      return NextResponse.json(
        { message: `Nenhum macho encontrado para o lote ${lote}` },
        { status: 404 }
      );
    }

    const updatePromises = machos.map(async (macho) => {
      const peso = pesagens[macho._id];
      if (peso) {
        macho.pesagens.push({
          data: new Date(),
          peso: peso,
        });
        await macho.save();
      } else {
        console.warn(`Nenhuma pesagem fornecida para macho ${macho._id}`);
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Pesagens salvas com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar pesagens:", error);
    return NextResponse.json(
      { message: "Erro ao salvar pesagens", error: error.message },
      { status: 500 }
    );
  }
}
