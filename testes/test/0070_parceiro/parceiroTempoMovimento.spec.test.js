// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vParceiroTempoMovimento = {
    "hubParceiroId": "999999",
    "hubFornecedorId": "489",
    "descricaoFornecedor": "FOTOGRAVURA ZEYANA LTDA",
    "tempoAguardandoPatio": "16:12",
    "tempoCarregamento": "09:00",
    "tempoDescarga": "03:00",
    "tempoEmissao": "02:00",
    "tempoFornecedor": "11:00",
    "tempoFreeTimeCliente": "10:00",
    "tempoMaxCliente": "02:00",
    "tempoSlaEntrega": "11:00",
    "identificacaoClassificacaoVeiculo": 13,
    "descricaoClassificacaoVeiculo": "BI-TREM GRANELEIRO"
  };

 
const vParceiroTempoMovimentoAlterado = {
    "hubParceiroId": "999999",
    "hubFornecedorId": "489",
    "descricaoFornecedor": "FOTOGRAVURA ZEYANA LTDA",
    "tempoAguardandoPatio": "16:12",
    "tempoCarregamento": "09:00",
    "tempoDescarga": "03:00",
    "tempoEmissao": "02:00",
    "tempoFornecedor": "11:00",
    "tempoFreeTimeCliente": "10:00",
    "tempoMaxCliente": "02:00",
    "tempoSlaEntrega": "11:00",
    "identificacaoClassificacaoVeiculo": 13,
    "descricaoClassificacaoVeiculo": "BI-TREM GRANELEIRO"
  };

 let vParceiroTempoMovimentoId;

const vUrlBase = global.urlBase

    describe('/Parceiro Tempo Movimento', () => {

        it('Incluir Parceiro Tempo Movimento', (done) => {
            chai.request(vUrlBase)
                .post(`/api/parceiro/tempomovimento`)
                .set('x-access-token',  global.token)
                .send(vParceiroTempoMovimento)
                .end((err, res) => {
                    vParceiroTempoMovimentoId = res.body.dados._id;
                    res.should.have.status(200);
                    done();
                });
        });

        it('Obter Parceiro Tempo Movimento pelo _id', (done) => {
            chai.request(vUrlBase)
                .get(`/api/parceiro/134/tempomovimento/${vParceiroTempoMovimentoId}`)
                .set('x-access-token', global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Listagem Parceiro Tempo Movimento', (done) => {
            chai.request(vUrlBase)
                .get(`/api/parceiro/134/tempomovimento`)
                .set('x-access-token', global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        
        it('Atualizar Parceiro Tempo Movimento', (done) => {
            chai.request(vUrlBase)
                .put(`/api/parceiro/tempomovimento/${vParceiroTempoMovimentoId}`)
                .set('x-access-token',  global.token)
                .send(vParceiroTempoMovimentoAlterado)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Exclui Parceiro Tempo Movimento', (done) => {
            chai.request(vUrlBase)
                .delete(`/api/parceiro/tempomovimento/${vParceiroTempoMovimentoId}`)
                .set('x-access-token',  global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

    });
 
