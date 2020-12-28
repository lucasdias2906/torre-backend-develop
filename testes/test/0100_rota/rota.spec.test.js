let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

const itemHubRotaId = 1;
const itemHubVeiculoClassificacaoId = 1;
let vRotaDadoComplementarId;

const itemRota = {
    "hubRotaId": itemHubRotaId,
    "hubVeiculoClassificacaoId": itemHubVeiculoClassificacaoId,
    "velocidadeMediaVazio": 129,
    "velocidadeMediaCarregado": 39
};

const itemRotaAtualizada = {
    "hubRotaId": itemHubRotaId,
    "hubVeiculoClassificacaoId": itemHubVeiculoClassificacaoId,
    "velocidadeMediaVazio": 50,
    "velocidadeMediaCarregado": 50
};

describe('Rota - Dados Complementares', () => {

    it('Incluir Dado Complementar de uma Rota', (done) => {
        chai.request(vUrlBase)
            .post('/api/rota/dadosComplementares')
            .set('x-access-token', global.token)
            .send(itemRota) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                res.body.dados.should.not.have.property('dados')
                done();
            });
    });

    it('Atualizar Dado Complementar de uma Rota', (done) => {
        chai.request(vUrlBase)
            .post('/api/rota/dadosComplementares')
            .set('x-access-token', global.token)
            .send(itemRotaAtualizada) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                res.body.dados.should.not.have.property('dados')
                done();
            });
    });

    it('Listar Dados Complementares de uma Rota', (done) => {
        chai.request(vUrlBase)
            .get(`/api/rota/${itemHubRotaId}/dadosComplementares`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.not.have.property('dados');
                vRotaDadoComplementarId = res.body.dados[0]._id;
                done();
            });
    });

    it('Exclui Dados Complementares de uma Rota', (done) => {
        console.log("vRotaDadoComplementarId", vRotaDadoComplementarId);
        chai.request(vUrlBase)
            .delete(`/api/rota/dadosComplementares/${vRotaDadoComplementarId}`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

});
