// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const pedidoMonitoramentoCheckpointSchema = new mongoose.Schema(
  {
    numeroLinha: { type: Number, required: false },
    CODLIN: { type: String, required: false },
    CODTOM: { type: String, required: false },
    descricao: { type: String, required: false },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    RAIOMT: { type: Number, required: false },
    DURACA: { type: Number, required: false },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    }
  },
  {
    versionKey: false, timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' },
  },
);

pedidoMonitoramentoCheckpointSchema.index({ CODLIN: 1, numeroLinha: 1 }, { unique: true })


const pedidoMonitoramentoCheckpointModel = mongoose.model('torrePedidoMonitoramentoCheckpoint', pedidoMonitoramentoCheckpointSchema);
module.exports = pedidoMonitoramentoCheckpointModel;
