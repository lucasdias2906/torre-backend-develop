import mongoose from 'mongoose'

mongoose.pluralize(null)

const parametroGeralSchema = new mongoose.Schema(
  {
    grupo: { type: String, required: true },
    codigo: { type: String, required: true },
    nome: { type: String, required: true },
    valor: { type: String, required: true },
    tipo: { type: String, required: true },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true },
    },
  },
  {
    // strict: 'throw',
    versionKey: false,
  },
)

parametroGeralSchema.index({ grupo: 1, codigo: 1 }, { unique: true })

module.exports = mongoose.model('torreParametroGeral', parametroGeralSchema)
