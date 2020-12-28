// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vParceiroTempoLimite = {
    "hubParceiroId": "999999",
    "tempoLimitePedidoAceite": "00:30"
  };

 
const vParceiroTempoLimiteAlterado = {
    "tempoLimitePedidoAceite": "03:30"
  };

 let vParceiroTempoLimiteId;

const vUrlBase = global.urlBase

    describe('/Parceiro Tempo Limite', () => {

        it('Incluir Parceiro Tempo Limite', (done) => {
            chai.request(vUrlBase)
                .post(`/api/parceiro/tempolimiteaceite`)
                .set('x-access-token',  global.token)
                .send(vParceiroTempoLimite)
                .end((err, res) => {
                    vParceiroTempoLimiteId = res.body.dados._id;
                    res.should.have.status(200);
                    done();
                });
        });

        it('Obter Parceiro Tempo Limite pelo _id', (done) => {
            chai.request(vUrlBase)
                .get(`/api/parceiro/99999/tempolimiteaceite/${vParceiroTempoLimiteId}`)
                .set('x-access-token', global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

       
        it('Atualizar Parceiro Tempo Limite', (done) => {
            chai.request(vUrlBase)
                .put(`/api/parceiro/tempolimiteaceite/${vParceiroTempoLimiteId}`)
                .set('x-access-token',  global.token)
                .send(vParceiroTempoLimiteAlterado)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Exclui Parceiro Tempo Limite', (done) => {
            chai.request(vUrlBase)
                .delete(`/api/parceiro/tempolimiteaceite/${vParceiroTempoLimiteId}`)
                .set('x-access-token',  global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

    });
 
