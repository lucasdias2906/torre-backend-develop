function BaseErro (pCodigoErro, pCodigoMensagem, pSubstituicoes) {
  this.codigoErro = pCodigoErro
  this.codigoMensagem = pCodigoMensagem
  this.substituicoes = pSubstituicoes
}

export default BaseErro
