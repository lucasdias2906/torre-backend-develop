import mongoose from 'mongoose'
import Perfil from './perfil'
import Modulo from './modulo'
import Funcionalidade from './funcionalidade'

mongoose.pluralize(null)

const { Schema } = mongoose

const filialSchema = new mongoose.Schema(
  {
    hubFilialId: { type: Number, required: true },
  },
  { _id: false },
)

const empresaSchema = new mongoose.Schema(
  {
    hubEmpresaId: { type: Number, required: true },
    filiais: { type: [filialSchema], required: true },
  },
  { _id: false },
)

const parceiroSchema = new mongoose.Schema(
  {
    hubParceiroId: { type: Number, required: true }
  },
  { _id: false },
)


const permissaoSchema = new mongoose.Schema(
  {
    moduloId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torreModulo',
      required: true,
      validate: {
        validator: async function (v) {
          return await Modulo.findById(v, (err, rec) => rec !== null)
        },
        message: 'Módulo informado não existe! ',
      },
    },
    funcionalidadeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torreFuncionalidade',
      required: true,
      validate: {
        validator: async function (v) {
          const vFuncionalidade = await Funcionalidade.findOne({ moduloId: this.moduloId, _id: v });
          return vFuncionalidade !== null;
        },
        message: 'Funcionalidade informada não existe ou não associada ao módulo! '
      }
    },
    permiteConsultar: { type: Boolean, required: true },
    permiteAlterar: { type: Boolean, required: true },
  },
  {
    //strict: 'throw',
    versionKey: false,
  },
)

const usuarioSchema = new Schema(
  {
    empresa: { type: Number, required: false },
    perfilAcesso: { type: Number, required: false },
    dataNascimento: { type: Date, required: true },
    login: { type: String, required: true, unique: true, index: true },
    nome: { type: String, required: true },
    status: { type: Boolean, required: true },
    sexo: { type: String, required: true },
    ehCliente: { type: Boolean, required: true },
    cpf: { type: String, required: true },
    telefone: { type: String, required: true },
    celular: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    senha: { type: String, required: true },
    tokenSenha: { type: String, required: false },
    tokenSenhaValidade: { type: Date, required: false },
    uuidConfirmacao: { type: String, required: true },
    dataConfirmacao: { type: Date, required: false },
    empresas: { type: [empresaSchema], required: true },
    parceiros: { type: [parceiroSchema], required: true },
    permissoes: { type: [permissaoSchema], required: true },
    dataBloqueio: { type: Date, required: false },
    loginTentativaErro: { type: Number, required: true, default: 0 },
    perfilId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torrePerfil',
      required: true,
      validate: {
        async validator(v) {
          return Perfil.findById(v, (err, rec) => rec !== null)
        },
        message: 'Perfil informado não existe! ',
      },
    },
    log:
    {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true },
    },
  },
  {
    strict: 'throw',
    versionKey: false,
    timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' },
  },
)

usuarioSchema.pre('validate', function (next) {
  const possuiEmpresas = this.empresas !== null && this.empresas.length > 0

  if (!possuiEmpresas) {
    next(
      new Error(
        'Favor informar pelo menos uma permissão referente a empresa!',
      ),
    );
  } else {
    next()
  }
})

const usuarioModel = mongoose.model('torreUsuario', usuarioSchema)

module.exports = usuarioModel
