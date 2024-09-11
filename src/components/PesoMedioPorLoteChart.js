import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

// Register the necessary components for the bar chart
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PesoMedioPorLoteChart() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  // Function to get the last three months
  const getLastThreeMonths = () => {
    const today = new Date();
    const months = [];

    for (let i = 2; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(month.toLocaleString("default", { month: "short" }));
    }

    return months;
  };

  useEffect(() => {
    async function fetchPesagens() {
      try {
        // Request to get all the lote data
        const res = await fetch(`/api/machos/pesagem/lote`);
        if (!res.ok) {
          throw new Error(`Erro ao buscar dados: ${res.statusText}`);
        }

        const data = await res.json();
        const months = getLastThreeMonths();

        // Organize data by lote and calculate the average weight for each month
        const lotesData = {};
        data.forEach((macho) => {
          macho.pesagens.forEach((pesagem) => {
            const mesPesagem = new Date(pesagem.data).toLocaleString(
              "default",
              {
                month: "short",
              }
            );

            // If the month is within the last 3 months
            if (months.includes(mesPesagem)) {
              if (!lotesData[macho.lote]) {
                lotesData[macho.lote] = { [mesPesagem]: [] };
              }
              if (!lotesData[macho.lote][mesPesagem]) {
                lotesData[macho.lote][mesPesagem] = [];
              }
              lotesData[macho.lote][mesPesagem].push(pesagem.peso);
            }
          });
        });

        // Calculate the average weight for each lote in each month
        const datasets = [];
        const uniqueMonths = getLastThreeMonths();

        Object.keys(lotesData).forEach((lote) => {
          const dataset = {
            label: `Lote ${lote}`,
            data: uniqueMonths.map((month) => {
              const pesos = lotesData[lote][month] || [];
              if (pesos.length > 0) {
                return (
                  pesos.reduce((acc, peso) => acc + peso, 0) / pesos.length
                );
              } else {
                return 0;
              }
            }),
            backgroundColor: `rgba(${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, 0.2)`,
            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 1)`,
            borderWidth: 1,
          };
          datasets.push(dataset);
        });

        setChartData({
          labels: uniqueMonths,
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
        <Bar
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
                  text: "Peso Médio (kg)",
                },
                ticks: {
                  beginAtZero: true,
                },
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
