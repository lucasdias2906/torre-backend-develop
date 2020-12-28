import mongoose from 'mongoose';

import Modulo from './modulo';
import Funcionalidade from './funcionalidade';

mongoose.pluralize(null);

const perfilPermissaoSchema = new mongoose.Schema(
  {
    perfilId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torrePerfil',
      required: true
    },
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
    funcionalidadeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torreFuncionalidade',
      required: true,
      validate: {
        validator: async function (pFuncionalidadeId) {
          const vFuncionalidade = await Funcionalidade.findOne({ _id: pFuncionalidadeId, moduloId: this.moduloId })
          return vFuncionalidade !== null;
        },
        message: 'Funcionalidade informada não existe ou não está associada ao módulo informado! '
      }
    },
    permiteConsultar: { type: Boolean, required: true },
    permiteAlterar: { type: Boolean, required: true },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    },
  },
  {
    // strict: 'throw',
    versionKey: false,
  },
);

perfilPermissaoSchema.index({ perfilId: 1, moduloId: 1, funcionalidadeId: 1 }, { unique: true });

const perfilPermissaoModel = mongoose.model('torrePerfilPermissao', perfilPermissaoSchema);

module.exports = perfilPermissaoModel;
