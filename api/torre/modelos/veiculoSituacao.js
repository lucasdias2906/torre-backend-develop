// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

// Criando a instancia de SituacaoVeiculo
module.exports = mongoose.model('torreVeiculoSituacao', new Schema(
  {
    identificadorSituacaoVeiculo: { type: Number, unique: true, required: true },
    descricaoSituacaoVeiculo: { type: String, required: true },
    log: {
      dataInclusao: { type: Date, required: false },
      dataAlteracao: { type: Date, required: false },
      usuarioInclusao: { type: String, required: [false, 'Informe o login do usuario para criação'] },
      usuarioAlteracao: { type: String, required: [false, 'Informe o login do usuario para alteração.'] },
    },
  },
  {
    // strict: 'throw',
    versionKey: false,
  },
));
