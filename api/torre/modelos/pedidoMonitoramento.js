// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const pedidoMonitoramentoSchema = new mongoose.Schema(
  {
    numeroPedido: { type: String, required: true },
    codigoFilial: { type: Number, required: true },
    codigoPedido: { type: String, required: true },
    codigoFilialPedido: { type: Number, required: true },
    codigoAgrupadorTorre: { type: String, required: false },
    statusPedido: { type: String, required: false },
    codigoPlacaVeiculo: { type: String, required: false },
    placaVeiculo: { type: String, required: false },
    codigoPlacaVeiculo2: { type: String, required: false },
    placaVeiculo2: { type: String, required: false },
    codigoPlacaVeiculo3: { type: String, required: false },
    placaVeiculo3: { type: String, required: false },
    codigoPlacaVeiculo4: { type: String, required: false },
    placaVeiculo4: { type: String, required: false },
    codigoMotorista1: { type: Number, required: false },
    codigoMotorista2: { type: Number, required: false },
    nomeMotorista: { type: String, required: false },
    dataInicioViagem: { type: Date, required: false },
    dataProgramacao: { type: Date, required: false },
    dataColeta: { type: Date, required: false },
    dataPedido: { type: Date, required: false },
    nomeFilial: { type: String, required: false },
    codigoTomador: { type: Number, required: false },
    nomeTomador: { type: String, required: false },
    codigoRemetente: { type: Number, required: false },
    nomeRemetente: { type: String, required: false },
    codigoDestinatario: { type: Number, required: false },
    nomeDestinatario: { type: String, required: false },
    codigoLinhaTrecho: { type: String, required: false },
    codigoLocalColeta: { type: Number, required: false },
    nomeLocalColeta: { type: String, required: false },
    latitudeLocalColeta: { type: Number, required: false },
    longitudeLocalColeta: { type: Number, required: false },
    raioMetrosLocalColeta: { type: Number, required: false },
    codigoLocalEntrega: { type: Number, required: false },
    nomeLocalEntrega: { type: String, required: false },
    latitudeLocalEntrega: { type: Number, required: false },
    longitudeLocalEntrega: { type: Number, required: false },
    raioMetrosLocalEntrega: { type: Number, required: false },
    dataEntrega: { type: Date, required: false },
    tipoMonitoramento: { type: String, required: true },
    statusMonitoramento: { type: String, required: true },
    qtdeAtualizacoes: { type: Number, required: true },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true }
    }
  },
  {
    versionKey: false, timestamps: { createdAt: 'log.dataInclusao', updatedAt: 'log.dataAlteracao' },
  },
);

pedidoMonitoramentoSchema.index({ numeroPedido: 1, codigoFilial: 1 }, { unique: true })

const pedidoMonitoramentoModel = mongoose.model('torrePedidoMonitoramento', pedidoMonitoramentoSchema);
module.exports = pedidoMonitoramentoModel;
