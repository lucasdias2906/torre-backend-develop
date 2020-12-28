
import mongoose from 'mongoose'

mongoose.pluralize(null)

const parceiroRotaSchema = new mongoose.Schema({
  hubParceiroId: { type: Number, required: [true, 'Informe o código do parceiro comercial.'] },

  hubRotaId: {
    type: String,
    required: [true, 'Informe a rota.'],
  },
  identificaoSituacaoLinha: {
    type: Boolean,
    required: [true, 'Informe a situação da linha.'],
  },
  codigoPontoInicial: {
    type: String,
    required: [true, 'Informe o ponto inicial.'],
  },
  nomeMunicipioInicial: {
    type: String,
    required: [true, 'Informe o municipio inicial.'],
  },
  codigoPontoFinal: {
    type: String,
    required: [true, 'Informe o ponto final.'],
  },
  nomeMunicipioFinal: {
    type: String,
    required: [true, 'Informe o municipio final.'],
  },
  log:
  {
    usuarioInclusao: { type: String, required: false },
    usuarioAlteracao: { type: String, required: false },
    dataInclusao: { type: Date, required: [false, 'Informe a data criação.'] },
    dataAlteracao: { type: Date, required: [false, 'Informe a data alteração.'] },
  },
},
{
  // strict: 'throw',
  versionKey: false, timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' },
})

parceiroRotaSchema.index(
  {
    hubParceiroId: 1, hubRotaId: 1, codigoPontoInicial: 1, codigoPontoFinal: 1,
  },
  { unique: true },
)

const parceiroRotaModel = mongoose.model('torreParceiroRota', parceiroRotaSchema)

module.exports = parceiroRotaModel
