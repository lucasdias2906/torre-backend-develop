// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797


let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vVeiculoCustoFixo = {
    "codigoVeiculo": "XXXXXXX",
    "vigenciaCustoFixo": "2031-02-11T18:16:41.279Z",
    "custoReposicaoFrota": 10,
    "custoRemuneracaoFrota": 10,
    "custoMotoristaTotal": 10,
    "custoFixoTotal": 10,
    "custoDocumentosImpostos": 10,
    "custoRastreador": 10,
    "custoSeguro": 10
 };

 
const vVeiculoCustoFixoAlterado = {
    "codigoVeiculo": "XXXXXXX",
    "vigenciaCustoFixo": "2031-02-11T18:16:41.279Z",
    "custoReposicaoFrota": 30,
    "custoRemuneracaoFrota": 30,
    "custoMotoristaTotal": 30,
    "custoFixoTotal": 30,
    "custoDocumentosImpostos": 30,
    "custoRastreador": 30,
    "custoSeguro": 30
 };

 let vVeiculoCustoFixoId;


//const vUrlBase = "http://localhost:8080";
const vUrlBase = global.urlBase

describe('/POST Autenticação Veículo', () => {

    describe('/GET Veículo', () => {

        it('Obter Veículo por codigoVeiculo', (done) => {
            chai.request(vUrlBase)
                .get(`/api/veiculo/${global.codigoVeiculo}`)
                .set('x-access-token',  global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        

        it('Incluir Custo Fixo de Veículo', (done) => {
            chai.request(vUrlBase)
                .post(`/api/veiculo/${vVeiculoCustoFixo.codigoVeiculo}/custoFixo`)
                .set('x-access-token',  global.token)
                .send(vVeiculoCustoFixo)
                .end((err, res) => {
                    console.log("res.body.dados._id:", res.body.dados._id);
                    vVeiculoCustoFixoId = res.body.dados._id;
                    res.should.have.status(200);
                    done();
                });
        });

        it('Atualizar Custo Fixo de Veículo', (done) => {
            chai.request(vUrlBase)
                .put(`/api/veiculo/custoFixo/${vVeiculoCustoFixoId}`)
                .set('x-access-token',  global.token)
                .send(vVeiculoCustoFixoAlterado)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Exclui Custo Fixo de Veículo', (done) => {
            chai.request(vUrlBase)
                .delete(`/api/veiculo/custoFixo/${vVeiculoCustoFixoId}`)
                .set('x-access-token',  global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

    });
});
