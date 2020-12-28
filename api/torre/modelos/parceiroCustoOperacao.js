
import mongoose from 'mongoose';

mongoose.pluralize(null);

const custoOperacaoSchema = new mongoose.Schema({
  hubParceiroId: { type: Number, required: [true, 'Informe o código do parceiro comercial.'] },
  codigoTipoOperacao: {
    type: Number,
    required: [true, 'Informe o tipo da operação.'],
  },
  descricaoTipoOperacao: {
    type: String,
    required: [true, 'Informa a descrição do tipo de operação'],
  },
  identificacaoClassificacaoVeiculo: {
    type: Number,
    required: [true, 'Informe a classificação do veiculo.'],
  },
  descricaoClassificacaoVeiculo: {
    type: String,
    required: [true, 'Informe a descrição da classificação do veiculo.'],
  },
  valorCustoFreeTime: {
    type: Number,
    validate: {
      validator(v) {
        return v < 99999.99;
      },
      message: (props) => `${props.value} O valor deve ser menor que 99999.99.`,
    },
    required: [true, 'Informe o valor do custo da Operação.'],
  },
  log:
  {
    usuarioInclusao: { type: String, required: false },
    usuarioAlteracao: { type: String, required: false },
    dataInclusao: { type: Date, required: [false, 'Informe a data criação.'] },
    dataAlteracao: { type: Date, required: [false, 'Informe a data alteração.'] },
  },
},
{
  // strict: 'throw',
  versionKey: false,
  timestamps: { createdAt: 'dataInclusao', updatedAt: 'dataAlteracao' },
});

custoOperacaoSchema.index({ hubParceiroId: 1, codigoTipoOperacao: 1, identificacaoClassificacaoVeiculo: 1 }, { unique: true });

const custoOperacaoModel = mongoose.model('torreParceiroCustoOperacao', custoOperacaoSchema);

module.exports = custoOperacaoModel;
