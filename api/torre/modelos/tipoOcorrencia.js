// importantado o mongo e o schema
import mongoose from 'mongoose'
import Perfil from './perfil'
import Destinatario from './ocorrenciaDestinatario'

mongoose.pluralize(null)

const enumOrigemOcorrencia = Object.freeze({
  PEDIDO: 'PEDIDO',
  VEICULO: 'VEICULO',
  MOTORISTA: 'MOTORISTA',
  GERAL: 'GERAL'
})

const enumDisparoOcorrencia = Object.freeze({
  AUTOMATICA: 'AUTOMATICA',
  MANUAL: 'MANUAL',
  AMBAS: 'AMBAS'
})

const enumClassificacaoOcorrencia = Object.freeze({
  GERENCIAL: 'GERENCIAL',
  INFORMATIVA: 'INFORMATIVA'
})

const enumPrioridadeOcorrencia = Object.freeze({
  ALTA: 'ALTA',
  BAIXA: 'BAIXA'
})

const grupoPerfilSchema = new mongoose.Schema(
  {
    perfilId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torrePerfil',
      required: true,
      validate: {
        validator: async function (v) {
          return await Perfil.findById(v, (err, rec) => rec !== null)
        },
        message: 'Perfil informado não existe! '
      }
    }
  },
  {
    // strict: 'throw',
    versionKey: false
  }
)

const destinatarioSchema = new mongoose.Schema(
  {
    destinatarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torreOcorrenciaDestinatario',
      required: true,
      validate: {
        validator: async function (v) {
          return await Destinatario.findById(v, (err, rec) => rec !== null)
        },
        message: 'Destinatário informado não existe! '
      }
    }
  },
  {
    // strict: 'throw',
    versionKey: false
  }
)

const tipoOcorrenciaSchema = new mongoose.Schema(
  {
    codigo: {
      type: Number,
      required: [true, 'Informe o código do Tipo de Ocorrência.']
    },
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    textoPadrao: { type: String, required: true },
    origem: {
      type: String,
      enum: Object.values(enumOrigemOcorrencia),
      required: true
    },
    disparo: {
      type: String,
      enum: Object.values(enumDisparoOcorrencia),
      required: true
    },
    classificacao: {
      type: String,
      enum: Object.values(enumClassificacaoOcorrencia),
      required: true
    },
    prioridade: {
      type: String,
      enum: Object.values(enumPrioridadeOcorrencia),
      required: true
    },
    ativo: { type: Boolean, default: false },
    tempoMaximoOcorrenciaSemAcao: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 600
        },
        message: props =>
          `${props.value} O valor deve ser menor que 600 minutos.`
      }
    },
    tempoMaximoOcorrenciaPendente: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < 600
        },
        message: props =>
          `${props.value} O valor deve ser menor que 600 minutos.`
      }
    },
    notificacao: { type: Boolean, default: false },
    perfis: { type: [grupoPerfilSchema], required: false },
    email: { type: Boolean, default: false },
    destinatarios: { type: [destinatarioSchema], required: false },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'log.dataInclusao',
      updatedAt: 'log.dataAlteracao'
    }
  }
)

tipoOcorrenciaSchema.index({ codigo: 1 }, { unique: true })
tipoOcorrenciaSchema.index({ nome: 1 }, { unique: true })

const tipoOcorrenciaModel = mongoose.model(
  'torreTipoOcorrencia',
  tipoOcorrenciaSchema
)

module.exports = tipoOcorrenciaModel
