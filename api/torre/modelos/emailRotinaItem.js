import mongoose from 'mongoose'

mongoose.pluralize(null)

const emailRotinaSchema = new mongoose.Schema(
  {
    chave: { type: String, required: true },
    dataInicio: { type: Date, required: true },
    dataFim: { type: Date, required: false, default: null },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true },
    },
  },
  { // strict: 'throw',
    versionKey: false,
  },
)

const emailRotinaModel = mongoose.model('torreEmailRotina', emailRotinaSchema)

module.exports = emailRotinaModel
