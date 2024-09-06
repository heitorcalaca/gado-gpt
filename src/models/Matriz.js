// src/models/Matriz.js
import mongoose from "mongoose";

const MatrizSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  numero: { type: String, required: true },
  caracteristicas: String,
  dataNascimento: Date,
  proprietario: String,
  situacao: { type: String, enum: ["NO", "MO", "SU", "VE"], default: "NO" },
  nomePai: String,
  nomeMae: String,
  situacaoMae: { type: String, enum: ["NO", "MO", "SU", "VE"], default: "NO" },
  observacao: String,
  filhotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Filhote" }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Adiciona o campo userId
});

export default mongoose.models.Matriz || mongoose.model("Matriz", MatrizSchema);
