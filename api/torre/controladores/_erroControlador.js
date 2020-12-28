/* eslint-disable no-console */
import mensagens from '../funcoes/traducao/traducao'

import logErroServico from '../servicos/_logErroServico'

// eslint-disable-next-line no-unused-vars
function erroControlador (err, req, res, next) {
  console.log('req Body :', req.body)
  console.log('req Query :', req.query)
  console.log('req Params :', req.params)
  console.log('"err Torre', err)

  try {
    logErroServico.incluir(JSON.stringify(err))
  } catch (e) {
    console.log('"err Torre', e)
  }

  const vCodigoErro = err.codigoErro || 500

  let vMensagem = mensagens.obter('pt-br', err.codigoMensagem, err.substituicoes)

  if (!vMensagem) vMensagem = err.message || err.codigoMensagem || 'ERRONAODEFINIDO'

  console.log('vMensagem:', vMensagem)

  res.status(vCodigoErro).send({ mensagem: vMensagem, codigo: err.codigoMensagem || 'ERRONAODEFINIDO' })
}

export default erroControlador
