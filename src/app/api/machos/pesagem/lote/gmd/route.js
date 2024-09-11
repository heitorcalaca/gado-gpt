import connectToDatabase from "@/lib/mongoose";
import Macho from "@/models/Macho";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import { NextResponse } from "next/server";

// Helper para calcular GMD entre duas pesagens
function calcularGMD(pesagens) {
  if (pesagens.length < 2) return 0;

  const primeiraPesagem = pesagens[0];
  const ultimaPesagem = pesagens[pesagens.length - 1];

  const diferencaPeso = ultimaPesagem.peso - primeiraPesagem.peso;
  const dias =
    (new Date(ultimaPesagem.data) - new Date(primeiraPesagem.data)) /
    (1000 * 60 * 60 * 24);

  return diferencaPeso / dias;
}

// Helper para agrupar pesagens por mês
function agruparPorMes(pesagens) {
  const dadosMensais = {};

  pesagens.forEach((pesagem) => {
    const data = new Date(pesagem.data);
    const mes = `${data.getFullYear()}-${(data.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`; // ex: "2024-01"

    if (!dadosMensais[mes]) {
      dadosMensais[mes] = [];
    }

    dadosMensais[mes].push(pesagem);
  });

  return dadosMensais;
}

// Helper para obter o peso mais recente até determinado mês
function obterPesoMaisRecente(mes, pesagensAgrupadas) {
  const meses = Object.keys(pesagensAgrupadas);
  let pesoMaisRecente = 0;

  for (const m of meses) {
    if (m <= mes && pesagensAgrupadas[m].length > 0) {
      const ultimaPesagem =
        pesagensAgrupadas[m][pesagensAgrupadas[m].length - 1];
      pesoMaisRecente = ultimaPesagem.peso;
    }
  }

  return pesoMaisRecente;
}

export async function GET(request) {
  await connectToDatabase();

  // Obter a sessão do usuário logado
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Não autorizado. Por favor, faça login." },
      { status: 401 }
    );
  }

  // Obter userId da sessão
  const userId = session.user.id;

  try {
    // Buscar todos os machos e lotes pertencentes ao usuário logado
    const machos = await Macho.find({ userId }).select("pesagens lote").lean();

    const lotesGMD = {};

    machos.forEach((macho) => {
      const { lote, pesagens } = macho;

      if (!lotesGMD[lote]) {
        lotesGMD[lote] = {};
      }

      const pesagensAgrupadas = agruparPorMes(pesagens);

      // Para cada mês, calcular o GMD médio para o lote
      Object.keys(pesagensAgrupadas).forEach((mes) => {
        const pesoInicio = obterPesoMaisRecente(mes, pesagensAgrupadas);
        const pesoFinal =
          pesagensAgrupadas[mes].length > 0
            ? pesagensAgrupadas[mes][pesagensAgrupadas[mes].length - 1].peso
            : pesoInicio;

        const diferencaPeso = pesoFinal - pesoInicio;
        const dias = 30; // Supondo um intervalo médio de 30 dias por mês

        const gmd = diferencaPeso / dias;

        if (!lotesGMD[lote][mes]) {
          lotesGMD[lote][mes] = [];
        }

        lotesGMD[lote][mes].push(gmd);
      });
    });

    // Calcular a média do GMD por mês em cada lote
    const resposta = Object.keys(lotesGMD).map((lote) => {
      const gmdMensal = {};

      Object.keys(lotesGMD[lote]).forEach((mes) => {
        const gmds = lotesGMD[lote][mes];
        const mediaGMD = gmds.reduce((acc, gmd) => acc + gmd, 0) / gmds.length;

        gmdMensal[mes] = mediaGMD;
      });

      return {
        lote,
        gmdMensal,
      };
    });

    return new Response(JSON.stringify(resposta), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar pesagens", error);
    return new Response(JSON.stringify({ error: "Erro ao buscar pesagens" }), {
      status: 500,
    });
  }
}
