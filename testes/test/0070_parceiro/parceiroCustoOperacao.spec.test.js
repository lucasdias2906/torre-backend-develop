// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797


let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vParceiroCustoOperacao = {
    "hubParceiroId": "999999",
    "codigoTipoOperacao": "10",
    "descricaoTipoOperacao": "teste descrição tipo operação",
    "identificacaoClassificacaoVeiculo": "15",
    "descricaoClassificacaoVeiculo": "Teste Classificação Veículo",
    "valorCustoFreeTime": "2.52",
    "tempoLimitePedidoAceite": "00:30"
  };

 
const vParceiroCustoOperacaoAlterado = {
    "codigoTipoOperacao": "30",
    "descricaoTipoOperacao": "teste descrição tipo operação",
    "identificacaoClassificacaoVeiculo": "15",
    "descricaoClassificacaoVeiculo": "Teste Classificação Veículo",
    "valorCustoFreeTime": "2.52",
    "tempoLimitePedidoAceite": "00:30"
 };

 let vParceiroCustoOperacaoId;


//const vUrlBase = "http://localhost:8080";
const vUrlBase = global.urlBase

    describe('/Parceiro Custo Operação', () => {

        it('Incluir Parceiro Custo Operação', (done) => {
            chai.request(vUrlBase)
                .post(`/api/parceiro/custooperacao`)
                .set('x-access-token',  global.token)
                .send(vParceiroCustoOperacao)
                .end((err, res) => {
                    vParceiroCustoOperacaoId = res.body.dados._id;
                    res.should.have.status(200);
                    done();
                });
        });

        it('Obter Parceiro Custo Operação pelo _id', (done) => {
            chai.request(vUrlBase)
                .get(`/api/parceiro/134/custooperacao/${vParceiroCustoOperacaoId}`)
                .set('x-access-token', global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Listagem Parceiro Custo Operação', (done) => {
            chai.request(vUrlBase)
                .get(`/api/parceiro/134/custooperacao`)
                .set('x-access-token', global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        
        it('Atualizar Parceiro Custo Operação', (done) => {
            chai.request(vUrlBase)
                .put(`/api/parceiro/custooperacao/${vParceiroCustoOperacaoId}`)
                .set('x-access-token',  global.token)
                .send(vParceiroCustoOperacaoAlterado)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Exclui Parceiro Custo Operação', (done) => {
            chai.request(vUrlBase)
                .delete(`/api/parceiro/custooperacao/${vParceiroCustoOperacaoId}`)
                .set('x-access-token',  global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

    });
 
