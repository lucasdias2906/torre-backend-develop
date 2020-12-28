// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797
import moment from 'moment'
import monitoramentoGatilhoServico from '../../../servicos/monitoramentoGatilhosServico'
import util from '../../../funcoes/utilitarios'

const chai = require('chai')

const chaiHttp = require('chai-http')

chai.should()
chai.use(chaiHttp)

let parametros = []
let pedido = { placaVeiculo: 'DBL-4H25' }
let posicao_atual =
  {
    dataHora: new Date(),
    descricao: 'Teste',
    idMenssagem: 1,
    idRastreador: 1,
    latitude: -22.9223365100905,
    longitude: -45.4037798009111,
    placa: 'DBL-4H25',
    ignicao: 0,
    velocidade: 0,
    dataHoraUltimaComunicacao: new Date(),
  }


describe('/0027_RASTREADOR_PEDIDO_CAVALO_SEM_COMUNICACAO', () => {

  it('Verificar - Parâmetros Insuficientes', (done) => {
    monitoramentoGatilhoServico.monitorarPedidoRastreadorCavaloSemComunicacao({}, [], posicao_atual)
      .then((retorno) => {
        chai.expect(retorno).to.be.equal('PARAMETROS_INSUFICIENTES')
        done()
      })
  })
  parametros = [{ codigo: 'PRAZO_VERIFICACAO_CAVALO', valor: '02' }]
  it('Verificar - Pedido placa não informada', (done) => {
    monitoramentoGatilhoServico.monitorarPedidoRastreadorCavaloSemComunicacao({}, parametros, posicao_atual)
      .then((retorno) => {
        chai.expect(retorno).to.be.equal('PEDIDO_PLACA_NAO_INFORMADA')
        done()
      })
  })

  parametros = [{ codigo: 'PRAZO_VERIFICACAO_CAVALO', valor: '02' }]
  it('Verificar - Posição Atual não informado', (done) => {
    monitoramentoGatilhoServico.monitorarPedidoRastreadorCavaloSemComunicacao(pedido, parametros, null)
      .then((retorno) => {
        chai.expect(retorno).to.be.equal('POSICAO_ATUAL_NAO_INFORMADA')
        done()
      })
  })

  parametros = [{ codigo: 'PRAZO_VERIFICACAO_CAVALO', valor: '02' }]
  pedido = { placaVeiculo: 'DBL-4H25' }
  const posicao_atual_ok = {
    dataHora: util.obterDataCorrente(),
    descricao: 'Teste',
    idMenssagem: 1,
    idRastreador: 1,
    latitude: -22.9223365100905,
    longitude: -45.4037798009111,
    placa: 'DBL-4H25',
    ignicao: 0,
    velocidade: 0,
  }

  it('Verificar - Comunicação OK', (done) => {
    monitoramentoGatilhoServico.monitorarPedidoRastreadorCavaloSemComunicacao(pedido, parametros, posicao_atual_ok)
      .then((retorno) => {
        chai.expect(retorno).to.be.equal('COMUNICACAO_CAVALO_OK')
        done()
      })
  })


  parametros = [{ codigo: 'PRAZO_VERIFICACAO_CAVALO', valor: '02' }]
  pedido = { placaVeiculo: 'DBL-4H25' }
  const posicao_atual_nao_ok = {
    dataHora: util.obterDataCorrente().subtract(3, 'hours'),
    descricao: 'Teste',
    idMenssagem: 1,
    idRastreador: 1,
    latitude: -22.9223365100905,
    longitude: -45.4037798009111,
    placa: 'DBL-4H25',
    ignicao: 0,
    velocidade: 0,
    dataHoraUltimaComunicacao: null,
  }

  it('Verificar - Comunicação Não OK', (done) => {
    monitoramentoGatilhoServico.monitorarPedidoRastreadorCavaloSemComunicacao(pedido, parametros, posicao_atual_nao_ok)
      .then((retorno) => {
        chai.expect(retorno).to.be.equal('OK')
        done()
      })
  })



})
