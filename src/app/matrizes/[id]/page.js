"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MatrizDetailsPage() {
  const [form, setForm] = useState(null);
  const [filhotes, setFilhotes] = useState([]);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchMatriz = async () => {
      try {
        const res = await fetch(`/api/matrizes/${id}`);
        const data = await res.json();
        if (res.ok) {
          setForm({
            ...data,
            dataNascimento: data.dataNascimento
              ? new Date(data.dataNascimento).toISOString().split("T")[0]
              : "",
          });
          const resFilhotes = await fetch(`/api/filhotes?matriz=${id}`);
          const filhotesData = await resFilhotes.json();
          setFilhotes(filhotesData);
        } else {
          console.error("Erro ao carregar matriz:", data.message);
        }
      } catch (error) {
        console.error("Erro ao carregar matriz:", error);
      }
    };

    fetchMatriz();
  }, [id]);

  if (!form) return <LoadingSpinner />;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/matrizes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/matrizes");
      } else {
        const errorData = await res.json();
        console.error("Erro ao atualizar matriz:", errorData.message);
      }
    } catch (error) {
      console.error("Erro ao atualizar matriz", error);
    }
  };

  const handleBack = () => {
    router.push("/matrizes");
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Detalhes da Matriz
          </h1>
        </div>
      </header>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <div>
            <label className="form-label">Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Número</label>
            <input
              name="numero"
              value={form.numero}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Características</label>
            <input
              name="caracteristicas"
              value={form.caracteristicas}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Data de Nascimento</label>
            <input
              type="date"
              name="dataNascimento"
              value={form.dataNascimento}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Proprietário</label>
            <input
              name="proprietario"
              value={form.proprietario}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Situação</label>
            <select
              name="situacao"
              value={form.situacao}
              onChange={handleChange}
              className="form-input"
            >
              <option value="NO">Normal (NO)</option>
              <option value="MO">Morta (MO)</option>
              <option value="SU">Sumiu (SU)</option>
              <option value="VE">Vendida (VE)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Nome do Pai</label>
            <input
              name="nomePai"
              value={form.nomePai}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Nome da Mãe</label>
            <input
              name="nomeMae"
              value={form.nomeMae}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Situação da Mãe</label>
            <select
              name="situacaoMae"
              value={form.situacaoMae}
              onChange={handleChange}
              className="form-input"
            >
              <option value="NO">Normal (NO)</option>
              <option value="MO">Morta (MO)</option>
              <option value="SU">Sumiu (SU)</option>
              <option value="VE">Vendida (VE)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="form-label">Observação</label>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              className="form-input py-4"
            />
          </div>

          <div className="sm:col-span-2 flex gap-4">
            <button type="submit" className="form-button-primary">
              Atualizar
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="form-button-secondary"
            >
              Voltar
            </button>
          </div>
        </form>

        {/* Histórico de Filhotes */}
        <h2 className="text-xl font-bold mt-8 mb-4">Histórico de Filhotes</h2>
        {filhotes.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Data de Nascimento</th>
                <th>Situação</th>
                <th>Previsão de Desmama</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filhotes.map((filhote) => (
                <tr key={filhote._id}>
                  <td>
                    {new Date(filhote.dataNascimento).toLocaleDateString()}
                  </td>
                  <td>{filhote.situacao}</td>
                  <td>
                    {new Date(filhote.previsaoDesmama).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(filhote.previsaoDesmama) > new Date() ? (
                      <Link href={`/filhotes/${filhote._id}`}>
                        <button className="bg-yellow-500 text-white p-2 rounded">
                          Editar
                        </button>
                      </Link>
                    ) : (
                      <span className="text-gray-500">Desmamado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum filhote associado a esta matriz.</p>
        )}
      </div>
    </div>
  );
}
