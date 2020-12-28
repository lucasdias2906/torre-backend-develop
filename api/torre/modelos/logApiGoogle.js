// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const logApiGoogleSchema = new mongoose.Schema(
  {
    numeroPedido: { type: String, required: true },
    codigoFilial: { type: Number, required: true },
    etapaMapaSinotico: { type: Number, required: false },
    dataHora: { type: Date, required: true },
    origem: { type: Object, required: true },
    destino: { type: Object, required: true },
    retornoDuracaoSegundos: { type: Number, required: false },
    retornoDuracaoDescritivo: { type: String, required: false },
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

// logApiGoogleSchema.index({ numeroPedido: 1, codigoFilial: 1 }, { unique: true })

const logApiGoogleModel = mongoose.model('torreLogApiGoogle', logApiGoogleSchema);
module.exports = logApiGoogleModel;
