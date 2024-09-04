// src/models/Matriz.js
import mongoose from "mongoose";

const MatrizSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  numero: { type: String, required: true, unique: true },
  caracteristicas: String,
  dataNascimento: Date,
  proprietario: String,
  situacao: { type: String, enum: ["NO", "MO", "SU", "VE"] },
  nomePai: String,
  nomeMae: String,
  situacaoMae: { type: String, enum: ["NO", "MO", "SU", "VE"] },
  observacao: String,
});

export default mongoose.models.Matriz || mongoose.model("Matriz", MatrizSchema);
