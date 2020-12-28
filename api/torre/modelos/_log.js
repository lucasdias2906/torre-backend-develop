import mongoose from 'mongoose'

mongoose.pluralize(null)

const { Schema } = mongoose

module.exports = mongoose.model('_log', new Schema(
  {
    colecao: { type: String, required: true },
    chave: { type: String, required: true },
    dados: { type: String, required: true },
    usuario: { type: String, required: true },
    tipo: { type: String, required: true },
    dataInclusao: { type: Date, required: false },
  },
  {
    versionKey: false, timestamps: { createdAt: 'dataInclusao', updatedAt: false },
    // strict: 'throw'
  },
))
