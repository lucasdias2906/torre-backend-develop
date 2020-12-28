// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

// Criando a instancia de motorista
module.exports = mongoose.model('torreMotorista', new Schema(
  {
    codigoMotorista: {
      type: String,
      required: [true, 'Informe o código do motorista.'],
      unique: true, index: true
    },
    valorSalarioBase: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      },
      required: [true, 'Informe o valor do salário base.']
    },
    valorTotalEncargos: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      },
      required: [true, 'Informe o valor total dos encargos.']
    },
    valorTotalBeneficios: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O deve ser menor que 100.000,00.`
      },
      required: [true, 'Informe o valor do total dos benefícios.']
    },
    quantidadeHorasExtras: {
      type: Number,
      validate: {
        validator: function (v) {
          return v >= 0 & v <= 999;
        },
        message: props => `${props.value} O valor deve ser entre 0 e 999.`
      },
      required: [true, 'Informe a quantidade de horas extras (Convenção).']
    },
    codigoSegurancaCNH: {
      type: String,
      validate: {
        validator: function (v) {
          if (v.replace(/[^\d]/g, '').length === 11)
            return v.replace(/[^\d]/g, '');
          return null
        },
        message: props => `${props.value} Informe um código segurança CNH válido (Deve possuir 11 números).`
      }, required: [true, 'Informe o código segurança CNH.']
    },
    valorCafeManha: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      },
      required: [true, 'Informe o valor do café da manhã .']
    },
    valorAlmoco: {
      type: Number, validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      },
      required: [true, 'Informe o valor do almoço.']
    },
    valorJantar: {
      type: Number, validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      },
      required: [true, 'Informe valor do jantar.']
    },
    valorPerNoite: {
      type: Number, validate: {
        validator: function (v) {
          return v < 100000;
        },
        message: props => `${props.value} O valor deve ser menor que 100.000,00.`
      },
      required: [true, 'Informe valor do pernoite.']
    },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    }
  },
  {
    versionKey: false, timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' }//,
    //	strict: "throw"
  },
));
