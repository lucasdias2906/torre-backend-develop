import mongoose from 'mongoose'

mongoose.pluralize(null)

const enumStatusRotina = Object.freeze({
  GERANDO: 'G', // Gerando
  PROCESSADO: 'P', // Processado
  INCONSISTENTE: 'I', // Possui alguma inconsistência,
  ERRO: 'E', // Possui alguma inconsistência
})

const enumTipoRotina = Object.freeze({
  ENVIO_EMAIL: 'EMAIL_OCORRENCIAS', // Envio de Emails
  MAPA_SINOTICO: 'MAPA_SINOTICO', // Processamento do Mapa Sinótico
  MONITORAMENTO: 'MONITORAMENTO', // Monitoramento
  MONITORAMENTO_DIARIO: 'MONITORAMENTO_DIARIO', // Monitoramento Diário (Veículos e Motoristas)
  MONITORAMENTO_EM_VIAGEM: 'MONITORAMENTO_EM_VIAGEM', //Monitoramento Pedidos em Viagem
  MONITORAMENTO_NOVOS_AND_EMALOCACAO: 'MONITORAMENTO_NOVOS_AND_EMALOCACAO', //Monitoramento Pedidos Novos and Em Alocacao
  PEDIDOS_PARA_MONITORAMENTO: 'PEDIDOS_PARA_MONITORAMENTO', //Obtenção de Pedidos para Monitoramento
  ATUALIZACAO_PEDIDOS_PARA_MONITORAMENTO: 'ATUALIZACAO_PEDIDOS_PARA_MONITORAMENTO', //Atualização de Pedidos para Monitoramento
})

const rotinaSchema = new mongoose.Schema(
  {
    descricao: { type: String, required: true },
    observacao: { type: String, required: false },
    inicioProcessamento: { type: Date, required: true },
    fimProcessamento: { type: Date, required: false },
    status: {
      type: String,
      enum: Object.values(enumStatusRotina),
      required: false,
    },
    tipo: {
      type: String,
      enum: Object.values(enumTipoRotina),
      required: true,
    },
    qtdIncluidos: { type: Number, required: false },
    qtdAlterados: { type: Number, required: false },
    qtdErros: { type: Number, required: false },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true },
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'log.dataInclusao',
      updatedAt: 'log.dataAlteracao',
    },
  },
)


const rotinaModel = mongoose.model(
  'torreRotina',
  rotinaSchema,
)

module.exports = rotinaModel
