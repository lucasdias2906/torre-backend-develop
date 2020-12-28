import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

// Criando a instancia de Filial
module.exports = mongoose.model('torreFilial', new Schema(
  {
    idFilial: { type: Number, required: true }, // identificadorFilial
  },
  {
    //   strict: 'throw',
    versionKey: false,
  },
));
