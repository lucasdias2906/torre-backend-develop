import mensagens from '../funcoes/traducao/traducao_pt_BR';

function erroControlador(err, req, res, next) {

  console.log('Erro no hub:', err)

  const vCodigoErro = err.codigoErro || 500;
  const vCodigoMensagem = err.codigoMensagem || err.message || 'ERRONAODEFINIDO';
  const vMensagem = mensagens[vCodigoMensagem]
    ? mensagens[vCodigoMensagem]
    : vCodigoMensagem;

  const vErro = { mensagem: vMensagem };

  res.status(vCodigoErro).send(vErro);
}

export default erroControlador;
