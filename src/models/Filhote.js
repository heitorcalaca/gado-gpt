// src/models/Filhote.js
import mongoose from "mongoose";

const FilhoteSchema = new mongoose.Schema({
  // Outros campos...
  dataNascimento: { type: Date, required: true },
  previsaoDesmama: { type: Date, required: true },
  matriz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Matriz",
    required: true,
  },
  caracteristicas: String,
  situacao: { type: String, enum: ["NO", "MO", "SU", "VE"], default: "NO" },
  observacao: String,
});

export default mongoose.models.Filhote ||
  mongoose.model("Filhote", FilhoteSchema);
