import mongoose from 'mongoose'

mongoose.pluralize(null)

const monitoramentoRotinaSchema = new mongoose.Schema(
  {
    dataInicio: { type: Date, required: true },
    dataFim: { type: Date, required: true },
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

const monitoramentoRotinaModel = mongoose.model('torreMonitoramentoRotina', monitoramentoRotinaSchema)

module.exports = monitoramentoRotinaModel
