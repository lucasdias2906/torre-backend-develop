import jwt from 'jsonwebtoken';
import Token from '../modelos/token';
import authConfig from '../configuracao/auth';
import TokenRepositorio from '../repositorios/tokenRepositorio';

import BaseErro from './base/baseErro';

async function invalidar(pToken) {

  try {
    await jwt.verify(pToken, authConfig.secret);
  } catch (error) {
    throw new BaseErro(400, 'autenticacaoRevalidarTokenInvalido');
  }

  const token = new Token({
    token: pToken,
    dataInativacao: new Date(),
    status: "I"
  })
  return token.save();
}

async function estaValido(pToken) {
  const tokenRepositorio = new TokenRepositorio();
  const vToken = await tokenRepositorio.obterUm({ token: pToken })
  return vToken === null;
}

function gerarToken(params = {}) {

  return jwt.sign(params, authConfig.secret, {
    expiresIn: authConfig.tempoLogado,
  });
}

function decodificarToken(token) {
  return jwt.decode(token, { complete: true });
}

const tokenServico = {
  invalidar: async (pToken) => { return invalidar(pToken) },
  estaValido: async (pToken) => { return estaValido(pToken) },
  gerarToken: (params) => { return gerarToken(params) },
  decodificarToken: (pToken) => { return decodificarToken(pToken) }
}

export default tokenServico;
