import mongoose from 'mongoose'

const enumTipoPoligono = Object.freeze({
  COLETA: 'COLETA',
  ENTREGA: 'ENTREGA',
  CHECKPOINT: 'CHECKPOINT',
})

const enumStatusMapaSinotico = Object.freeze({
  VIAGEM: 'V', // Possui viagem em andamento
  PROCESSADO: 'P', // Processado
  INCONSISTENTE: 'I', // Possui alguma inconsistência
})

const enumStatusMapaEtapaSinotico = Object.freeze({
  VIAGEM: 'V', // Possui viagem em andamento
  PROCESSADO: 'P', // Processado mapa Gerado
  INCONSISTENTE: 'I', // Possui alguma inconsistência
})

mongoose.pluralize(null)

const checkpointSchema = new mongoose.Schema(
  {
    dataHoraPlanejadaPassagem: { type: Date, required: false },
    dataHoraPrevistaPassagem: { type: Date, required: false },
    dataHoraPassagem: { type: Date, required: false },
    localizacao: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
  },
  {
    // strict: 'throw',
    versionKey: false,
  },
)

const poligonoSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: Object.values(enumTipoPoligono),
      required: false,
    },
    idParceiroComercial: { type: Number, required: true },
    dataHoraPlanejadaEntrada: { type: Date, required: false },
    dataHoraPlanejadaSaida: { type: Date, required: false },
    dataHoraPrevistaEntrada: { type: Date, required: false },
    dataHoraPrevistaSaida: { type: Date, required: false },
    dataEntrada: { type: Date, required: false },
    dataSaida: { type: Date, required: false },
    tempoPrevistoDentroDoPoligono: { type: String, required: false },
    tempoDentroDoPoligono: { type: String, required: false },
    raio: { type: Number, required: false }, // raio do polígono, quando o polígono tiver apenas um ponto e com o valor do raio, entende-se que ele é uma circurferência
    pontos: {
      type: {
        type: String,
        enum: ['Polygon'],
        required: false,
      },
      coordinates: [[0, 0], []],
    },
  },
  {
    // strict: 'throw',
    versionKey: false,
  },
)

const etapaMapaSinoticoSchema = new mongoose.Schema(
  {
    descricao: { type: String, required: true },
    ordem: { type: Number, required: true },
    concluido: { type: Boolean, required: true, default: false },
    atraso: { type: Boolean, required: true, default: false },
    checkpoint: { type: checkpointSchema, required: false },
    poligono: { type: poligonoSchema, required: false },
    status: {
      type: String,
      enum: Object.values(enumStatusMapaEtapaSinotico),
      required: false,
    },
    posicao: { latitude: { type: Number, required: true }, longitude: { type: Number, required: true } },
  },
  {
    // strict: 'throw',
    versionKey: false,
  },
)

const mapaSinoticoSchema = new mongoose.Schema(
  {
    numeroPedido: { type: String, required: true },
    codigoFilial: { type: Number, required: true },
    posicaoAtual: { latitude: { type: Number, required: true }, longitude: { type: Number, required: true } },
    status: {
      type: String,
      enum: Object.values(enumStatusMapaSinotico),
      required: false,
    },
    observacao: { type: String, required: false },
    ultimaPosicaoRastreadorPrincipal: {
      placaVeiculo: { type: String, required: false },
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
      dataVerificacao: { type: Date, required: false },
    },
    etapas: { type: [etapaMapaSinoticoSchema], required: true },
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

mapaSinoticoSchema.index(
  { numeroPedido: 1, codigoFilial: 2 },
  { unique: true },
)

const mapaSinoticoModel = mongoose.model(
  'torreMapaSinotico',
  mapaSinoticoSchema,
)

module.exports = mapaSinoticoModel
