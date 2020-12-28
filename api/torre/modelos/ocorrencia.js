// importantado o mongo e o schema
import mongoose from 'mongoose'
import Perfil from './perfil'
import Destinatario from './ocorrenciaDestinatario'
import TipoOcorrencia from './tipoOcorrencia'
import { enumStatusOcorrencia } from './enumStatusOcorrencia'

mongoose.pluralize(null)

const acaoOcorrenciaSchema = new mongoose.Schema(
  {
    acao: { type: String, required: true },
    usuarioLogin: { type: String, required: false },
    usuarioNome: { type: String, required: false },
    dataAcao: { type: Date, required: true }
  },
  {
    // strict: 'throw',
    versionKey: false
  }
)

const grupoPerfilSchema = new mongoose.Schema(
  {
    perfilId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torrePerfil',
      required: true,
      validate: {
        validator: async function (v) {
          const perfil = await Perfil.findById(v, (rec) => rec !== null)
          return perfil
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
          const destinatario = await Destinatario.findById(v, (rec) => rec !== null)
          return destinatario
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

const ocorrenciaSchema = new mongoose.Schema(
  {
    codigo: {
      type: Number,
      required: [true, 'Informe o código da Ocorrência.'],
      unique: true,
      index: true,
    },
    tipoOcorrenciaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torreTipoOcorrencia',
      required: true,
      validate: {
        validator: async function (v) {
          const tipoOcorrencia = await TipoOcorrencia.findById(v, (rec) => rec !== null)
          return tipoOcorrencia
        },
        message: 'Tipo de ocorrência informado não existe!'
      }
    },
    origem: { type: String, required: true },
    disparo: { type: String, required: true },
    classificacao: { type: String, required: true },
    prioridade: { type: String, required: true },
    descricao: { type: String, required: true },
    tempoMaximoOcorrenciaSemAcao: { type: Number, required: false },
    tempoMaximoOcorrenciaPendente: { type: Number, required: false },
    dataLimitePrimeiraAcao: { type: Date, required: true },
    dataEfetivaPrimeiraAcao: { type: Date, required: false },
    dataLimiteEncerramento: { type: Date, required: true },
    descricaoDetalhada: { type: String, required: true },
    informacoesAdicionais: { type: String, required: false },
    codigoFilial: { type: String, required: false },
    perfis: { type: [grupoPerfilSchema], required: true },
    destinatarios: { type: [destinatarioSchema], required: false },
    status: {
      type: String,
      enum: Object.values(enumStatusOcorrencia),
      required: true
    },
    dataOcorrencia: { type: Date, required: true },
    dataFimOcorrencia: { type: Date, required: false },
    abertura: {
      data: { type: Date, required: true },
      usuarioLogin: { type: String, required: false },
      usuarioNome: { type: String, required: false }
    },
    encerramento: {
      data: { type: Date, required: false },
      usuarioLogin: { type: String, required: false },
      usuarioNome: { type: String, required: false }
    },
    // responsável
    pedido: {
      numero: { type: String, required: false },
      codigoFilial: { type: String, required: false },
      nomeFilial: { type: String, required: false },
      cliente: { type: String, required: false },
      placaVeiculo: { type: String, required: false },
      origem: { type: String, required: false },
      destino: { type: String, required: false },
      motorista: { type: String, required: false },
      nomeMotorista: { type: String, required: false },
      parceiroComercial: { type: String, required: false }
    },
    motorista: {
      codigo: { type: Number, required: false },
      nome: { type: String, required: false },
      cpf: { type: String, required: false },
      rg: { type: String, required: false },
      cnh: { type: String, required: false },
      dataNascimento: { type: Date, required: false }
    },
    veiculo: {
      codigo: { type: String, required: false },
      nomeProprietario: { type: String, required: false },
      placa: { type: String, required: false },
      chassi: { type: String, required: false },
      marca: { type: String, required: false },
      modelo: { type: String, required: false }
    },
    historicoAcoes: { type: [acaoOcorrenciaSchema], required: false },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    }
    // comentários
  },
  {
    versionKey: false, timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' }
  }
)

const ocorrenciaModel = mongoose.model('torreOcorrencia', ocorrenciaSchema)

module.exports = ocorrenciaModel
