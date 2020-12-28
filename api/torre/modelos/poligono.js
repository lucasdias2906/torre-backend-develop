// importantado o mongo e o schema
import mongoose from 'mongoose';
import PoligonoTipo from './poligonoTipo';

mongoose.pluralize(null);

const pontoSchema = new mongoose.Schema(
  {
    sequenciaPonto: { type: Number, required: true },
    latitude: { type: Number, required: [true, 'latitude obrigatório.'] },
    longitude: { type: Number, required: [true, 'longitude obrigatório.'] },
  }, { _id: false }
);

const poligonoSchema = new mongoose.Schema(
  {
    codigoPoligono: { type: Number, required: [true, 'Informe o código do codigoPoligono.'] },
    descricao: { type: String, required: true },
    tipoPoligonoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torrePoligonoTipo',
      required: true,
      validate: {
        validator: async function (v) {
          return await PoligonoTipo.findById(v, (err, rec) => rec !== null)
        },
        message: 'Tipo Polígono informado não existe! '
      },
    },
    hubParceiroId: { type: Number, default: null },
    ativo: { type: Boolean, default: false },
    pontos: { type: [pontoSchema] },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    }
  },
  {
    versionKey: false, timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' }
  },
);

const poligonoModel = mongoose.model('torrePoligono', poligonoSchema);

module.exports = poligonoModel;
