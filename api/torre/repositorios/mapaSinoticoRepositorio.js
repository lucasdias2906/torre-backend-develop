import mongoose from 'mongoose'
import Base from './base/baseRepositorio'
import MapaSinotico from '../modelos/mapaSinotico'

const geolib = require('geolib')

export default class MapaSinoticoRepositorio {
  constructor() {
    this.baseRepositorio = new Base('torreMapaSinotico')
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async obter(id) {
    return this.baseRepositorio.obter(id)
  }

  async obterPorPedido(pNumeroPedido, pCodigoFilial) {
    return this.baseRepositorio.obterUm({ numeroPedido: pNumeroPedido, codigoFilial: pCodigoFilial })
  }

  async obterPorEtapa(pIdEtapa) {
    return this.baseRepositorio.obterUm({ 'etapas._id': pIdEtapa })
  }

  async listarMapaSinotico(pFiltro) {
    return MapaSinotico.find(pFiltro)
      .sort({ sequenciaPonto: 'ASC' })
      .select({ pontos: 1, _id: 0 })
  }

  async ultimaPosicaoEstahContidaNoPoligono(pEtapaId, pLatitude, pLongitude) {
    const vRetorno = await MapaSinotico.find(
      {
        $and:
          [
            { 'etapas.poligono.pontos': { $geoIntersects: { $geometry: { type: 'Point', coordinates: [pLatitude, pLongitude] } } } },
            { 'etapas._id': pEtapaId },
          ],
      },
    )
    return (vRetorno ? (vRetorno.length > 0) : false)
  }

  async ultimaPosicaoEstahContidaNoCirculo(pEtapaId, pLatitude, pLongitude) {
    const vAggregate = [{ $unwind: '$etapas' },
    { $match: { 'etapas._id': pEtapaId } },
    {
      $replaceWith: {
        etapaId: '$etapas._id',
        raio: '$etapas.poligono.raio',
        coordenadas: '$etapas.poligono.pontos.coordinates',
      },
    }]
    const pParams = {}
    pParams.instrucao = vAggregate
    const vRetorno = (await this.baseRepositorio.agregar(pParams)).dados

    if (vRetorno[0].coordenadas[0].length > 1) return false // tem mais do que um ponto, então é um polígono e não um ponto do círculo

    let vLatitude = 0
    let vLongitude = 0
    if (vRetorno) {
      // eslint-disable-next-line prefer-destructuring
      vLatitude = vRetorno[0].coordenadas[0][0][0]
      // eslint-disable-next-line prefer-destructuring
      vLongitude = vRetorno[0].coordenadas[0][0][1]
    }

    // distancia em metros
    const distancia = geolib.getPreciseDistance(
      { latitude: vLatitude, longitude: vLongitude },
      { latitude: pLatitude, longitude: pLongitude },
    )

    if (vLatitude === 0 || vLongitude === 0) return false

    return distancia <= (vRetorno[0].raio || 0) // verifica se a distância é menor do que o raio
  }

  async incluir(body) {
    return this.baseRepositorio.incluir(body)
  }

  async alterar(vFiltro, data) {
    return this.baseRepositorio.alterarUm(vFiltro, data, {})
  }

  async obterDadosEtapa(idEtapa) {
    return this.baseRepositorio.getModel().findOne(
      {
        'etapas._id': mongoose.Types.ObjectId(idEtapa),
      },
      { _id: 1, 'etapas.$': 1 })
  }

  async alterarEtapaDataPrevistaPassagem(idEtapa, dataHoraPrevistaPassagem) {
    return this.baseRepositorio.getModel().updateOne(
      {
        'etapas._id': mongoose.Types.ObjectId(idEtapa),
      },
      {
        $set:
          { 'etapas.$.checkpoint.dataHoraPrevistaPassagem': dataHoraPrevistaPassagem },
      },
    )
  }

  async alterarStatusParaViagem(idMapaSinotico) {
    return this.baseRepositorio.alterarUm({ _id: idMapaSinotico }, { status: 'V' })
  }

  async alterarEtapaDataEntrada(idEtapa, dataEntrada) {
    return this.baseRepositorio.getModel().updateOne(
      {
        'etapas._id': mongoose.Types.ObjectId(idEtapa),
      },
      {
        $set:
          { 'etapas.$.poligono.dataEntrada': dataEntrada }
      })
  }

  async alterarEtapaDataSaida(idEtapa, dataSaida) {
    return this.baseRepositorio.getModel().updateOne(
      {
        'etapas._id': mongoose.Types.ObjectId(idEtapa),
      },
      {
        $set:
          { 'etapas.$.poligono.dataSaida': dataSaida }
      })
  }

  async registrarPassagemCheckpoint(idEtapa, dataPassagem) {
    return this.baseRepositorio.getModel().updateOne(
      {
        'etapas._id': mongoose.Types.ObjectId(idEtapa),
      },
      {
        $set:
          { 'etapas.$.concluido': true, 'etapas.$.checkpoint.dataHoraPassagem': dataPassagem },
      })
  }

  async alterarEtapaDataPrevistaEntrada(idEtapa, dataHoraPrevistaEntrada) {
    return this.baseRepositorio.getModel().updateOne(
      {
        'etapas._id': mongoose.Types.ObjectId(idEtapa),
      },
      {
        $set:
          { 'etapas.$.poligono.dataHoraPrevistaEntrada': dataHoraPrevistaEntrada }
      })
  }

  async alterarEtapaDataPrevistaSaida(idEtapa, dataHoraPrevistaSaida) {
    return this.baseRepositorio.getModel().updateOne(
      {
        'etapas._id': mongoose.Types.ObjectId(idEtapa),
      },
      {
        $set:
          { 'etapas.$.poligono.dataHoraPrevistaSaida': dataHoraPrevistaSaida },
      })
  }

  async alterarEtapaTempoDentroDoPoligono(idEtapa, tempoDentroDoPoligono) {
    return this.baseRepositorio.getModel().updateOne(
      {
        'etapas._id': mongoose.Types.ObjectId(idEtapa),
      },
      {
        $set:
          { 'etapas.$.poligono.tempoDentroDoPoligono': tempoDentroDoPoligono }
      })
  }

  async alterarEtapaConcluido(idEtapa) {
    return this.baseRepositorio.getModel().updateOne(
      {
        'etapas._id': mongoose.Types.ObjectId(idEtapa),
      },
      {
        $set:
          { 'etapas.$.concluido': true },
      })
  }

  async alterarEtapaAtraso(idEtapa, atraso) {
    return this.baseRepositorio.getModel().updateOne(
      {
        'etapas._id': mongoose.Types.ObjectId(idEtapa),
      },
      {
        $set:
          { 'etapas.$.atraso': atraso },
      })
  }

  async excluir(numeroPedido) {
    return this.baseRepositorio.excluirVarios({ numeroPedido })
  }

  async excluirMapa(numeroPedido, codigoFilial) {
    return this.baseRepositorio.excluirVarios({ numeroPedido, codigoFilial })
  }

  // async marcarEtapaConcluida(id, body) {
  //   const mapaSinotico = new MapaSinotico(id, body);

  //   return this._base.marcarEtapaConcluida(mapaSinotico);
  // }
}
