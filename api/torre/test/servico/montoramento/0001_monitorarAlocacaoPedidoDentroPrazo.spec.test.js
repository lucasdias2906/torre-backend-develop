// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797
import monitoramentoGatilhoServico from '../../../servicos/monitoramentoGatilhosServico'

const chai = require('chai')

const chaiHttp = require('chai-http')

chai.should()
chai.use(chaiHttp)

describe('/Teste Serviço Alocacao Dentro do Prazo', () => {
  it('Verificar - monitorarAlocacaoPedidoDentroPrazo - Parâmetros Insuficientes', (done) => {
    monitoramentoGatilhoServico.monitorarAlocacaoPedidoDentroPrazo({}, [])
      .then((retorno) => {
        chai.expect(retorno).to.be.equal('PARAMETROS_INSUFICIENTES')
        done()
      })
  })
})
