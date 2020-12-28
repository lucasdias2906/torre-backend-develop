// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

module.exports = mongoose.model('torreVeiculoTipoVinculo', new Schema(
  {
    identificadorTipoVinculo: { type: String, unique: true, required: true }, //dbo.RODVEI.TIPVIN
    descricaoTipoVinculo: { type: String, required: true },
    log: {
      dataInclusao: { type: Date, required: false },
      dataAlteracao: { type: Date, required: false },
      usuarioInclusao: { type: String, required: [false, 'Informe o login do usuario para criação'] },
      usuarioAlteracao: { type: String, required: [false, 'Informe o login do usuario para alteração.'] },
    },
  },
  { //strict: 'throw',
    versionKey: false,
  },
));
