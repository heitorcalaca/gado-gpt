import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

// Registrar os componentes do gráfico necessários
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GMDChart() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPesagens() {
      try {
        const res = await fetch(`/api/machos/pesagem/lote/gmd`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Os dados recebidos não são um array");
        }

        // Extrair os meses (labels do eixo X)
        const meses = [
          "2024-01",
          "2024-02",
          "2024-03",
          "2024-04",
          "2024-05",
          "2024-06",
          "2024-07",
          "2024-08",
          "2024-09",
          "2024-10",
          "2024-11",
          "2024-12",
        ];

        const datasets = data.map((loteData) => {
          const { lote, gmdMensal } = loteData;

          // Criar o dataset de GMD por mês para cada lote
          const gmdData = meses.map((mes) => gmdMensal[mes] || 0);

          return {
            label: `Lote ${lote}`,
            data: gmdData,
            fill: false,
            borderColor: `#${Math.floor(Math.random() * 16777215).toString(
              16
            )}`, // Cor aleatória para cada lote
            tension: 0.1,
          };
        });

        // Definir os dados do gráfico
        setChartData({
          labels: meses, // Meses como labels no eixo X
          datasets,
        });
      } catch (error) {
        setError(error.message);
        console.error("Erro ao buscar os dados de pesagens:", error);
      }
    }

    fetchPesagens();
  }, []);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {chartData ? (
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Meses",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "GMD (kg/dia)",
                },
                min: 0,
              },
            },
          }}
        />
      ) : (
        !error && <p>Carregando dados...</p>
      )}
    </div>
  );
}
