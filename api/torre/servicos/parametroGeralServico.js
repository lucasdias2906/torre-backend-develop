import enums from '../modelos/_enums'
import ParametroGeralRepositorio from '../repositorios/parametroGeralRepositorio'
import BaseErro from './base/baseErro'

const parametroGeralRepositorio = new ParametroGeralRepositorio()

async function obter (pId) {
  const parametro = await parametroGeralRepositorio.obter(pId)
  return parametro
}

async function obterPorCodigo (pGrupo, pCodigo) {
  const parametro = await parametroGeralRepositorio.obterPorCodigo(pGrupo, pCodigo)
  return parametro
}

async function obterTempoPadraoCarregamento () {
  const parametro = (await parametroGeralRepositorio.obterPorCodigo(enums.PARAMETROS_GRUPO.MONITORAMENTO, enums.PARAMETROS.TEMPO_PADRAO_CARREGAMENTO)).dados.valor
  return parametro
}

async function obterTempoPadraoDescarga () {
  const parametro = (await parametroGeralRepositorio.obterPorCodigo(enums.PARAMETROS_GRUPO.MONITORAMENTO, enums.PARAMETROS.TEMPO_PADRAO_DESCARGA)).dados.valor
  return parametro
}

async function obterPrazoVerificacaoAlocacaoVeiculo () {
  const parametro = (await parametroGeralRepositorio.obterPorCodigo(enums.PARAMETROS_GRUPO.MONITORAMENTO, enums.PARAMETROS.PRAZO_VERIFICACAO_ALOCACAO_VEICULO)).dados.valor
  return parametro
}

async function obterPrazoLimiteAlocacaoVeiculo () {
  const parametro = (await parametroGeralRepositorio.obterPorCodigo(enums.PARAMETROS_GRUPO.MONITORAMENTO, enums.PARAMETROS.PRAZO_LIMITE_ALOCACAO_VEICULO)).dados.valor
  return parametro
}

async function obterPrazoLimiteSemComunicacaoCavalo () {
  const parametro = (await parametroGeralRepositorio.obterPorCodigo(enums.PARAMETROS_GRUPO.MONITORAMENTO, enums.PARAMETROS.PRAZO_VERIFICACAO_CAVALO)).dados.valor
  return parametro
}

async function obterPrazoLimiteSemComunicacaoCarreta () {
  const parametro = (await parametroGeralRepositorio.obterPorCodigo(enums.PARAMETROS_GRUPO.MONITORAMENTO, enums.PARAMETROS.PRAZO_VERIFICACAO_CARRETA)).dados.valor
  return parametro
}

async function obterEmailsAdministrativos () {
  const parametro = (await parametroGeralRepositorio.obterPorCodigo(enums.PARAMETROS_GRUPO.MONITORAMENTO, enums.PARAMETROS.EMAILS_ADMINISTRATIVOS_TORRE)).dados.valor
  return parametro
}

async function obterHorarioInicioMonitoramento () {
  const parametro = (await parametroGeralRepositorio.obterPorCodigo(enums.PARAMETROS_GRUPO.MONITORAMENTO, enums.PARAMETROS.HORARIO_INICIO_MONITORAMENTO)).dados.valor
  return parametro
}

async function obterHorarioTerminoMonitoramento () {
  const parametro = (await parametroGeralRepositorio.obterPorCodigo(enums.PARAMETROS_GRUPO.MONITORAMENTO, enums.PARAMETROS.HORARIO_TERMINO_MONITORAMENTO)).dados.valor
  return parametro
}

async function obterItemMonitoramentoRastreador () {
  const parametro = (await parametroGeralRepositorio.obterPorCodigo(enums.PARAMETROS_GRUPO.MONITORAMENTO, enums.PARAMETROS.ITEM_MONITORAMENTO_RASTREADOR)).dados.valor
  return parametro
}

async function listar (filtro) {
  return parametroGeralRepositorio.listar(filtro)
}

async function alterar (pId, body) {
  const vFiltro = { _id: pId }
  const parametro = await parametroGeralRepositorio.alterar(vFiltro, body)
  return parametro
}

const functions = {
  obter: (pId) => {
    return obter(pId)
  },
  obterPorCodigo: async (pGrupo, pCodigo) => {
    const vRetorno = (await obterPorCodigo(pGrupo, pCodigo)).dados

    if (vRetorno === null) throw new BaseErro(400, 'parametroGeralNaonEncontrado', [pGrupo, pCodigo])

    let vValor

    if (vRetorno.tipo === 'INTEIRO') vValor = parseInt(vRetorno.valor, 0)
    else vValor = vRetorno.valor
    return vValor
  },
  obterTempoPadraoCarregamento: () => {
    return obterTempoPadraoCarregamento()
  },
  obterTempoPadraoDescarga: () => {
    return obterTempoPadraoDescarga()
  },
  obterPrazoVerificacaoAlocacaoVeiculo: () => {
    return obterPrazoVerificacaoAlocacaoVeiculo()
  },
  obterPrazoLimiteAlocacaoVeiculo: () => {
    return obterPrazoLimiteAlocacaoVeiculo()
  },
  obterPrazoLimiteSemComunicacaoCavalo: () => {
    return obterPrazoLimiteSemComunicacaoCavalo()
  },
  obterPrazoLimiteSemComunicacaoCarreta: () => {
    return obterPrazoLimiteSemComunicacaoCarreta()
  },
  obterEmailsAdministrativos: () => {
    return obterEmailsAdministrativos()
  },
  obterHorarioInicioMonitoramento: () => {
    return obterHorarioInicioMonitoramento()
  },
  obterHorarioTerminoMonitoramento: () => {
    return obterHorarioTerminoMonitoramento()
  },
  obterItemMonitoramentoRastreador: () => {
    return obterItemMonitoramentoRastreador()
  },
  listar: (filtro) => {
    return listar(filtro)
  },
  alterar: (pId, body) => {
    return alterar(pId, body)
  }
}

export default functions
