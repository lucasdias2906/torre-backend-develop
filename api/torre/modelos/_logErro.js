// importantado o mongo e o schema
import mongoose from 'mongoose'

mongoose.pluralize(null)

const { Schema } = mongoose

// Criando a instancia de CustosFixos
module.exports = mongoose.model('_logErro', new Schema(
  {
    dados: { type: String, required: true },
    dataInclusao: { type: Date, required: false },
  },
  {
    versionKey: false, timestamps: { createdAt: 'dataInclusao', updatedAt: false },
    // strict: 'throw'
  },
))
