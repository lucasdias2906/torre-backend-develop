import Util from '../funcoes/utilitarios'
import TipoOcorrenciaRepositorio from '../repositorios/tipoOcorrenciaRepositorio'
import BaseErro from './base/baseErro'


async function obter(pId) {
  const repositorio = new TipoOcorrenciaRepositorio()
  const i = repositorio.obter(pId)
  return i
}

async function obterPorCodigo(pCodigo) {
  return usuarioRepositorio.obterPorCodigo(pCodigo)
}

async function listar(req) {
  const pParams = req.query

  let vFiltro = {}

  if(pParams.nome ) {
    if(pParams.status){
        vFiltro = {
            nome:{ $regex: '.*' + pParams.nome + '.*', $options: 'i' },
             ativo: pParams.status === 'A' ? true : false
      };
    } else {
      vFiltro = {
        nome:{ $regex: '.*' + pParams.nome + '.*', $options: 'i' }
      };
    }
  } else if(pParams.status){
        vFiltro = {
           ativo: pParams.status === 'A' ? true : false
      };
    }

  if (pParams.ativo) {
    if (pParams.disparo) {
      if (pParams.origem) {
        vFiltro = {
          $and: [
            { ativo: pParams.ativo },
            { origem: pParams.origem },
            { $or: [{ disparo: pParams.disparo }, { disparo: 'AMBAS' }] },
          ],
        }
      } else {
        vFiltro = {
          $and: [
            { ativo: pParams.ativo },
            { $or: [{ disparo: pParams.disparo }, { disparo: 'AMBAS' }] },
          ],
        }
      }
    } else {
      if (pParams.origem) {
        vFiltro = {
          $and: [
            { ativo: pParams.ativo },
            { origem: pParams.origem }
          ]
        };
      } else {
        vFiltro = {
          ativo: pParams.ativo
        };
      }
    }
  }

  const repositorio = new TipoOcorrenciaRepositorio();
  return repositorio.listar(pParams, vFiltro);
}

async function incluir(req) {
  const { body } = req;
  const repositorio = new TipoOcorrenciaRepositorio();

  const vCodigoTipoOcorrencia = await Util.obterSequencia('codigoTipoOcorrencia')
  body.codigo = vCodigoTipoOcorrencia

  return repositorio.incluir(body)
}

async function alterar(pId, body) {
  const vFiltro = { _id: pId }
  const repositorio = new TipoOcorrenciaRepositorio()

  const vTipoOcorrencia = await repositorio.alterar(vFiltro, body)
  return vTipoOcorrencia
}

async function excluir(pId) {
  const repositorio = new TipoOcorrenciaRepositorio()
  return repositorio.excluir(pId)
}

async function alterarStatus(pId, req) {
  const { body } = req

  const vFiltro = { _id: pId }
  const repositorio = new TipoOcorrenciaRepositorio()

  const vRegistro = await repositorio.listar({}, vFiltro)

  if (vRegistro.totalRegistros > 0) {
    return repositorio.alterar(
      vFiltro,
      body.ativo === true ? { ativo: true } : { ativo: false }
    )
  } else throw new BaseErro(400, "TipoOcorrenciaNaoEncontrado");
}

const functions = {
  obter: (pId, req) => obter(pId, req),
  obterPorCodigo: (req) => obterPorCodigo(req),
  listar: (req) => listar(req),
  incluir: (req) => incluir(req),
  alterar: (pId, body) => alterar(pId, body),
  excluir: (pId) => excluir(pId),
  alterarStatus: (pId, req) => alterarStatus(pId, req),
}

export default functions
