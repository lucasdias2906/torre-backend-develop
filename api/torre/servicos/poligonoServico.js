import BaseErro from './base/baseErro'
import PoligonoRepositorio from '../repositorios/poligonoRepositorio'
import PoligonoTipoRepositorio from '../repositorios/poligonoTipoRepositorio'
import ParceiroServico from './parceiroServico'
import Util from '../funcoes/utilitarios'

const TIPO_POLIGONO_MONITORAMENTO = {
  COLETA: 9,
  ENTREGA: 9,
}

async function obter (pId, req) {
  let parceiro
  const repositorio = new PoligonoRepositorio()
  const { dados } = await repositorio.obter(pId)

  const repositorioTipo = new PoligonoTipoRepositorio()
  const PoligonoTipo = await repositorioTipo.obter(dados.tipoPoligonoId)

  if (dados.hubParceiroId) {
    req.query.parceiros = dados.hubParceiroId
    const resultado = await ParceiroServico.listar(req)
    parceiro = resultado.dados.filter((par) => { if (par.codigoParceiroComercial === dados.hubParceiroId) return par })
  }

  return {
    _id: dados._id,
    codigoPoligono: dados.codigoPoligono,
    hubParceiroId: dados.hubParceiroId,
    parceiro: parceiro ? parceiro[0].nomeRazaoSocial : '',
    ativo: dados.ativo,
    descricao: dados.descricao,
    tipoPoligono: {
      _id: PoligonoTipo.dados ? PoligonoTipo.dados._id : null,
      descricao: PoligonoTipo.dados ? PoligonoTipo.dados.descricao : null
    },
    pontos: dados.pontos,
    log: dados.log
  }
}

async function obterPoligonoColeta (pCodigoParceiro) {
  const tipoPoligono = await new PoligonoTipoRepositorio().obterPorCodigo(TIPO_POLIGONO_MONITORAMENTO.COLETA)
  return new PoligonoRepositorio().obterPorTipoAndParceiro(pCodigoParceiro, tipoPoligono.dados._id)
}

async function obterPoligonoEntrega (pCodigoParceiro) {
  const tipoPoligono = await new PoligonoTipoRepositorio().obterPorCodigo(TIPO_POLIGONO_MONITORAMENTO.ENTREGA)
  return new PoligonoRepositorio().obterPorTipoAndParceiro(pCodigoParceiro, tipoPoligono.dados._id)
}

async function listar (req) {
  const pParams = req.query
  const repositorio = new PoligonoRepositorio()
  const parceirosID = []
  let result = []

  let vFiltro = {}

  if (pParams.codigoPoligono) {
    if (pParams.descricao) {
      vFiltro = {
        codigoPoligono: pParams.codigoPoligono,
        descricao: { $regex: '.*' + pParams.descricao + '.*', $options: 'i' }
      }
      if (pParams.tipoPoligonoId) {
        vFiltro = {
          codigoPoligono: pParams.codigoPoligono,
          descricao: { $regex: '.*' + pParams.descricao + '.*', $options: 'i' },
          tipoPoligonoId: pParams.tipoPoligonoId
        }
        if (pParams.hubParceiroId) {
          vFiltro = {
            codigoPoligono: pParams.codigoPoligono,
            descricao: { $regex: '.*' + pParams.descricao + '.*', $options: 'i' },
            tipoPoligonoId: pParams.tipoPoligonoId,
            hubParceiroId: pParams.hubParceiroId
          }
        }
      }
    }
    vFiltro = { codigoPoligono: pParams.codigoPoligono }
  } else if (pParams.descricao) {
    if (pParams.tipoPoligonoId) {
      vFiltro = {
        descricao: { $regex: '.*' + pParams.descricao + '.*', $options: 'i' },
        tipoPoligonoId: pParams.tipoPoligonoId
      }
      if (pParams.hubParceiroId) {
        vFiltro = {
          descricao: { $regex: '.*' + pParams.descricao + '.*', $options: 'i' },
          tipoPoligonoId: pParams.tipoPoligonoId,
          hubParceiroId: pParams.hubParceiroId
        }
      }
    }
    vFiltro = {
      descricao: { $regex: '.*' + pParams.descricao + '.*', $options: 'i' }
    }
  } else if (pParams.tipoPoligonoId) {
    if (pParams.hubParceiroId) {
      vFiltro = {
        tipoPoligonoId: pParams.tipoPoligonoId,
        hubParceiroId: pParams.hubParceiroId
      }
    }
    vFiltro = { tipoPoligonoId: pParams.tipoPoligonoId }
  } else if (pParams.hubParceiroId) {
    vFiltro = { hubParceiroId: pParams.hubParceiroId }
  }

  pParams.populate = 'tipoPoligonoId'

  const poligono = await repositorio.listar(pParams, vFiltro)
  const { totalRegistros, totalRegistrosPagina, dados } = poligono

  dados.map((elem) => {
    if (elem.hubParceiroId) {
      parceirosID.push(elem.hubParceiroId)
    }
  }, 0)

  if (parceirosID.length > 0) {
    req.query.parceiros = parceirosID
    const parceiro = await ParceiroServico.listar(req)

    result = dados.map((elem) => {
      const [vParceiro] = parceiro.dados.filter((par) => { if (par.codigoParceiroComercial === elem.hubParceiroId) return par })

      return {
        _id: elem._id,
        codigoPoligono: elem.codigoPoligono,
        hubParceiroId: elem.hubParceiroId,
        parceiro: vParceiro ? vParceiro.nomeRazaoSocial : '',
        ativo: elem.ativo,
        descricao: elem.descricao,
        tipoPoligono: {
          _id: elem.tipoPoligonoId ? elem.tipoPoligonoId._id : null,
          descricao: elem.tipoPoligonoId ? elem.tipoPoligonoId.descricao : null
        },
        log: elem.log
      }
    }, 0)
  } else {
    result = dados.map((elem) => {
      return {
        _id: elem._id,
        codigoPoligono: elem.codigoPoligono,
        hubParceiroId: elem.hubParceiroId,
        parceiro: '',
        ativo: elem.ativo,
        descricao: elem.descricao,
        tipoPoligono: {
          _id: elem.tipoPoligonoId ? elem.tipoPoligonoId._id : null,
          descricao: elem.tipoPoligonoId ? elem.tipoPoligonoId.descricao : null
        },
        log: elem.log,
      }
    }, 0)
  }

  return {
    totalRegistros,
    totalRegistrosPagina,
    dados: result,
  }
}

