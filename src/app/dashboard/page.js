import connectToDatabase from "@/lib/mongoose";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  await connectToDatabase();

  // Outras operações do lado do servidor podem ser feitas aqui, se necessário.

  return (
    <div>
      <DashboardClient />
    </div>
  );
}
