import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

const perfilSchema = new Schema(
  {
    //  _id identificadorPerfilAcesso
    nome: {
      type: String,
      unique: true,
      index: true,
      validate: {
        validator: function (v) {
          return v.length < 20;
        },
        message: '[{VALUE}] campo deve ter tamanho máximo de 20!'
      },
      required: true
    }, // nomePerfilAcesso
    status: {
      type: Boolean,//,
      //validate: {
      //   validator: function(v) {
      //    return v==='A' || v==="I";
      //  },
      // message: '[{VALUE}] campo deve ser A-Ativo ou I-Inativo!',
      required: true
      // }, // está na tela da EF TL040-1 – Realizar o cadastro de um perfil de acesso
    },
    descricao: { type: String, required: true }, // está na tela da EF TL040-1 – Realizar o cadastro de um perfil de acesso
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    },
  },
  {
    //strict: 'throw',
    versionKey: false,
  },
);

// documentação = tabela TOPGM.CadastroPerfilsAcesso
module.exports = mongoose.model('torrePerfil', perfilSchema);
