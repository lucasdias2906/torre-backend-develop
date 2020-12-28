import urlHub from '../configuracao/hub'
import baseServico from './base/baseServico'

async function listarViagens() {
  const vRetorno = (await baseServico.hubListar(`${urlHub.monitoramento}/listarViagens`, { query: {} })).dados
  return vRetorno
}

async function listarViagensMapaSinotico() {
  const vRetorno = (await baseServico.hubListar(`${urlHub.mapaSinotico}/listarViagens`, { query: {} })).dados
  return vRetorno
}

async function listarMotoristas() {
  return baseServico.hubListar(`${urlHub.monitoramento}/listarMotoristas`, { query: {} })
}

async function listarMotoristaSemAlocacaoPorTempo() {
  return baseServico.hubListar(`${urlHub.monitoramento}/listarMotoristaSemAlocacaoPorTempo`, { query: {} })
}

async function listarMotoristasFerias() {
  return baseServico.hubListar(`${urlHub.monitoramento}/listarMotoristaFerias`, { query: {} })
}

async function listarVeiculos() {
  return baseServico.hubListar(`${urlHub.monitoramento}/listarVeiculos`, { query: {} })
}

const functions = {
  listarViagens: () => listarViagens(),
  listarViagensMapaSinotico: () => listarViagensMapaSinotico(),
  listarVeiculos: () => listarVeiculos(),
  listarMotoristas: () => listarMotoristas(),
  listarMotoristaSemAlocacaoPorTempo: () => listarMotoristaSemAlocacaoPorTempo(),
  listarMotoristasFerias: () => listarMotoristasFerias(),
}

export default functions
