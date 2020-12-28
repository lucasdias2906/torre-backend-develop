const fs = require('fs')
const path = require('path')

function obter (pLinguagem, pCodigoMensagem, pSubstituicoes) {
  let listaMensagens = null

  if (pLinguagem) {
    try {
      listaMensagens = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./mensagens_${pLinguagem}.json`), 'utf8'))
    } catch (e) {
      console.log(e)
    }
  }

  if (!listaMensagens) listaMensagens = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mensagens_pt-br.json'), 'utf8')) // default Português

  let vMensagem = listaMensagens[pCodigoMensagem]

  if (!vMensagem) vMensagem = pCodigoMensagem
  else if (pSubstituicoes && Array.isArray(pSubstituicoes)) {
    for (let i = 0; i <= pSubstituicoes.length; i += 1) {
      vMensagem = vMensagem.replace('%%%', pSubstituicoes[i])
    }
  }

  return vMensagem
}

const mensagens = {
  obter: (pLinguagem, pCodigoMensagem, pSubstituicoes) => obter(pLinguagem, pCodigoMensagem, pSubstituicoes),
}

export default mensagens
