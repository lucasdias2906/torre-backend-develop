// importantado o mongo e o schema
import mongoose from 'mongoose'

mongoose.pluralize(null)

const pedidoStatusSchema = new mongoose.Schema(
  {
    codigo: { type: Number, required: [true, 'Informe o código do status Pedido.'] },
    descricao: { type: String, required: true },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    }
  },
  {
    versionKey: false, timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' }
  }
)

pedidoStatusSchema.index({ codigo: 1 }, { unique: true })
pedidoStatusSchema.index({ descricao: 1 }, { unique: true })

const pedidoStatusModel = mongoose.model('torrePedidoStatus', pedidoStatusSchema)
module.exports = pedidoStatusModel
