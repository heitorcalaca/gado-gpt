"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import DashboardHeader from "@/components/DashboardHeader";
import KPISection from "@/components/KPISelection";
import GMDChart from "@/components/GMDChart";
import PesoMedioPorLoteChart from "@/components/PesoMedioPorLoteChart";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardClient() {
  const [lotes, setLotes] = useState([]);
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    async function fetchLotes() {
      if (status === "authenticated") {
        try {
          // Pass the session token for authentication in the API request
          const res = await fetch("/api/machos/lotes", {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          });

          const data = await res.json();
          setLotes(data);
        } catch (error) {
          console.error("Erro ao buscar lotes:", error);
        }
      }
    }

    fetchLotes();
  }, [session, status]);

  if (status === "loading" || lotes.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Header */}
      <DashboardHeader />

      {/* Conteúdo do Dashboard */}
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <p>
          Bem-vindo ao Dashboard! Aqui você verá uma visão completa do rebanho.
        </p>
      </div>

      {/* KPIs Section */}
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <KPISection />
      </div>

      {/* Gráfico de GMD */}
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold mb-4">GMD (Ganho Médio Diário)</h2>
        <GMDChart lotes={lotes} />
      </div>

      {/* Gráfico de Peso Médio por Lote */}
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold mb-4">Peso Médio por Lote</h2>
        <PesoMedioPorLoteChart lotes={lotes} />
      </div>
    </div>
  );
}