async function listarPontos (req) {
  const vCodigoPoligono = req.params.pCodigoPoligono
  const vFiltro = { codigoPoligono: Number(vCodigoPoligono) }

  const repositorio = new PoligonoRepositorio()
  const [poligono] = await repositorio.listarPontos(vFiltro)

  if (poligono) {
    const { pontos } = poligono

    return {
      totalRegistros: pontos.length,
      totalRegistrosPagina: pontos.length,
      dados: pontos,
    }
  }

  return {
    totalRegistros: 0,
    totalRegistrosPagina: 0,
    dados: []
  }
}

async function incluir (req) {
  const { body } = req
  const repositorio = new PoligonoRepositorio()

  await verificarPoligono(repositorio, body)

  const vcodigoPoligono = await Util.obterSequencia('codigoPoligono')
  body.codigoPoligono = vcodigoPoligono

  return repositorio.incluir(body)
}

async function alterar (pId, body) {
  const vFiltro = { _id: pId }
  const repositorio = new PoligonoRepositorio()

  await verificarPoligono(repositorio, body)

  return await repositorio.alterar(vFiltro, body)
}

async function excluir (pId) {
  const repositorio = new PoligonoRepositorio()
  return repositorio.excluir(pId)
}

async function alterarStatus (pId, req) {
  const vFiltro = { _id: pId }
  const repositorio = new PoligonoRepositorio()

  const poligono = await repositorio.obter(pId)
  const { dados } = poligono

  if (dados) {
    return repositorio.alterar(vFiltro, dados.ativo === true ? { ativo: false } : { ativo: true })
  } else {
    throw new BaseErro(400, 'PoligonoNaoEncontrado')
  }
}

async function verificarPoligono (repositorio, body) {
  // const vRegistro = await repositorio.listar({}, { descricao: body.descricao, tipoPoligonoId: body.tipoPoligonoId, hubParceiroId: body.hubParceiroId });
  // if (vRegistro.totalRegistros > 0) throw new BaseErro(400, "PoligonoJaCadastrado", [body.descricao]);
  if (!Array.isArray(body.pontos)) throw new BaseErro(400, 'PoligonoPontosNaoInformado')
  if (!(body.pontos.length >= 3 && body.pontos.length <= 12)) throw new BaseErro(400, 'PoligonoPontosForaPadrao')
}

const functions = {
  obter: (pId, req) => obter(pId, req),
  obterPoligonoColeta: (pCodigoParceiro) => obterPoligonoColeta(pCodigoParceiro),
  obterPoligonoEntrega: (pCodigoParceiro) => obterPoligonoEntrega(pCodigoParceiro),
  listar: (req) => listar(req),
  listarPontos: (req) => listarPontos(req),
  incluir: (req) => incluir(req),
  alterar: (pId, body) => alterar(pId, body),
  excluir: (pId) => excluir(pId),
  alterarStatus: (pId, req) => alterarStatus(pId, req),
}

export default functions
