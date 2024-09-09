// src/app/machos/[id]/pesagem/page.js
"use client"; // Adicionando a diretiva para que este seja um Client Component

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AdicionarPesagem() {
  const [form, setForm] = useState({
    data: "",
    peso: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { id } = useParams(); // ID do macho

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.data || !form.peso) {
      setErrors({ data: "Data é obrigatória", peso: "Peso é obrigatório" });
      return;
    }

    try {
      const res = await fetch(`/api/machos/${id}/pesagem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push(`/machos/${id}`);
      }
    } catch (error) {
      console.error("Erro ao adicionar pesagem", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Data da Pesagem</label>
        <input
          type="date"
          value={form.data}
          onChange={(e) => setForm({ ...form, data: e.target.value })}
        />
        {errors.data && <p className="text-red-500">{errors.data}</p>}
      </div>

      <div>
        <label>Peso (Kg)</label>
        <input
          type="number"
          value={form.peso}
          onChange={(e) => setForm({ ...form, peso: e.target.value })}
        />
        {errors.peso && <p className="text-red-500">{errors.peso}</p>}
      </div>

      <button type="submit">Registrar Pesagem</button>
    </form>
  );
}
