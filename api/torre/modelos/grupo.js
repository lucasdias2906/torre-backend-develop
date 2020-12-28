import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

// Criando a instancia de Grupo
module.exports = mongoose.model('torreGrupo', new Schema(
  {
    idGrupo: { type: Number, required: true },
  },
  {
    //strict: 'throw',
    versionKey: false,
  },
));
