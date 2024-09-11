import KPIIndicator from "./KPIIndicator";
import { useEffect, useState } from "react";

export default function KPISection() {
  const [totals, setTotals] = useState({
    matrizes: 0,
    machos: 0,
    filhotes: 0,
  });

  // Buscando os dados reais da API
  useEffect(() => {
    async function fetchTotals() {
      try {
        const res = await fetch("/api/dashboard/totals");
        const data = await res.json();
        setTotals(data);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard", error);
      }
    }

    fetchTotals();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPIIndicator
        title="Matrizes"
        count={totals.matrizes}
        link="/matrizes"
        color="bg-blue-500"
      />
      <KPIIndicator
        title="Machos"
        count={totals.machos}
        link="/machos"
        color="bg-green-500"
      />
      <KPIIndicator
        title="Filhotes"
        count={totals.filhotes}
        link="/filhotes"
        color="bg-yellow-500"
      />
    </div>
  );
}
