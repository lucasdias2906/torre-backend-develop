import mongoose from 'mongoose';

mongoose.pluralize(null);

const moduloSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, unique: true },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    },
  },
  { //strict: 'throw' ,
    versionKey: false,
  },
);

const moduloModel = mongoose.model('torreModulo', moduloSchema);

module.exports = moduloModel;
