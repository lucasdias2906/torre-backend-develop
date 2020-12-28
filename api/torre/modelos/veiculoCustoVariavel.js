// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

// Criando a instancia de CustosVariaveis
module.exports = mongoose.model('torreVeiculoCustoVariavel', new Schema(
  {
    codigoVeiculo: { type: String, required: [true, 'Informe o código do codigoVeiculo.'] },
    codigoRegiaoOperacao: { type: Number, required: [true, 'Informe a regiao de operação.'] },
    dataVigenciaVariavel: { type: Date, required: [true, 'Informe data de Vigência.'] },
    custoOleoDiesel: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      }, required: false
    },
    custoMediaConsumo: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 1000000;
        },
        message: props => `${props.value} O valor deve ser menor que 1.000.000,00.`
      }, required: false
    },
    combustivelPorKm: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000.0000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,0000.`
      }, required: false
    },
    custoGalaoArla: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 10000;
        },
        message: props => `${props.value} O valor deve ser menor que 10.000,00.`
      }, required: false
    },
    mediaConsumoArla: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      }, required: false
    },
    arlaPorKm: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000.0000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,0000.`
      }, required: false
    },
    custoPneu: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      }, required: false
    },
    kmsPorPneu: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000.0000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,0000.`
      }, required: false
    },
    pneuPorKm: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000.0000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,0000.`
      }, required: false
    },
    custoLavagem: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      }, required: false
    },
    despesasViagem: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      }, required: false
    },
    comissaoMotorista: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      }, required: false
    },
    custoManutencaoKm: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000.0000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,0000.`
      }, required: false
    },
    log: {
      dataInclusao: { type: Date, required: false },
      dataAlteracao: { type: Date, required: false },
      usuarioInclusao: { type: String, required: [false, 'Informe o login do usuario para criação'] },
      usuarioAlteracao: { type: String, required: [false, 'Informe o login do usuario para alteração.'] },
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' },
    //, strict: 'throw'
  },
));
