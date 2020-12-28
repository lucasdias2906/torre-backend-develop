import BaseErro from './base/baseErro'
import parametrosGeralServico from './parametroGeralServico'
import RastreadorRepositorio from '../repositorios/rastreadorRepositorio'
import moment from 'moment'

const soap = require('soap')

async function listarWS(placa, id) {
  let soapBody = ''

  const rastreadorWSUrl = await parametrosGeralServico.obterPorCodigo('rastreador', 'WS_RASTREADOR_URL')
  const rastreadorWSMethod = await parametrosGeralServico.obterPorCodigo('rastreador', 'WS_RASTREADOR_METHOD')
  const rastreadorWSUser = await parametrosGeralServico.obterPorCodigo('rastreador', 'WS_RASTREADOR_USER')
  const rastreadorWSPassword = await parametrosGeralServico.obterPorCodigo('rastreador', 'WS_RASTREADOR_PASSWORD')

  const url = `${rastreadorWSUrl}?wsdl`
  const method = rastreadorWSMethod

  const client = await soap.createClientAsync(url)

  const soapHeader = {
    'tns:ValidationSoapHeader': {
      'tns:userCod': rastreadorWSUser || '',
      'tns:userPwd': rastreadorWSPassword || '',
      'tns:homologacao': false,
    },
  }

  client.setEndpoint(rastreadorWSUrl)
  client.addSoapHeader(soapHeader)

  if (placa) {
    soapBody = {
      'tns:placas': {
        'tns:string': placa,
      },
      'tns:id': id || 0,
    }
  } else {
    soapBody = {
      'tns:placas': {
      },
      'tns:id': id || 0,
    }
  }

  client.addBodyAttribute('xmlns:tns="http://www.angellira.com.br/"')

  let dados = null
  try {
    dados = await client[`${method}Async`](soapBody).then((r) => r[0])
  }
  catch (err) {
  }
  
  if (!dados) return null
  
  const { GetPosicaoVeiculoResult } = dados

  return GetPosicaoVeiculoResult ? GetPosicaoVeiculoResult.Posicao : null
}

async function listar(req) {
  if (!req.query.placa) throw new BaseErro(400, 'rasteradorPlacaNaoInformada')

  let rastreador = null
  // para simulação do rastreador
  // const mongoose = require('mongoose')
  // const rastreadorFakeGPS = await mongoose.connection.db.collection('_torreFakeGPS').findOne({ PLACA: req.query.placa })
  // if (rastreadorFakeGPS) rastreador = [rastreadorFakeGPS]
  // fim simulação

  if (!rastreador) rastreador = await listarWS(req.query.placa)

  if (!rastreador) return null

  const [result] = rastreador.map((elem) => ({
    dataHora: elem.DATAHORA,
    descricao: elem.DESCRICAO,
    idMenssagem: elem.IDMENSAGEM,
    idRastreador: elem.IDRASTREADOR,
    latitude: elem.LATITUDE,
    longitude: elem.LONGITUDE,
    placa: elem.PLACA,
    ignicao: elem.IGNICAO,
    velocidade: elem.VELOCIDADE,
  }), 0)

  return result
}

async function listarDisponiveis(req, placas, horas) {

  req.query.placa = [...placas]

  let dados = await Promise.all([
    listarWS([...placas])
  ]).then(r => r[0])

  if (!dados) return []

  return [...new Set(dados.map((elem, index) => {
    return validarRastreadores(elem.PLACA, elem.DATAHORA, horas[index])
  }, 0))]
}

function validarRastreadores(placa, dataHora, horas) {

  const dataHoraUltimaComunicao = dataHora && moment(dataHora)
  const dataLimiteRastreadorSemComunicacao = moment(new Date()).subtract(horas, 'hours')

  if (dataHoraUltimaComunicao > dataLimiteRastreadorSemComunicacao)
    return placa
}

async function incluir(req) {
  const repositorio = new RastreadorRepositorio()
  const result = await listar(req)
  if (result) return repositorio.incluir(result)
  return null
  // || { idRastreador: req.query.placa }
}

const functions = {
  listar: (req) => listar(req),
  listarDisponiveis: (req, placas, horas) => listarDisponiveis(req, placas, horas),
  incluir: (req) => incluir(req),
}

export default functions
