// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

describe('/Módulos', () => {

    it('Incluir Módulo', (done) => {
        chai.request(vUrlBase)
            .post('/api/modulo')
            .set('x-access-token', global.token)
            .send({ nome: 'Módulo Teste Automatizado'}) 
            .end((err, res) => {
                console.log("Módulo inserido:" ,res.body.dados._id);                
                res.should.have.status(200);
                global.moduloId = res.body.dados._id;
                console.log(" global.moduloId:" ,  global.moduloId);                
                done();
            });
    });

    it('Incluir Funcionalidade', (done) => {
        chai.request(vUrlBase)
            .post(`/api/modulo/${global.moduloId}/funcionalidade`)
            .set('x-access-token', global.token)
            .send({ nome: 'Funcionalidade Teste Automatizado'}) 
            .end((err, res) => {
                console.log("Funcionadade inserido:" + res.body.dados._id);
                global.funcionalidadeId = res.body.dados._id;
                res.should.have.status(200);
                done();
            });
    });

    it('Obter Veículo por codigoVeiculo', (done) => {
        chai.request(vUrlBase)
            .get(`/api/veiculo/${global.codigoVeiculo}`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
