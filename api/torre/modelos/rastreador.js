// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

  module.exports = mongoose.model('torreLogRastreador', new Schema(
    {
      dataHora: { type: Date, required: false},
      descricao: { type: String, required: false},
      idMensagem: { type: String, required: false},
      idRastreador: { type: String, required: false },
      latitude: { type: Number, required: false},
      longitude: { type: Number, required: false},
      placa: { type: String, required: false},
      ignicao: {type: Number, required: false},
      velocidade: { type: Number, required: false},
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
  ));
