import mongoose from 'mongoose';

mongoose.pluralize(null);

const veiculoClassificacaoSchema = new mongoose.Schema(
  {
    codigoClassificacao: { type: Number, required: true, unique: true },
    descricaoClassificacao: { type: String, required: true, unique: true },
    ativo: { type: Boolean },
    usaCombustivel: { type: Boolean },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    },
  },
  { //strict: 'throw' ,
    versionKey: false,
    timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' },
  },
);

const veiculoClassificacaoModel = mongoose.model('torreVeiculoClassificacao', veiculoClassificacaoSchema);

module.exports = veiculoClassificacaoModel;
