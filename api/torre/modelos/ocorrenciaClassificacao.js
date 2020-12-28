// importantado o mongo e o schema
import mongoose from 'mongoose'

mongoose.pluralize(null)

const Schema = mongoose.Schema

// Criando a instancia de OcorrenciaClassificacao
module.exports = mongoose.model('torreOcorrenciaClassificacao', new Schema(
  {
    identificador: { type: String, unique: true, required: true },
    descricao: { type: String, required: true }
  },
  {
    // strict: 'throw',
    versionKey: false
  }
))
