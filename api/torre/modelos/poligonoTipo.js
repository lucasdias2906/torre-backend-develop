// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const poligonoTipoSchema = new mongoose.Schema(
  {
    codigo: { type: Number, required: [true, 'Informe o código do Tipo Poligono.'] },
    descricao: { type: String, required: true },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    },
  },
  {
    versionKey: false, timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' },
  },
);

poligonoTipoSchema.index({ codigo: 1 }, { unique: true })
poligonoTipoSchema.index({ descricao: 1 }, { unique: true })

const poligonoTipoModel = mongoose.model('torrePoligonoTipo', poligonoTipoSchema);
module.exports = poligonoTipoModel;
