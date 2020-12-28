import mongoose from 'mongoose';
import Modulo from '../modelos/modulo';

mongoose.pluralize(null);

const funcionalidadeSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    moduloId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torreModulo',
      required: true,
      validate: {
        validator: async function (v) {
          return await Modulo.findById(v, (err, rec) => rec !== null)
        },
        message: 'Módulo informado não existe! '
      }
    },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    },
  },
  { //strict: 'throw',
    versionKey: false,
  },
);

const funcionalidadeModel = mongoose.model('torreFuncionalidade', funcionalidadeSchema);

module.exports = funcionalidadeModel;
