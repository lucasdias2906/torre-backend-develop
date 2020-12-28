import urlHub from '../configuracao/hub'
import baseServico from './base/baseServico'
import BaseErro from './base/baseErro'
import util from '../funcoes/utilitarios'
import enums from './../modelos/_enums'
import _veiculoClassificacaoRepositorio from '../repositorios/veiculoClassificacaoRepositorio'
import rastreadorServico from './../servicos/rastreadorServico'
import parametroGeralServico from './parametroGeralServico'

const veiculoClassificacaoRepositorio = new _veiculoClassificacaoRepositorio()

async function listarVeiculo(req) {
  let classificacao = [];

  if (!util.dataValida(req.query.periodoViagemInicial)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Inicial'])
  if (!util.dataValida(req.query.periodoViagemFinal)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Final'])
  if (!req.query.tracionador) req.query.tracionador = "T"

  let veiculoClassificacao = await veiculoClassificacaoRepositorio.listar({}, { usaCombustivel: true, ativo: true })
  veiculoClassificacao.dados.map((elem) => { classificacao.push(elem.codigoClassificacao) })
  req.query.classificacao = classificacao;

  const vUrl = `${urlHub.disponibilidade}/veiculo`
  const { resumo, totalRegistros, totalRegistrosPagina, dados } = await baseServico.hubListar(vUrl, req.query)

  let aux = [,]
  dados.map((elem, index) => {
    elem.placa !== undefined && elem.placa !== null ? aux.splice(index, 1, [elem.placa, elem.tracionador]) : ''
    elem.placa2 !== undefined && elem.placa2 !== null ? aux.splice(index, 1, [elem.placa2, elem.tracionador]) : ''
    elem.placa3 !== undefined && elem.placa3 !== null ? aux.splice(index, 1, [elem.placa3, elem.tracionador]) : ''
    elem.placa4 !== undefined && elem.placa3 !== null ? aux.splice(index, 1, [elem.placa4, elem.tracionador]) : ''
  });

  let vFiltro = { "codigo": { $in: ['PRAZO_VERIFICACAO_CAVALO', 'PRAZO_VERIFICACAO_CARRETA'] } }
  const vListaParametrosGeral = (await parametroGeralServico.listar(vFiltro)).dados

  const vlrCavalo = obterParametro(vListaParametrosGeral, enums.PARAMETROS.PRAZO_VERIFICACAO_CAVALO)
  const vlrCarreta = obterParametro(vListaParametrosGeral, enums.PARAMETROS.PRAZO_VERIFICACAO_CARRETA)

  let placas = []
  let horas = []

  aux.map((item, index) => {
    if (item[index, 1] == 'S') {
      placas.push(item[index, 0])
      horas.push(vlrCavalo)
    }
    else {
      placas.push(item[index, 0])
      horas.push(vlrCarreta)
    }
  }, 0)

  let rastreadores = await rastreadorServico.listarDisponiveis(req, [...placas], [...horas])

  let result = dados.map(elem => {

    return {
      numeroLinha: elem.numeroLinha,
      codigoVeiculo: elem.codigoVeiculo,
      placa: elem.placa,
      codigoVeiculo2: elem.codigoVeiculo2,
      placa2: elem.placa2,
      codigoVeiculo3: elem.codigoVeiculo3,
      placa3: elem.placa3,
      codigoVeiculo4: elem.codigoVeiculo4,
      placa4: elem.placa4,
      filialPreferencial: elem.filialPreferencial,
      identificacaoPlacaVeiculo: elem.identificacaoPlacaVeiculo,
      codigoTipoVeiculo: elem.codigoTipoVeiculo,
      descricaoTipoVeiculo: elem.descricaoTipoVeiculo,
      tracionador: elem.tracionador,
      codigoClassificacaoVeiculo: elem.codigoClassificacaoVeiculo,
      descricaoClassificaoVeiculo: elem.descricaoClassificaoVeiculo,
      codigoMotoristaPreferencial: elem.codigoMotoristaPreferencial,
      nomeMotoristaPreferencial: elem.nomeMotoristaPreferencial,
      identificacaoVeiculoProprio: elem.identificacaoVeiculoProprio,
      codigoProprietario: elem.codigoProprietario,
      nomeProprietario: elem.nomeProprietario,
      destinoUltimoManifesto: elem.destinoUltimoManifesto,
      descricaoSituacaoVeiculo: elem.descricaoSituacaoVeiculo,
      regras: {
        VerificaProgramacaoCargaOK: elem.regras.VerificaProgramacaoCargaOK,
        VerificaProgramacaoVeiculoOK: elem.regras.VerificaProgramacaoVeiculoOK,
        VerificaAdvertenciaOK: elem.regras.VerificaAdvertenciaOK,
        VerificaOrdermServicoOK: elem.regras.VerificaOrdermServicoOK,
        VerificaManifestoOK: elem.regras.VerificaManifestoOK,
        VerificaPlacaOK:  rastreadores.find(e => e == elem.placa) !== undefined ? 1 : 0,
        VerificaPlaca2OK: rastreadores.find(e => e == elem.placa2) !== undefined ? 1 : 0,  //1 rastreador com comunicação 0 rastreador sem comunicação  
      }
    }
  })

  return { resumo, totalRegistros, totalRegistrosPagina, dados: [...result] }
}

async function listarVeiculoQuantidade(req) {
  let classificacao = [];

  if (!util.dataValida(req.query.periodoViagemInicial)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Inicial'])
  if (!util.dataValida(req.query.periodoViagemFinal)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Final'])
  if (!req.query.tracionador) req.query.tracionador = "T"

  let veiculoClassificacao = await veiculoClassificacaoRepositorio.listar({}, { usaCombustivel: true, ativo: true })
  veiculoClassificacao.dados.map((elem) => { classificacao.push(elem.codigoClassificacao) })
  req.query.classificacao = classificacao;

  const vUrl = `${urlHub.disponibilidade}/veiculo-quantidade`
  return baseServico.hubListar(vUrl, req.query)
}

async function listarMotorista(req) {
  if (!req.query.periodoViagemInicial) throw new BaseErro(400, 'genericoCampoObrigatorio', ['periodoViagemInicial'])
  if (!req.query.periodoViagemFinal) throw new BaseErro(400, 'genericoCampoObrigatorio', ['periodoViagemFinal'])
  if (!util.dataValida(req.query.periodoViagemInicial)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Inicial'])
  if (!util.dataValida(req.query.periodoViagemFinal)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Final'])
  if (req.query.situacao !== 'T' && req.query.situacao !== 'D') throw new BaseErro(400, 'disponibilidadeFiltroSituacaoInvalida')

  if (!req.query.categoriaCNH) req.query.categoriaCNH = ''

  const vUrl = `${urlHub.disponibilidade}/motorista`
  return baseServico.hubListar(vUrl, req.query)
}

async function listarMotoristaQuantidade(req) {
  if (!req.query.periodoViagemInicial) throw new BaseErro(400, 'genericoCampoObrigatorio', ['periodoViagemInicial'])
  if (!req.query.periodoViagemFinal) throw new BaseErro(400, 'genericoCampoObrigatorio', ['periodoViagemFinal'])
  if (!util.dataValida(req.query.periodoViagemInicial)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Inicial'])
  if (!util.dataValida(req.query.periodoViagemFinal)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Final'])
  if (req.query.situacao !== 'T' && req.query.situacao !== 'D') throw new BaseErro(400, 'disponibilidadeFiltroSituacaoInvalida')

  if (!req.query.categoriaCNH) req.query.categoriaCNH = ''

  const vUrl = `${urlHub.disponibilidade}/motorista-quantidade`
  return baseServico.hubListar(vUrl, req.query)
}

async function validarMotorista(pCodigoMotorista, req) {

  req.query.codigoMotorista = pCodigoMotorista
  if (!req.query.codigoMotorista) throw new BaseErro(400, 'genericoCampoObrigatorio', ['periodoViagemInicial'])
  if (!req.query.periodoViagemInicial) throw new BaseErro(400, 'genericoCampoObrigatorio', ['periodoViagemInicial'])
  if (!req.query.periodoViagemFinal) throw new BaseErro(400, 'genericoCampoObrigatorio', ['periodoViagemFinal'])
  if (!util.dataValida(req.query.periodoViagemInicial)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Inicial'])
  if (!util.dataValida(req.query.periodoViagemFinal)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Final'])
  req.query.categoriaCNH = 'A'
  req.query.situacao = 'D'

  const vUrl = `${urlHub.disponibilidade}/motorista`
  const { dados } = await baseServico.hubListar(vUrl, req.query)

  if (dados.length > 0) {
    let aux = true;
    dados.map((elem) => {
      if (elem.regras.VerificaSituacaoOK === 0) aux = false
      if (elem.regras.VerificaVigenciaCNHOK === 0) aux = false
      if (elem.regras.VerificaCategoriaCNHOK === 0) aux = false
      if (elem.regras.VerificaAdvertenciasOK === 0) aux = false
      if (elem.regras.VerificaManifestoOK === 0) aux = false
      if (elem.regras.VerificaProgramacaoOK === 0) aux = false
    })

    return { disponivel: aux }
  }

  return { disponivel: false }
}

async function validarVeiculo(pPlaca, req) {
  let classificacao = [];

  req.query.placa = pPlaca
  if (!req.query.placa) throw new BaseErro(400, 'genericoCampoObrigatorio', ['veiculoOcorrenciaNaoInformado'])
  if (!req.query.periodoViagemInicial) throw new BaseErro(400, 'genericoCampoObrigatorio', ['periodoViagemInicial'])
  if (!req.query.periodoViagemFinal) throw new BaseErro(400, 'genericoCampoObrigatorio', ['periodoViagemFinal'])
  if (!util.dataValida(req.query.periodoViagemInicial)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Inicial'])
  if (!util.dataValida(req.query.periodoViagemFinal)) throw new BaseErro(400, 'genericoDataInformadaInvalida', ['Período Viagem Final'])
  if (!req.query.tracionador) req.query.tracionador = "T"

  let veiculoClassificacao = await veiculoClassificacaoRepositorio.listar({}, { usaCombustivel: true, ativo: true })
  veiculoClassificacao.dados.map((elem) => { classificacao.push(elem.codigoClassificacao) })
  req.query.classificacao = classificacao;

  const vUrl = `${urlHub.disponibilidade}/veiculo`
  const { dados } = await baseServico.hubListar(vUrl, req.query)

  let aux = [,]
  dados.map((elem, index) => {
    elem.placa !== undefined && elem.placa !== null ? aux.splice(index, 1, [elem.placa, elem.tracionador]) : ''
  });

  let vFiltro = { "codigo": { $in: ['PRAZO_VERIFICACAO_CAVALO', 'PRAZO_VERIFICACAO_CARRETA'] } }
  const vListaParametrosGeral = (await parametroGeralServico.listar(vFiltro)).dados

  const vlrCavalo = obterParametro(vListaParametrosGeral, enums.PARAMETROS.PRAZO_VERIFICACAO_CAVALO)
  const vlrCarreta = obterParametro(vListaParametrosGeral, enums.PARAMETROS.PRAZO_VERIFICACAO_CARRETA)

  let placas = []
  let horas = []

  aux.map((item, index) => {
    if (item[index, 1] == 'S') {
      placas.push(item[index, 0])
      horas.push(vlrCavalo)
    }
    else {
      placas.push(item[index, 0])
      horas.push(vlrCarreta)
    }
  }, 0)

  let rastreadores = await rastreadorServico.listarDisponiveis(req, [...placas], [...horas])

  if (dados.length > 0) {
    let aux = true;
    dados.map((elem) => {
      if (elem.regras.VerificaProgramacaoCargaOK === 0) aux = false
      if (elem.regras.VerificaProgramacaoVeiculoOK === 0) aux = false
      if (elem.regras.VerificaAdvertenciaOK === 0) aux = false
      if (elem.regras.VerificaOrdermServicoOK === 0) aux = false
      if (elem.regras.VerificaManifestoOK === 0) aux = false
      rastreadores.find(e => e == elem.placa) !== undefined ? aux : false //true rastreador com comunicação  false rastreador sem comunicação  
    })

    return { disponivel: aux }
  }

  return { disponivel: false }
}

function obterParametro(pParametros, pParametroNome) {
  const vRetorno = pParametros.filter((item) => item.codigo === pParametroNome)
  if (vRetorno.length > 0) return vRetorno[0].valor
  return null
}

const functions = {
  listarVeiculo: (req) => listarVeiculo(req),
  listarVeiculoQuantidade: (req) => listarVeiculoQuantidade(req),
  listarMotorista: (req) => listarMotorista(req),
  listarMotoristaQuantidade: (req) => listarMotoristaQuantidade(req),
  validarMotorista: (pCodigoMotorista, req) => validarMotorista(pCodigoMotorista, req),
  validarVeiculo: (pPlaca, req) => validarVeiculo(pPlaca, req)
}

export default functions
