import urlHub from '../configuracao/hub';
import baseServico from './base/baseServico';

function listar(vReq) {
  const vUrl = `${urlHub.tipoCarga}`;
  return baseServico.hubListar(vUrl, vReq.query);
}

function obter(pTpCargaId) {
  const vUrl = `${urlHub.tipoCarga}`;
  return baseServico.hubObter(vUrl, pTpCargaId);
}

const functions = {
  listar: (req) => { return listar(req) },
  obter: (pTpCargaId) => { return obter(pTpCargaId) }
}

export default functions;
