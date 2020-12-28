import axios from 'axios'
import BaseErro from './baseErro'

async function hubListar(pUrl, pParams = {}) {
  try {
    pParams.permissaoFiliais = global.usuarioLogin ? global.usuarioLogin.filiais : [-1]
    const vRetorno = await axios.get(pUrl, { params: pParams })
    return vRetorno.data
  } catch (e) {
    let vMessage = `Erro ao acessar hub: ${pUrl}`

    if (e.response) {
      vMessage += ` ${e.response.status} ${e.response.statusText}`
    }

    if (e.response && e.response.data) {
      vMessage += ` ${e.response.data.mensagem}`
    } else {
      vMessage = ` ${e.errno} ${e.code} ${e.address}`
    }
    throw new BaseErro(500, vMessage, '')
  }
}

async function hubObter(pUrl, pCodigo, pReq) {
  try {
    const vParams = {}
    vParams.permissaoFiliais = global.usuarioLogin ? global.usuarioLogin.filiais : [-1]
    const vRetorno = await axios.get(`${pUrl}/${pCodigo}`, { params: vParams }, pReq)
    return vRetorno.data
  } catch (e) {
    let vMessage = `Erro ao acessar hub: ${pUrl}`

    if (e.response) {
      vMessage += ` ${e.response.status} ${e.response.statusText}`
    }
    if (e.response && e.response.data) {
      vMessage += ` ${e.response.data.mensagem}`
    } else {
      vMessage = ` ${e.errno} ${e.code} ${e.address} || ''`
    }
    throw new BaseErro(500, vMessage, '')
  }
}

async function hubAlterar(pUrl, pBody) {
  try {
    pBody.permissaoFiliais = global.usuarioLogin ? global.usuarioLogin.filiais : [-1]
    const vRetorno = await axios.put(pUrl, pBody)
    return vRetorno.data
  } catch (e) {
    let vMessage = `Erro ao acessar hub: ${pUrl}`

    if (e.response) {
      vMessage += ` ${e.response.status} ${e.response.statusText}`
    }
    if (e.response && e.response.data) {
      vMessage += ` ${e.response.data.mensagem}`
    } else {
      vMessage = ` ${e.errno} ${e.code} ${e.address}`
    }
    throw new BaseErro(500, vMessage, '')
  }
}

async function hubListarEspecial(pUrl, req) {
  try {
    req.body.permissaoFiliais = global.usuarioLogin ? global.usuarioLogin.filiais : [-1]

    const vRetorno = await axios.post(pUrl, req.body)
    return vRetorno.data
  } catch (e) {
    let vMessage = `Erro ao acessar hub: ${pUrl}`

    if (e.response) {
      vMessage += ` ${e.response.status} ${e.response.statusText}`
    }
    if (e.response && e.response.data) {
      vMessage += ` ${e.response.data.mensagem}`
    } else {
      vMessage = ` ${e.errno} ${e.code} ${e.address}`
    }
    throw new BaseErro(500, vMessage, '')
  }
}

const functions = {
  hubListar: (pUrl, pParams) => hubListar(pUrl, pParams),
  hubObter: (pUrl, pCodigo, pReq) => hubObter(pUrl, pCodigo, pReq),
  hubAlterar: (pUrl, pBody) => hubAlterar(pUrl, pBody),
  hubListarEspecial: (pUrl, req) => hubListarEspecial(pUrl, req),
}

export default functions
