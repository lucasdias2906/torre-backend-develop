import mongoose from 'mongoose';

mongoose.pluralize(null);

const rotaDadoComplementarSchema = new mongoose.Schema(
  {
    hubRotaId: {
      type: String,
      required: [true, 'Informe o id do Hub na Rota.'],
      index: true,
    },
    hubVeiculoClassificacaoId: {
      type: Number,
      required: [true, 'Informe o id da Classificação do Veículo.'],
      index: true,
    },
    velocidadeMediaVazio: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 999 & v >= 0;
        },
        message: props => `${props.value} O valor deve ser maior que 0 e menor que 999.`
      },
      //required: [true, 'Informe a velocidade média vazio.']
    },
    velocidadeMediaCarregado: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 999 & v >= 0;
        },
        message: props => `${props.value} O deve ser maior que 0 e menor que 999.`
      },
      //required: [true, 'Informe a velocidade média carregado.']
    },
    log: {
      dataInclusao: { type: Date, required: [false, 'Informe a data inclusão.'] },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: [false, 'Informe a data alteração.'] },
      usuarioAlteracao: { type: String, required: true }
    },
  },
  {
    versionKey: false, timestamps: { createdAt: 'dataInclusao', updatedAt: 'dataAlteracao' },
    //	strict: "throw"
  },
);

rotaDadoComplementarSchema.index({ hubRotaId: 1, hubVeiculoClassificacaoId: 1 }, { unique: true });

const rotaDadoComplementarModel = mongoose.model('torreRotaDadoComplementar', rotaDadoComplementarSchema);

module.exports = rotaDadoComplementarModel;
