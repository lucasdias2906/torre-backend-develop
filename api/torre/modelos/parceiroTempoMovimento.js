import mongoose from 'mongoose';

mongoose.pluralize(null);

const parceiroTempoMovimentoSchema = new mongoose.Schema({
  hubParceiroId: { type: Number, required: [true, 'Informe o código do parceiro comercial.'] },
  hubFornecedorId: { type: Number, required: [true, 'Informe o código do fornecedor.'] },
  descricaoFornecedor: { type: String, required: [true, 'Informe a descrição do fornecedor.'] },
  identificacaoClassificacaoVeiculo: {
    type: Number,
    required: [true, 'Informe a classificação do veiculo.'],
  },
  descricaoClassificacaoVeiculo: { type: String, required: [true, 'Informe a descrição da classificação.'] },
  tempoAguardandoPatio: { type: String, required: [true, 'Informe o tempo do campo aguardando no pario.'] },
  tempoCarregamento: { type: String, required: [true, 'Informe o tempo de carregamento.'] },
  tempoEmissao: { type: String, required: [true, 'Informe o tempo de emissao.'] },
  tempoDescarga: { type: String, required: [true, 'Informe o tempo de descarga.'] },
  tempoFornecedor: { type: String, required: [true, 'Informe o tempo do fornecedor.'] },
  tempoFreeTimeCliente: { type: String, required: [true, 'Informe o tempo free time do cliente.'] },
  tempoMaxCliente: { type: String, required: [true, 'Informe o tempo maximo do cliente.'] },
  tempoSlaEntrega: { type: String, required: [true, 'Informe o tempo de SLA.'] },
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
  timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' },
});

parceiroTempoMovimentoSchema.index({ hubParceiroId: 1, identificacaoClassificacaoVeiculo: 1, hubFornecedorId: 1 }, { unique: true });

const parceiroTemposMovimentoModel = mongoose.model('torreParceiroTempoMovimento', parceiroTempoMovimentoSchema);

module.exports = parceiroTemposMovimentoModel;
