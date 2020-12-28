// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

// Criando a instancia de CustosFixos
module.exports = mongoose.model('torreVeiculoCustoFixo', new Schema(
  {
    codigoVeiculo: { type: String, required: [true, 'Informe o código do codigoVeiculo.'] },
    vigenciaCustoFixo: { type: Date, required: [true, 'Informe data de Vigência.'] },
    custoReposicaoFrota: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 10000000;
        },
        message: props => `${props.value} O valor deve ser menor que 10.000.000,00.`
      },
      required: false
    },
    custoRemuneracaoFrota: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 10000000;
        },
        message: props => `${props.value} O valor deve ser menor que 10.000.000,00.`
      },
      required: false
    },
    custoMotoristaTotal: { type: Number, required: false },
    custoFixoTotal: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 10000000;
        },
        message: props => `${props.value} O valor deve ser menor que 10.000.000,00.`
      }, required: false
    },
    custoDocumentosImpostos: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      }, required: false
    },
    custoRastreador: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      }, required: false
    },
    custoSeguro: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
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
    //strict: 'throw'
  },
));
