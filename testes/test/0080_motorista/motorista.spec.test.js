let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

const vMotoristaCodigo = 10;

const itemMotoristaValido = {
    "codigoMotorista": vMotoristaCodigo,
    "valorSalarioBase": 10,
    "valorTotalEncargos": 20,
    "valorTotalBeneficios": 30,
    "quantidadeHorasExtras": 40,
    "codigoSegurancaCNH": "12345478900",
    "valorCafeManha": "123.00",
    "valorAlmoco": "20.00",
    "valorJantar": 22.99,
    "valorPerNoite": 23
};

const itemMotoristaAtualizado = {
    "codigoMotorista": vMotoristaCodigo,
    "valorSalarioBase": 999,
    "valorTotalEncargos": 20,
    "valorTotalBeneficios": 30,
    "quantidadeHorasExtras": 40,
    "codigoSegurancaCNH": "12345478900",
    "valorCafeManha": "123.00",
    "valorAlmoco": "20.00",
    "valorJantar": 22.99,
    "valorPerNoite": 23
};

describe('Motorista', () => {

    it('Incluir Dado Complementar de um Motorista', (done) => {
        chai.request(vUrlBase)
            .post('/api/motorista/dadosComplementares')
            .set('x-access-token', global.token)
            .send(itemMotoristaValido) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                res.body.dados.should.not.have.property('dados')
                done();
            });
    });

    it('Atualizar Dado Complementar de um Motorista', (done) => {
        chai.request(vUrlBase)
            .post('/api/motorista/dadosComplementares')
            .set('x-access-token', global.token)
            .send(itemMotoristaAtualizado) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                res.body.dados.should.not.have.property('dados')
                done();
            });
    });

    it('Obter Dado Complementar de um Motorista', (done) => {
        chai.request(vUrlBase)
            .get(`/api/motorista/${vMotoristaCodigo}/dadosComplementares`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                res.body.dados.should.not.have.property('dados')
                done();
            });
    });


});
