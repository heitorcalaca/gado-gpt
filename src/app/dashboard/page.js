import connectToDatabase from "@/lib/mongoose";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  await connectToDatabase();

  // Outras operações do lado do servidor podem ser feitas aqui, se necessário.

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardClient />
    </div>
  );
}
