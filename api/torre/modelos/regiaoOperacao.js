// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

// Criando a instancia de RegiaoOperacao
module.exports = mongoose.model('torreRegiaoOperacao', new Schema(
  {
    codigoRegiaoOperacao: { type: Number, required: [true, 'Informe a regiao de operação.'] },
    regiaoOperacao: { type: String, required: [true, 'Informe a regiao de operação.'], unique: true },
    log: {
      dataInclusao: { type: Date, required: false },
      dataAlteracao: { type: Date, required: false },
      usuarioInclusao: { type: String, required: [true, 'Informe o login do usuario para Inclusao'] },
      usuarioAlteracao: { type: String, required: [true, 'Informe o login do usuario para alteração.'] }
    },
  },
  {
    versionKey: false, timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' },
    //, strict: 'throw'
  },
));
