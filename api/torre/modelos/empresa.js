// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

// Criando a instancia de empresa
module.exports = mongoose.model('torreEmpresa', new Schema(
  {
    idEmpresa: { type: Number, required: true }, // identificadorEmpresa
    idGrupoEmpresa: { type: Number, required: false }, // idGrupoEmpresa

  },
  {
    // strict: 'throw',
    versionKey: false,
  },
));
