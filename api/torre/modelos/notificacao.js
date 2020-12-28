import mongoose from 'mongoose'
import Usuario from './usuario'

mongoose.pluralize(null)

const validateEmail = function (email) {
  const re = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

const usuarioSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torreUsuario',
      required: true,
      validate: {
        async validator (v) {
          return Usuario.findById(v, rec => rec !== null)
        },
        message: 'Usuário informado não existe!'
      }
    },
    lido: { type: Boolean, default: false },
    dataLeitura: { type: Date, default: null }
  },
  { _id: false }
)

const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      validate: [validateEmail, 'E-mail inválido']
    },
    enviado: { type: Boolean, default: false },
    dataEnvio: { type: Date, default: null },
    dataRegistro: { type: Date, default: null },
    emailProcessamentoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torre',
      required: false,
      // validate: {
      //   validator: async function (v) {
      //     return await TipoOcorrencia.findById(v, (err, rec) => rec !== null)
      //   },
      //   message: 'Tipo de ocorr�ncia informado n�o existe! '
      // }
    },
  },
  { _id: false }
)

const notificacaoSchema = new mongoose.Schema(
  {
    ocorrenciaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torreOcorrencia',
      required: false,
      // validate: {
      //   validator: async function (v) {
      //     return await TipoOcorrencia.findById(v, (err, rec) => rec !== null)
      //   },
      //   message: 'Tipo de ocorr�ncia informado n�o existe! '
      // }
    },
    titulo: { type: String, required: true },
    corpo: { type: String, required: true },
    dataHora: { type: Date, required: true },
    usuarios: { type: [usuarioSchema], required: false },
    emails: { type: [emailSchema], required: false },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    }
  },
  {
    // strict: 'throw',
    versionKey: false
  }
)

notificacaoSchema.pre('validate', function (next) {
  const hasUsuarios = this.usuarios !== null && this.usuarios.length > 0
  const hasEmails = this.emails !== null && this.emails.length > 0

  if (!hasUsuarios && !hasEmails) {
    next(
      new Error(
        'Deve ser informado pelo menos um usuario ou e-mail para ser notificado.'
      )
    )
  } else {
    next()
  }
})

const notificacaoModel = mongoose.model('torreNotificacao', notificacaoSchema)

module.exports = notificacaoModel
