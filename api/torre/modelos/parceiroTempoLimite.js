import mongoose from 'mongoose';

mongoose.pluralize(null);

const parceiroTempoLimiteSchema = new mongoose.Schema({
  hubParceiroId: { type: Number, unique: true, required: [true, 'Informe o código do parceiro comercial.'] },
  tempoLimitePedidoAceite: { type: String, required: [true, 'Informe o tempo limite de aceite.'] },
  log: {
    dataInclusao: { type: Date, required: [false, 'Informe a data inclusão.'] },
    usuarioInclusao: { type: String, required: true },
    dataAlteracao: { type: Date, required: [false, 'Informe a data alteração.'] },
    usuarioAlteracao: { type: String, required: true },
  },
},
{
  // strict: 'throw',
  versionKey: false, timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' }
});

parceiroTempoLimiteSchema.index({ hubParceiroId: 1 }, { unique: true });

const parceiroTempoLimiteModel = mongoose.model('torreParceiroTempoLimite', parceiroTempoLimiteSchema);

module.exports = parceiroTempoLimiteModel;
